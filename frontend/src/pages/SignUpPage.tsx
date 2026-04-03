import { useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setCredentials } from "../store/slices/authSlice";

const SignUpPage = () => {
  const { email } = useParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validate = () => {
    let valid = true;
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    if (!username) {
      setUsernameError("Username is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      valid = false;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Two passwords must be same.");
      setConfirmPasswordError("Two passwords must be same.");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        },
      );
      dispatch(
        setCredentials({
          token: response.data.token,
          employee: response.data.employee,
        }),
      );
      navigate("/onboardingApplication");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data.errors;
        if (
          "username" in errors &&
          errors["username"] === "Username already in use"
        ) {
          setUsernameError(errors["username"]);
        }
        if ("email" in errors && errors["email"] === "Email already in use") {
          setEmailError(errors["email"]);
        }
      } else {
        alert("Network error, please try again");
      }
    }
  };

  return (
    <>
      <h1>Create Account</h1>
      <p>Complete your registration to get started</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a unique username"
          />
          {usernameError && <span>{usernameError}</span>}
        </div>
        <div>
          <label>Email</label>
          <input disabled type="text" value={email} />
          {emailError && <span>{emailError}</span>}
        </div>
        <div>
          <label>Password</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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
        <div>
          <label>Confirm Password</label>
          <div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {confirmPasswordError && <span>{confirmPasswordError}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};
export default SignUpPage;
