import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import sanitizeHtml from "sanitize-html";

const Profile = ({ businessName }) => {
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");

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
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [navigate]);

  const [formData, setFormData] = useState({
    services: [{ name: "", price: "", time: "" }],
    technicians: [{ name: "" }],
    image: "",
    csrf_token: csrfToken,
  });

  const handleChange = (index, key, value, type) => {
    // Prevents XSS
    const sanitizedValue = sanitizeHtml(value);
    if (type === "service") {
      const updatedServices = [...formData.services];
      updatedServices[index][key] = sanitizedValue;
      setFormData({
        ...formData,
        services: updatedServices,
      });
    } else if (type === "technician") {
      const updatedTechnicians = [...formData.technicians];
      updatedTechnicians[index][key] = sanitizedValue;
      setFormData({
        ...formData,
        technicians: updatedTechnicians,
      });
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      // Check file type and size
      if (!validateFileType(selectedImage)) {
        // Handle invalid file
        alert("Invalid file type or size.");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        // Sanitize base64String if necessary
        setFormData({
          ...formData,
          image: base64String,
        });
      };

      reader.readAsDataURL(selectedImage);
    }
  };

  // Validate file type
  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Adjust as needed
    return allowedTypes.includes(file.type);
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: "", price: "", time: "" }],
    });
  };

  const addTechnician = () => {
    setFormData({
      ...formData,
      technicians: [...formData.technicians, { name: "" }],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormData = { ...formData, csrf_token: csrfToken };
    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/profile.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      const result = await response.json();

      if (result.submit === "success") {
        navigate("/admin");
      }else{
        alert(result.message);
        console.error('submission failed:', result.message)
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="mt-8 px-4 md:px-8 lg:mt-12">
      <Link to="/admin">
            <div className="text-md text-center shadow-2xl my-2 px-3 py-4 rounded-xl button hover:bg-violet-700 inline-block">
              Admin Page
            </div>
      </Link>
      <div className="text-center text-3xl pb-2">
        <span className="text-pink-300">Hi</span> {sanitizeHtml(businessName)}
        <span className="text-pink-300">,</span>
      </div>
      <h1 className="mt-2 text-center text-xl lg:-mt-4 lg:text-2xl">
        Let's set up your business profile!
      </h1>
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          action="#"
          method="POST"
          className="w-full max-w-3xl mt-8"
        >
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <div>
            <p>
              What services do you offer and how long do these services take?
              How much should your customers expect to pay? Use the + to add
              more values.
            </p>
            {formData.services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col mb-4 gap-2 p-4 rounded-md bg-indigo-400"
              >
                <input
                  className="form-input h-8 w-full md:w-auto flex-grow rounded-md text-sm text-black"
                  placeholder=" Service Name"
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value, "service")
                  }
                />
                <div className="flex space-x-2">
                  <input
                    className="form-input h-8 w-full rounded-md text-sm text-black"
                    placeholder=" Service Price"
                    onChange={(e) =>
                      handleChange(index, "price", e.target.value, "service")
                    }
                  />
                  <input
                    className="form-input h-8 w-full rounded-md text-sm text-black"
                    placeholder=" Service Time (minutes)"
                    onChange={(e) =>
                      handleChange(index, "time", e.target.value, "service")
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={addService}
                className="h-12 w-12 rounded-full bg-pink-300 text-center hover:bg-pink-400"
              >
                +
              </button>
            </div>
            <br></br>
            <p className="mt-5">
              Who provides these services? Use the + to add more values.
            </p>
            {formData.technicians.map((technician, index) => (
              <div key={index} className="mb-4 p-4 rounded-md bg-indigo-400">
                <input
                  className="form-input h-8 w-full rounded-md text-sm text-black"
                  placeholder=" Technician Name"
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value, "technician")
                  }
                />
              </div>
            ))}
            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={addTechnician}
                className="h-12 w-12 rounded-full bg-pink-300 text-center hover:bg-pink-400"
              >
                +
              </button>
            </div>
            <br></br>
            <div className="text-center mt-5">
              <p>
                Add a business logo to help identify your business (Optional)
              </p>
              <label className="file-upload">
                {" "}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />{" "}
                <div className="flex cursor-pointer items-center justify-center rounded-md bg-pink-300 px-4 py-2 hover:bg-pink-400">
                  {" "}
                  <svg
                    className="mr-2 h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>{" "}
                  </svg>{" "}
                  Upload Image{" "}
                </div>{" "}
              </label>
            </div>
            <br></br>
            <div className="flex justify-center w-full">
              <button
                type="submit"
                className="justify-center rounded-md bg-indigo-700 px-3 py-2 text-center text-white font-semibold hover:bg-pink-400 focus:outline-none focus:shadow-outline"
              >
                Submit Form
              </button>
            </div>
            <br></br>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
