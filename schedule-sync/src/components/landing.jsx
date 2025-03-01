import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/sync_logo.png";
import spark from "../assets/spark-icon.png";
import shake from "../assets/shake-icon.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Landing() {
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Designs follow from the Figma design outlined on Trello */}
      <div className="flex flex-wrap md:justify-between">
        <img src={logo} width="225" height="225" alt="Schedule Sync Logo" />
        <div className="flex flex-wrap">
          <Link to="/login">
            <div className="font-semibold text-xl text-center shadow-2xl float-right m-8 px-10 py-4 rounded-xl bg-indigo-400 hover:bg-violet-200">
              Login
            </div>
          </Link>
          <Link to="/register">
            <div className="font-semibold text-xl text-center shadow-2xl float-right m-8 px-8 py-4 rounded-xl bg-indigo-900 hover:bg-violet-200">
              Register
            </div>
          </Link>
          <br></br>
        </div>
      </div>
      {/* Container for the body content */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center mt-12 px-4">
        <div className="text-center md:w-1/2 lg:w-2/5 mx-4 mb-8 md:mb-0">
          <h1 className="text-indigo-300 text-3xl md:text-4xl">
            Empower Businesses
          </h1>
          <p className="text-xl text-white">
            with a seamless client management and organization system.
          </p>
          <img
            src={spark}
            alt="Power Icon"
            className="mx-auto my-4 w-12 h-12"
          />
          <div className="mt-4 rounded-xl py-6 shadow px-4">
            <h1 className="text-xl font-bold text-white">Get Started Today!</h1>
            <input
              id="bname"
              name="bname"
              type="text"
              placeholder="Business Name"
              className="h-10 my-4 w-full px-2"
            />
            <Link
              to="/register"
              className="inline-block w-full py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
            >
              Register Now
            </Link>
          </div>
        </div>
        <div className="flex h-screen sm:hidden md:block">
          <div className="m-auto relative h-full bg-indigo-400 w-1"></div>
        </div>{" "}
        <div className="text-center md:w-1/2 lg:w-2/5 mx-4">
          <h1 className="text-indigo-300 text-3xl md:text-4xl">
            Create Opportunity
          </h1>
          <p className="text-xl text-white">
            by mitigating the complexities of scheduling, effortlessly
            transforming them into opportunities for enhanced client
            relationships.
          </p>
          <img
            src={shake}
            alt="Handshake Icon"
            className="mx-auto my-4 w-12 h-12"
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
