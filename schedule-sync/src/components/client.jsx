import React, { useState, useEffect } from "react";
import logo from "../assets/sync_logo.png";
import { useNavigate,Link , useParams} from "react-router-dom";


const Slideshow = ({ cards }) => {
  const [waitList, setWaitList] = useState([]);
  const [totalTime, setTotalTime] = useState("00:00");
  const [time, setTime] = useState("00:00");
  const [countdown, setCountdown] = useState(0);

  const { storeId } = useParams();

  useEffect(() => {
    fetch(`https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/Clientsetup.php?store_id=${storeId}`, {
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        document.cookie = `storeId=${storeId}; path=/`;
      }
    })
    .catch(error => {
      console.error('Error deleting auth_token cookie:', error);
    });
  }, [storeId]);

  const fetchWaitList = async () => {
    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/waitListClient.php"
      );
      const data = await response.json();
      console.log(data);
      setWaitList(data.reverse());
    } catch (error) {
      console.error("Failed to fetch wait list", error);
    }
  };

  useEffect(() => {
    fetchWaitList();
  }, []);

  useEffect(() => {
    if (Array.isArray(waitList)) {
      const totalMinutes = waitList.reduce(
        (acc, item) => acc + Number(item.time),
        0
      );

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTime(`${hours} Hours ${minutes} mins`);
      setTotalTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );

      // Calculate total seconds for countdown
      const totalSeconds = totalMinutes * 60;
      setCountdown(totalSeconds);

      // Store total time in local storage
      localStorage.setItem("totalTime", JSON.stringify(totalSeconds));
    } else {
      console.error("waitList is not an array:", waitList);
      setTotalTime("00:00");
    }
  }, [waitList]);

  useEffect(() => {
    // Set up countdown interval
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Store countdown in local storage
    localStorage.setItem("countdown", JSON.stringify(countdown));

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/checkLogin.php",
          {
            method: "Get",
          }
        );
        const data = await response.json();

        console.log(data.check);
        if (data.check === "success") {
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated - redirecting to login");
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  const nextIndex = (currentIndex + 1) % cards.length;

  // Format countdown time
  const formatCountdown = (countdown) => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-h-screen">
      <div className="flex flex-wrap">
        <Link to="/login" className="absolute right-8 top-8">
          <div className="text-md text-center shadow-2xl px-6 py-4 rounded-xl button hover:bg-violet-700">
            Access Admin Page
          </div>
        </Link>
      </div>

      <div className="flex flex-wrap justify-center items-center py-20 gap-4">
        <div className="flex justify-center md:absolute md:left-4 lg:left-8 xl:left-20 2xl:left-40">
          <img
            src={logo}
            className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 hidden md:block"
            alt="Schedule Sync Logo"
          />
        </div>
        <div className="flex flex-col justify-center items-center text-3xl mt-10 md:mt-0">
          {totalTime === "00:00:00" ? (
            <h1 className="font-bold">No Wait Time</h1>
          ) : (
            <>
              <h1>Estimated Wait Time:</h1>
              <h1 className="font-bold">{formatCountdown(countdown)}</h1>
            </>
          )}
        </div>
      </div>

      <div className="mb-12 flex flex-col items-center justify-center text-3xl"></div>
      <div className="flex flex-1 items-center justify-center relative">
        <button
          onClick={() => setCurrentIndex(prevIndex)}
          className="absolute left-0 z-10 m-1 rounded-full bg-gray-800 p-2 text-white focus:outline-none"
        >
          &#10094;
        </button>

        <div className="flex w-full justify-center space-x-0 md:space-x-2 px-4">
          {/* Only show previous card on medium and larger screens */}
          <div className="hidden md:block md:w-4/6 lg:w-3/6 xl:w-2/6 scale-90 opacity-50 transition-all">
            <div className="h-[65vh] flex items-center justify-center rounded-lg bg-[#1B1A55] shadow-lg">
              {cards[prevIndex].content}
            </div>
          </div>

          {/* Main card */}
          <div className="w-full md:w-4/6 lg:w-3/6 xl:w-2/6 scale-100 opacity-100 transition-all">
            <div className="h-[65vh] mx-6 md:mx-0 flex items-center justify-center rounded-lg bg-[#1B1A55] shadow-lg">
              {cards[currentIndex].content}
            </div>
          </div>

          {/* Only show next card on medium and larger screens */}
          <div className="hidden md:block md:w-4/6 lg:w-3/6 xl:w-2/6 scale-90 opacity-50 transition-all">
            <div className="h-[65vh] flex items-center justify-center rounded-lg bg-[#1B1A55] shadow-lg">
              {cards[nextIndex].content}
            </div>
          </div>
        </div>

        {/* Next Button (Shown on md and larger screens) */}
        <button
          onClick={() => setCurrentIndex(nextIndex)}
          className=" absolute right-0 z-10 m-1 rounded-full bg-gray-800 p-2 text-white focus:outline-none"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

// Queue Position is displayed here
const CardContent1 = () => {
  const [waitList, setWaitList] = useState([]);
  const [totalTime, setTotalTime] = useState("00:00");

  // Function to fetch wait list
  const fetchWaitList = async () => {
    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/waitListClient.php"
      );
      const data = await response.json();
      console.log(data);
      setWaitList(data.reverse());
    } catch (error) {
      console.error("Failed to fetch wait list", error);
    }
  };
  useEffect(() => {
    fetchWaitList();
  }, []);

  useEffect(() => {
    if (Array.isArray(waitList)) {
      const totalMinutes = waitList.reduce(
        (acc, item) => acc + Number(item.time),
        0
      );

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTotalTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      console.error("waitList is not an array:", waitList);
      setTotalTime("00:00");
    }
  }, [waitList]);

  return (
    <div className="flex flex-col w-full h-full py-10 px-5">
      <h2 className="font-bold text-[#FCAEFA] pb-5 text-center text-xl">
        Current Wait List
      </h2>
      <div className="flex justify-between py-2 px-2">
        <p className="text-white">Initials</p>
        <p> Time Remaining {totalTime}</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {" "}
        {/* Adjust the max height as needed */}
        {waitList.length > 0 ? (
          waitList.map((item) => (
            <div key={item.app_id} className="flex justify-center items-center">
              <div className="bg-[#535C91] w-full px-3 my-2">
                <div className="flex justify-between pt-3">
                  <p className="text-lg">{item.customer_name}</p>
                  <p className="text-lg">{item.time}</p>
                </div>
                {item.appointment && (
                  <p className="text-sm pb-2">appointment</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-400 font-bold ">
            No wait time
          </div>
        )}
      </div>
    </div>
  );
};

export const CardContent2 = () => {
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");
  // checks login status and performs redirect to login page and get csrf token
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/checkLogin.php",
          {
            method: "Get",
          }
        );
        const data = await response.json();

        console.log(data.check);
        if (data.check === "success") {
          setCsrfToken(data.csrfToken);
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated - redirecting to login");
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    selectedService: "",
    selectedTechnician: "",
    date: "",
    csrf_token: csrfToken,
  });
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  function getCurrentDate() {
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = currentDate.getDate();
    day = day < 10 ? "0" + day : day;
    const year = currentDate.getFullYear();
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch services and technicians
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/appointmentClient.php"
        );
        const data = await response.json();

        // Assuming your PHP returns a structure like { "services": [...], "technicians": [...] }
        setServices(data.services);
        setTechnicians(data.technicians);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: escape(event.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = getCurrentDate();
    try {
      const formDataWithDate = { ...formData, date: currentDate };
      const updatedFormData = { ...formDataWithDate, csrf_token: csrfToken };
      // Send a POST request to your PHP backend
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/appointmentClient.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        console.log(result);
        window.location.reload();
      } else {
        console.error("Fail to create an appointment", result.message);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-lg font-bold text-white text-center">
        Enter Waitlist Information
      </h2>
      <form className="p-8 max-w-lg mx-auto rounded" onSubmit={handleSubmit}>
        {/* Adjusting the div to use flex-wrap and adjusting margins/padding responsively */}
        <div className="flex flex-wrap -mx-2 mb-4">
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <div className="w-full px-2 mb-4 md:mb-0 md:w-1/2">
            <input
              className="form-input mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full px-2 md:w-1/2">
            <input
              className="form-input mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* No changes needed here as these inputs are already responsive */}
        <div className="mb-4">
          <input
            className="form-input mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            type="tel"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Select inputs for services and technician remain unchanged */}
        <div className="mb-4">
          <select
            className="form-select mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            name="selectedService"
            value={formData.selectedService}
            onChange={handleChange}
            required
          >
            <option>Select Service(s)</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.service_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <select
            className="form-select mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            name="selectedTechnician"
            value={formData.selectedTechnician}
            onChange={handleChange}
          >
            <option>Select Technician (Optional)</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.technician_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button remains unchanged */}
        <button
          className="w-full px-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export const CardContent3 = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send a GET request to your PHP backend
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/renderClient.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (Object.keys(result).length === 0) {
          console.log("The JSON data is empty.");
        } else {
          setServices(result.services);
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full py-10 px-5">
      <h2 className="text-white pb-5 text-center text-xl">
        Explore Our Services
      </h2>
      <div className="flex justify-between py-2 px-2">
        <p className="text-white">Services</p>
        <p className="text-white">Estimated Time</p>
        <p className="text-white">Price</p>
      </div>
      {services && services.length > 0 ? (
        services.map((service) => (
          <div
            key={service.id} // Assuming 'id' is a unique identifier in your data
            className="flex justify-between px-3 py-2 bg-[#636E9A] text-white"
          >
            <div>{service.service_name}</div>
            <div>{service.times_collection}</div>
            <div>{service.price_collection}</div>
          </div>
        ))
      ) : (
        <p className="text-white"> </p>
      )}
    </div>
  );
};
export const CardContent4 = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  // checks login status and performs redirect to login page and get csrf token
  useEffect(() => {
    console.log('useEffect is running - Checking login status');
    const fetchOptions = async () => {
      try {
        const response = await fetch('https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/checkLogin.php',{
          method: 'Get',
        });
        const data = await response.json();
        
        console.log(data.check);
        if (data.check === 'success') {
          setCsrfToken(data.csrfToken);
          console.log('User is authenticated');
          
        } else {
          console.log('User is not authenticated - redirecting to login');

        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
  
    fetchOptions();
  }, [navigate]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    csrf_token: csrfToken,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, csrf_token: csrfToken }; 
    try {
      // Send a POST request to your PHP backend
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/feedback.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        console.log("feedback success");
        window.location.reload();
      } else {
        alert("Failed to send feedback: ", result.message);
      }
    } catch (error) {
      alert("Error during form submission:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full py-5 px-5">
      <h2 className="font-bold text-[#FCAEFA] pb-5 text-center text-xl">
        How was you experience?
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="csrf_token" value= {csrfToken} />
          <label htmlFor="name">Name:</label>
          <input
            className="form-input mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            type="text"
            id="name"
            name="name"
            // Prevents XSS by treating the input as text, not HTML
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            className="form-input mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            type="email"
            id="email"
            name="email"
            // Prevents XSS by treating the input as text, not HTML
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            className="form-input mt-1 block w-full h-36 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            id="feedback"
            name="feedback"
            // Prevents XSS by treating the input as text, not HTML
            value={formData.feedback}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="w-full px-3 py-2 mt-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
const cardData = [
  { content: <CardContent1 /> },
  { content: <CardContent2 /> },
  { content: <CardContent3 /> },
  { content: <CardContent4 /> },
];

const App = () => {
  return <Slideshow cards={cardData} />;
};

export default App;