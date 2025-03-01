import React, { useEffect, useState } from "react";
import logo from "../assets/sync_logo.png";
import { Link, useNavigate } from "react-router-dom";
const Slideshow = ({ cards }) => {
  const [storeId, setStoreId] = useState(null);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");
  // checks login status and performs redirect to login page and get csrf token

  const handlePresentClientView = async () => {
    navigate(`/client/${storeId}`);
  };
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
          setStoreId(data.store_id);
        } else {
          console.log("User is not authenticated - redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Make a request to the PHP logout endpoint
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/logout.php",
        {
          method: "POST", // Use POST method to send data securely
        }
      );

      // Check if the logout was successful
      const result = await response.json();
      if (result.status === "success") {
        console.log(result.message);
        // Clear the auth token from local storage
        localStorage.removeItem("auth_token");
        // Redirect to the home page or login page
        navigate("/");
      } else {
        console.error("Failed to logout", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  const nextIndex = (currentIndex + 1) % cards.length;

  return (
    <div className="max-h-screen">
      <div className="flex justify-end flex-wrap-reverse items-center w-full px-4">
        <div className="flex items-center flex-wrap">
          {storeId && (
            <div
              onClick={handlePresentClientView}
              className="text-md cursor-pointer text-center shadow-2xl px-6 py-4 rounded-xl button hover:bg-violet-700 mr-4"
            >
              Present Client View
            </div>
          )}
          <Link to="/profile">
            <div className="text-md text-center shadow-2xl my-2 px-6 py-4 rounded-xl button hover:bg-violet-700 mr-4">
              Modify Services
            </div>
          </Link>
          <div
            onClick={handleLogout}
            className="text-md cursor-pointer text-center shadow-2xl my-2 px-6 py-4 rounded-xl button hover:bg-violet-700"
          >
            Logout
          </div>
        </div>
        <img src={logo} className="w-24 h-24" alt="Schedule Sync Logo" />
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

const CardContent1 = () => {
  const [waitList, setWaitList] = useState([]);
  const [totalTime, setTotalTime] = useState("00:00");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  // get csrf token
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
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [navigate]);
  // Function to fetch wait list
  const fetchWaitList = async () => {
    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/waitList.php"
      );
      const data = await response.json();
      console.log(data);
      setWaitList(data.reverse());
    } catch (error) {
      console.error("Failed to fetch wait list", error);
    }
  };

  // Function to delete an item from the wait list
  const csrfTokenF = {
    csrf_token: "",
  };
  const deleteWaitListItem = async (id) => {
    const csrfTokenForm = { ...csrfTokenF, csrf_token: csrfToken };
    try {
      console.log(id);
      await fetch(
        `https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/waitList.php/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(csrfTokenForm),
        }
      );
      fetchWaitList();
    } catch (error) {
      console.error("Failed to delete wait list item", error);
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
              <div
                className="px-4 cursor-pointer"
                onClick={() => deleteWaitListItem(item.app_id)}
              >
                x
              </div>
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
        if (data.check === "success") {
          setCsrfToken(data.csrfToken);
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated - redirecting to login");
          navigate('/login');
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch services and technicians
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/appointment.php"
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
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, csrf_token: csrfToken };
    try {
      // Send a POST request to your PHP backend
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/appointment.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData), // Add the formData as the request payload
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
        Add Appointment
      </h2>
      <form className="p-8 max-w-lg mx-auto rounded" onSubmit={handleSubmit}>
        {/* Flex container for the first name and last name inputs to make them responsive */}
        <div className="flex -mx-3 mb-4">
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <div className="w-full md:w-1/2 px-3">
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
          <div className="w-full md:w-1/2 px-3">
            <input
              className="form-input mt-1 block w-full px-3 py-2  bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <input
            className="form-input mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none"
            type="text"
            name="date"
            placeholder="Date (mm/dd/yyyy)"
            value={formData.date}
            onChange={handleChange}
            pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\d{4}"
            required
          />
        </div>
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
        <div className="mb-4">
          <select
            className="form-select mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            name="selectedService"
            value={formData.selectedService}
            onChange={handleChange}
            required
          >
            <option>Select Service(s)</option>
            {/* Populate with actual services */}
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
            {/* Populate with actual technicians */}
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.technician_name}
              </option>
            ))}
          </select>
        </div>
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
        if (data.check === "success") {
          setCsrfToken(data.csrfToken);
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated - redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, [navigate]);

  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Fetch feedback data
        const response = await fetch(
          "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/adminFeedback.php"
        );
        const data = await response.json();
        setFeedbackData(data.feedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);


  return (
    <div className="container mx-auto px-4">
      <h2 className="text-lg font-bold text-white text-center">
          Customer Feedback
        </h2>
        <div>
        {feedbackData.map((item, index) => (
          <div key={index} className="my-4">
            <p className="text-[#FCAEFA]">
              Client Name (Email): {item.customer_name} ({item.email})
            </p>
            <p className="text-white">Feedback:</p>
            <p className="text-white">{item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const cardData = [
  { content: <CardContent1 /> },
  { content: <CardContent2 /> },
  { content: <CardContent3 /> },
];

const App = () => {
  return <Slideshow cards={cardData} />;
};

export default App;