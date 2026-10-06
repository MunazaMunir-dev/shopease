import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      setMessage("Login successful! 🎉");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white md:flex md:flex-col md:justify-center">
          <p className="font-semibold uppercase tracking-widest text-indigo-200">
            Welcome Back
          </p>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            Shop smarter.
            <br />
            Shop securely.
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Sign in to access your ShopEase account, manage
            your cart and track your orders.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <span>Secure authentication</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <span>Easy shopping experience</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span>Track your orders</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <p className="font-semibold text-indigo-600">
              ShopEase
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Welcome back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue shopping.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <span className="text-xl">G</span>
            Continue with Google
          </button>

          {message && (
            <div className="mt-6 rounded-xl bg-indigo-50 px-4 py-3 text-center font-medium text-indigo-700">
              {message}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Secure authentication powered by ShopEase
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;