import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <nav className="sticky top-0 z-50 border-b bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            ShopEase
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>

            <Link to="/products" className="hover:text-indigo-600">
              Products
            </Link>

            <Link to="/cart" className="hover:text-indigo-600">
              Cart
            </Link>

            <Link to="/orders" className="hover:text-indigo-600">
              Orders
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;