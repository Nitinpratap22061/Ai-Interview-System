import axios from "axios";
import {
  Get_Login_Success,
  Login_Fail,
  Login_Success,
  Login_User_Image,
  Register_User_Fail,
  Register_User_Request,
  Register_User_Success,
} from "./actionType";

// Debug API URL once when file loads
console.log("API Base URL:", process.env.REACT_APP_API_URL);

export const RegisterUser = (registerUser) => (dispatch) => {
  console.log("Register payload:", registerUser);
  dispatch({ type: Register_User_Request });

  axios
    .post(`${process.env.REACT_APP_API_URL}/register`, registerUser)
    .then((res) => {
      console.log("Register response:", res.data);
      dispatch({ type: Register_User_Success });
      alert("Registration Successful!");
    })
    .catch((error) => {
      console.error("Register error:", error.response || error.message);
      dispatch({ type: Register_User_Fail });
      alert("Registration failed!");
    });
};

export const LoginUser = (userObj, navigate) => (dispatch) => {
  console.log("Login payload:", userObj);
  dispatch({ type: "Login_Request" });

  axios
    .post(`${process.env.REACT_APP_API_URL}/login`, userObj, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      const userData = res.data;
      console.log("Login response:", userData);

      localStorage.setItem("token", userData.token);
      localStorage.setItem("userImage", userData.existinguser.userImage);

      dispatch({
        type: Login_Success,
        payload: userData,
        isAuth: true,
      });

      alert("Login Successful!");
      navigate("/interviewType");
    })
    .catch((error) => {
      console.error("Login error:", error.response || error.message);
      dispatch({ type: Login_Fail });
      alert("Login failed!");
    });
};
