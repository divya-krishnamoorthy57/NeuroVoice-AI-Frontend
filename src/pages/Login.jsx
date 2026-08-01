import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../assets/images/logo.png";
import { loginUser, saveAuthSession } from "../services/api";

function Login() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleChange = (event) => {

    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

  };



  const handleLogin = async (event) => {

    event.preventDefault();


    if (!form.email || !form.password) {

      setError("Please enter your email and password.");
      return;

    }


    setError("");
    setIsSubmitting(true);



    try {

      const response = await loginUser({
        email: form.email,
        password: form.password,
      });



      if (response.status === "success") {


        saveAuthSession({

          access_token: response.access_token,

          user: {

            id: response.user.id,

            name: response.user.name,

            email: response.user.email,

          },

        });



        navigate("/home", {
          replace: true,
        });


      } else {

        setError("Invalid email or password.");

      }



    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Login failed."
      );


    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <div className="login-page">

      <div className="login-card">


        <img
          src={logo}
          alt="NeuroVoice AI"
          className="logo"
        />



        <h1>
          NeuroVoice AI
        </h1>


        <h2>
          Welcome Back
        </h2>


        <p>
          Continue your speech rehabilitation journey.
        </p>




        <form onSubmit={handleLogin}>


          <div className="input-group">


            <input

              type="email"

              name="email"

              placeholder="Email Address"

              value={form.email}

              onChange={handleChange}

              required

            />



            <input

              type="password"

              name="password"

              placeholder="Password"

              value={form.password}

              onChange={handleChange}

              required

            />


          </div>





          {error && (

            <p className="form-error">
              {error}
            </p>

          )}






          <div className="options">


            <label>

              <input type="checkbox" />

              Remember me

            </label>



            <a href="#">
              Forgot Password?
            </a>


          </div>





          <button
            type="submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Signing In..."
              : "Login"
            }


          </button>




        </form>





        <p className="register">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>


        </p>



      </div>


    </div>

  );

}


export default Login;