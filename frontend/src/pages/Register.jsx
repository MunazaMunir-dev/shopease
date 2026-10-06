import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      setMessage(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200 sm:p-12">

        <div className="mb-8 text-center">
          <p className="font-semibold text-indigo-600">
            ShopEase
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Create your account
          </h1>

          <p className="mt-3 text-slate-500">
            Join ShopEase and start shopping securely.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <div className="mt-6 rounded-xl bg-indigo-50 px-4 py-3 text-center font-medium text-indigo-700">
            {message}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;