import React,{useState} from "react";
import FormStyle from "./SiginSignup.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.log('Environment variables:', import.meta.env);
    throw new Error("VITE_BACKEND_URL is not defined in the environment file");
}

function SigninSignup({children, className}) {
    const [pageState, setPageState] = useState("signup"); // for rendering page changes login vs signup conditional
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [state, setState] = useState("username"); // for choosing email vs username
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password !== confirmPassword){
            alert("Password does not match");
            return;
        }

        await axios.post(`${URL}/api/users/signup`, { username, email, password })
            .then(response => {
                console.log("Signup successful", response.data);
    
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            })
            .catch(error => {
                console.error("Error during signup", error);
            });

        handleLogin(event);
    };

    const handleLogin = (event) => {
      event.preventDefault();
  
      const loginData = {
          password,
          state,
          ...(state === "username" ? { username } : { email })
      };
  
      console.log("Login data", loginData);
  
      axios.post(`${URL}/api/users/signin`, loginData)
          .then(response => {
              console.log("Login successful", response.data);
              
              if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
  
              if (state === "username") {
                  setEmail("");
              } else {
                  setUsername("");
              }

              navigate('/Home');
          })
          .catch(error => {
              console.error("Error during login", error);
              alert('Login failed. Please check your credentials.');
          });
  };

    return(
        <div className={`main-container ${className}`}>
    <div className={`form-container ${className}`}>
    <form 
      className={`${FormStyle.form} ${className}`} 
      onSubmit={pageState === "login" ? handleLogin : handleSubmit}
    >
      {pageState === "login" ? (
        state === "username" ? (
          <div className={`input-group ${className}`}>
            <input
              id="username"
              name="username"
              className={`${FormStyle.inputfield} ${className}`}
              type="text"
              placeholder="username"
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
        ) : (
          <div className={`input-group ${className}`}>
            <input
              id="email"
              name="email"
              className={`${FormStyle.inputfield} ${className}`}
              type="email"
              placeholder="email"
              maxLength={20}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
        )
      ) : (
        <>
          <div className={`input-group ${className}`}>
            <input
              id="username"
              name="username"
              className={`${FormStyle.inputfield} ${className}`}
              type="text"
              placeholder="username"
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className={`input-group ${className}`}>
            <input
              id="email"
              name="email"
              className={`${FormStyle.inputfield} ${className}`}
              type="email"
              placeholder="email"
              maxLength={20}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
        </>
      )}

      <div className={`input-group ${className}`}>
        <input
          id="password"
          name="password"
          className={`${FormStyle.inputfield} ${className}`}
          type="password"
          placeholder="password"
          maxLength={20}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
      </div>

      {pageState !== "login" && (
        <div className={`input-group ${className}`}>
          <input
            id="confirm_password"
            name="confirm_password"
            className={`${FormStyle.inputfield} ${className}`}
            type="password"
            placeholder="confirm password"
            maxLength={20}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm_password">Confirm Password</label>
        </div>
      )}

      {pageState === "login" && (
        <span
          onClick={() =>
            setState(state === "username" ? "email" : "username")
          }
          className={`${FormStyle.spanStyle} ${className}`}
        >
          {state === "username"
            ? "Sign in with email"
            : "Sign in with username"}
        </span>
      )}

      <button type="submit" className={`${FormStyle.submitButton} ${className}`}>
        Submit
      </button>
    </form>

    <button
      type="button"
      onClick={() =>
        setPageState(pageState === "login" ? "signUp" : "login")
      }
      className={`${FormStyle.buttonStyle} ${className}`}
    >
      {pageState === "login" ? "Signup" : "Login"}
    </button>
    </div>
    </div>
    );
}

export default SigninSignup;