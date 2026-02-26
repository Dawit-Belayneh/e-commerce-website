import "./Home.css";

function Navbar(){
    return(
        <nav className="navbar">
            <div className="nav-logo">Ethio<sapn>Shop</sapn></div>
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/categories">Categories</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/signup">Sign Up</a></li>
            </ul>
            <div className="nav-icons">
                <button className="cart-icon">🛒 <span className="cart-count">0</span></button>
            </div>
        </nav>
    );
}

export default Navbar;