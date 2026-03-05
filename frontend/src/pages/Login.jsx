import { useState } from "react";
import {useNavigate} from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

function Login(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username:"",
        password:"",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await API.post("token/", formData);

            //save JWT tokens
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("username", formData.username);

            alert("Login successful!");
            navigate("/");
        } catch (err) {
                setError("Invalid credentials. Please try again.");
                console.error(err.response?.data);
        }
    };

    return(
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Login</button>
                <a href="/signup" className="switch-link">Don't have an account? Sign up</a>
            </form>
        </div>
    );
};

export default Login;