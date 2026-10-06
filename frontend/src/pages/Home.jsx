import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-widest text-indigo-200">
              Secure E-Commerce
            </p>

            <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
              Shop smarter.
              <br />
              Shop securely.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-indigo-100">
              Welcome to ShopEase — a secure and simple online shopping
              experience built for modern customers.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/products"
                className="rounded-xl bg-white px-6 py-3 font-bold text-indigo-600 shadow-lg hover:bg-indigo-50"
              >
                Shop Now
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/40 px-6 py-3 font-bold hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-8 text-slate-900">
              <p className="text-sm font-semibold text-indigo-600">
                FEATURED PRODUCT
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Wireless Headphones
              </h2>

              <p className="mt-3 text-slate-500">
                High quality wireless headphones with clear sound.
              </p>

              <p className="mt-6 text-3xl font-extrabold">
                Rs. 5,999
              </p>

              <Link
                to="/products"
                className="mt-6 block rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white hover:bg-indigo-700"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-indigo-600">WHY SHOPEASE</p>

            <h2 className="mt-2 text-4xl font-bold">
              Everything you need
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="text-4xl">🔐</div>
              <h3 className="mt-5 text-xl font-bold">
                Secure Shopping
              </h3>
              <p className="mt-3 text-slate-500">
                Your account and shopping experience are protected with
                modern security practices.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="text-4xl">🛒</div>
              <h3 className="mt-5 text-xl font-bold">
                Easy Cart
              </h3>
              <p className="mt-3 text-slate-500">
                Add products, manage quantities and place your order easily.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="text-4xl">📦</div>
              <h3 className="mt-5 text-xl font-bold">
                Order Tracking
              </h3>
              <p className="mt-3 text-slate-500">
                View your orders and keep track of their current status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;