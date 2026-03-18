import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Products from './pages/Products';
import CategoriesPage from './pages/CategoriesPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ProductReviews from './pages/ProductReviews';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path = "/categories" element={<CategoriesPage />} />
        <Route path = "/cart" element={<Cart />} />
        <Route path = "/checkout" element={<Checkout />} />
        <Route path="/product/:slug/reviews" element={<ProductReviews />} />
        <Route path = "/login" element={<Login />} />
        <Route path = "/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
