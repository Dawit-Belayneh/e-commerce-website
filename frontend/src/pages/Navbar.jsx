import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";


function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount, setCartCount] = useState(0);



    useEffect(() => {
        // --- 1. LOGIN LOGIC (Existing) ---
        const token = localStorage.getItem("access_token");

        if (token){
            setIsLoggedIn(true);

            const savedUsername = localStorage.getItem("username");
            setUsername(savedUsername || "Account");
        }

        // --- CART COUNT LOGIC ---
  const updateCount = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cartData.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(total);
  };

  // Run once on mount
    updateCount();

  // Listen for the signal from ProductDetail
    window.addEventListener("cartUpdated", updateCount);

  // Clean up
    return () => window.removeEventListener("cartUpdated", updateCount);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase();
        if (query) {
        if (query === 'men') {
            // Capitalize 'Men' to match Database if using 'exact'
            navigate(`/products?category=Men`); 
        } else if (query === 'women') {
            navigate(`/products?category=Women`);
        } else {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
        }
    };

    return(
        <nav className="navbar">
            {/* LEFT: LOGO & NAV */}
            <div className="nav-left">
                <div className="nav-logo">
                    <Link to="/">Ethio<span>Shop</span></Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/products">Shop</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                </ul>
            </div>

            {/* CENTER: SEARCH BAR */}
            <div className="nav-center">
                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <span className="serch-icon">🔍</span>
                    </button>
                </form>
            </div>

            {/* RIGHT: AUTH & CART */}
            <div className="nav-right">
                <ul className="auth-links">
                    {isLoggedIn ? (
                        <>
                            <li className="user-greet">
                                <Link to={`/profile/${username}`}>Hi, {username}</Link>
                            </li>
                            <li><button className="logout-link" onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <li><Link to="/login" className="login-link">Sign In</Link></li>
                    )}
                </ul>

                <div className="nav-icon">
                    <Link to="/cart" className="cart-wrapper">
                        <span className="cart-icon">🛒</span>
                        <span className="cart-count">{cartCount}</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;