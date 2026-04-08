import { useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setCredentials } from "../store/slices/authSlice";
import api from "../utils/api";
import { handleError } from "../utils/error";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validate = () => {
    let valid = true;
    setUsernameError("");
    setPasswordError("");
    if (!username) {
      setUsernameError("Username is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      //   const response = await axios.post(
      //     `${import.meta.env.VITE_API_URL}/api/auth/login`,
      //     { username, password },
      //   );
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      dispatch(
        setCredentials({
          token: response.data.token,
          employee: response.data.employee,
        }),
      );
      const employee = response.data.employee;

      if (employee.role === "employee") {
        if (
          employee.onboardingApplication &&
          employee.onboardingApplication.status === "approved"
        ) {
          navigate("/");
        } else {
          navigate("/onboarding-application");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const msg = error.response.data.error;
        if (msg === "Username not existed") {
          setUsernameError(msg);
        } else if (msg === "Invalid password") {
          setPasswordError(msg);
        } else {
          setUsernameError(msg);
        }
      } else {
        handleError(error);
      }
    }
  };
  return (
    <>
      <h1>Welcome Back</h1>
      <p>Sign in to your HR Portal account</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          {usernameError && <span>{usernameError}</span>}
        </div>
        <div>
          <label>Password</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && <span>{passwordError}</span>}
        </div>
        <button type="submit">Sign In</button>
      </form>
    </>
  );
};

export default SignInPage;
