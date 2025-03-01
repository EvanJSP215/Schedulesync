import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";

const Register = () => {
  // used for redirects
  const navigate = useNavigate();
  // checks login status and performs redirect to admin if auth
  useEffect(() => {
    console.log("useEffect is running - Checking login status");
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
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [navigate]);

  // Form contents
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "", // New field for password confirmation
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
  });

  const handleChange = (event) => {
    let value = sanitizeHtml(event.target.value);
    if (event.target.id === "password") {
      value = value.replace(/\s/g, "");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: value,
    }));

    // Check password requirements based only on formData.password
    if (event.target.name === "password") {
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordRequirements = (password) => {
    // Define password requirements
    const minLength = password.length >= 10;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialCharacter =
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) && /\S/.test(password);

    // Update the checklist
    setPasswordRequirements({
      minLength,
      uppercase,
      lowercase,
      number,
      specialCharacter,
    });
  };

  const handleCopyPaste = (event) => {
    // Prevent copying, cutting, and pasting for password and confirmPassword fields
    if (
      event.target.id === "password" ||
      event.target.id === "confirmPassword"
    ) {
      event.preventDefault();
    }
  };

  const handleSubmit = async (event) => {
    // prevent an empty form from being sent to the server
    event.preventDefault();

    // password validation before sending data
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const allRequirementsMet = Object.values(passwordRequirements).every(
      (requirement) => requirement
    );

    if (!allRequirementsMet) {
      alert(
        "Password does not meet all the requirements. Please check the checklist."
      );
      return;
    }

    // attempt to reach the server outlined below and send the user submitted data as JSON
    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/index.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      // Handle the response from the server as needed
      const result = await response.json();
      console.log(result);
      navigate("/login");
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-300">
            Register
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          action="#"
          method="POST"
        >
          <div className="rounded-md shadow-sm ">
            <div className="py-1">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                onChange={handleChange}
                // Prevents XSS by treating the input as text, not HTML
                value={formData.email}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                required
              />
            </div>
            <div className="py-1">
              <input
                type="text"
                id="businessName"
                name="businessName"
                placeholder="Business Name"
                onChange={handleChange}
                value={formData.businessName}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                required
              />
            </div>
            <div className="py-1">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
                required
              />
              {formData.password && (
                <div className="text-xs mt-1">
                  <ul>
                    <li
                      className={`flex items-center ${
                        passwordRequirements.minLength
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordRequirements.minLength && (
                        <span className="mr-1">&#10003;</span>
                      )}
                      at least 10 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordRequirements.uppercase
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordRequirements.uppercase && (
                        <span className="mr-1">&#10003;</span>
                      )}
                      at least one uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordRequirements.lowercase
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordRequirements.lowercase && (
                        <span className="mr-1">&#10003;</span>
                      )}
                      at least one lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordRequirements.number
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordRequirements.number && (
                        <span className="mr-1">&#10003;</span>
                      )}
                      at least one number
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordRequirements.specialCharacter
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordRequirements.specialCharacter && (
                        <span className="mr-1">&#10003;</span>
                      )}
                      at least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="py-1">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                // Prevents XSS by treating the input as text, not HTML
                value={formData.confirmPassword}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className={"or-container"}>
          <span className="or-text">OR</span>
        </div>
        <p className="login-link text-center">
          Have an account?{" "}
          <Link className="text-purple-300" to="/login">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
