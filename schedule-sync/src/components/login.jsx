import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import sanitizeHtml from "sanitize-html";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: sanitizeHtml(event.target.value),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442g/schedulesync/login.php",
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
      if (result.status === "success") {
        console.log(result.message);
        navigate("/admin");
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Added responsive padding here */}
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-300">
            Welcome Back
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
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Email"
              />
            </div>
            <div className="py-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
            >
              Log In
            </button>
          </div>
        </form>
        <div className={"or-container"}>
          <span className="or-text">OR</span>
        </div>
        <div className="text-center">
          <p className="text-gray-300">
            Don’t have an account?{" "}
            <Link className="text-purple-300" to="/register">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
