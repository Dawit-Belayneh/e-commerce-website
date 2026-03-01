import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

function Signup(){
    const navigate = useNavigate();

    const [fromData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...fromData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await API.post("signup/", fromData);
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError("Signup failed. Please check your details and try again.");
            console.error(err.response?.data);
        }
    };

    return(
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={fromData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={fromData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={fromData.password}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={fromData.first_name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={fromData.last_name}
                    onChange={handleChange}
                />
                <button type="submit">Sign Up</button>
                <a href="/login" className="switch-link">Already have an account? Log in</a>
            </form>
        </div>
    );
}

export default Signup;