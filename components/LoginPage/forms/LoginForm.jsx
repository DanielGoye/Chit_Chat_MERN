import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import axios from "axios";

const LoginForm = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    const errors = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!loginDetails.email) {
      errors.email = "Please add your email.";
    } else if (!regex.test(loginDetails.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!loginDetails.password) {
      errors.password = "Please add your password.";
    }
    setFormErrors(errors);

    // Form submission
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/login",
          loginDetails
        );
        alert(response.data.message);
        setLoading(false);
      } catch (error) {
        alert(error.response.data);
        setLoading(false);
      }
    }
  };

  return (
    <form>
      <div className={styles.input_container}>
        <label>Email:</label>
        <input
          className={`${formErrors.email && styles.input_error}`}
          name="email"
          type="email"
          placeholder="Enter your email address here"
          required
          value={loginDetails.email}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.email}</span>
      </div>
      <div className={styles.input_container}>
        <label>Password:</label>
        <input
          className={`${formErrors.password && styles.input_error}`}
          name="password"
          type="password"
          placeholder="Enter your password here"
          required
          value={loginDetails.password}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.password}</span>
      </div>
      <button
        type={"submit"}
        className={styles.form_button}
        onClick={handleSubmit}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
