import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";


function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token){
            setIsLoggedIn(true);

            const savedUsername = localStorage.getItem("username");
            setUsername(savedUsername || "Account");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()){
            navigate(`/products?search=${searchQuery}`);
            navigate(`/categories?search=${searchQuery}`);
        }
    }

    return(
        <nav className="navbar">
            <div className="nav-logo"><Link to="/">Ethio<span>Shop</span></Link></div>
            <ul className="nav-links">
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>

            </ul>
            {/* --- SEARCH BAR START --- */}
            <form className="nav-search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search for products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>
            {/* --- SEARCH BAR END --- */}
            <ul className="nav-links auth-links">  
                {isLoggedIn ? (
                    <>
                        <li><span className="username"><Link to={`/profile/${username}`}>{username}</Link></span></li>
                        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
                    
            </ul>
            <div className="nav-icons">
                <button className="cart-icon">🛒 <span className="cart-count">0</span></button>
            </div>
        </nav>
    );
}

export default Navbar;