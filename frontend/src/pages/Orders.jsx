import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const getOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    if (token) {
      getOrders();
    } else {
      setMessage("Please login first.");
    }
  }, [token]);

  const createOrder = async () => {
    if (!address.trim()) {
      setMessage("Please enter your shipping address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Order created successfully! Order ID: ${response.data.order._id}`
      );

      setAddress("");
      await getOrders();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-indigo-100 text-indigo-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-widest text-indigo-600">
            ShopEase
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            My Orders
          </h1>

          <p className="mt-3 text-slate-500">
            Checkout and keep track of your purchases.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-8 rounded-xl bg-indigo-50 px-5 py-4 font-medium text-indigo-700">
            {message}
          </div>
        )}

        {/* Checkout */}
        <section className="mb-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
              📦
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Checkout
              </h2>

              <p className="text-sm text-slate-500">
                Enter your shipping address to place your order.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <label className="mb-2 block text-sm font-semibold">
              Shipping Address
            </label>

            <textarea
              placeholder="Enter your complete shipping address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows="4"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              onClick={createOrder}
              disabled={loading}
              className="mt-5 rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading
                ? "Processing..."
                : "Place Order"}
            </button>
          </div>
        </section>

        {/* Order History */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Order History
            </h2>

            <p className="mt-1 text-slate-500">
              Your previous orders and their current status.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
              <div className="text-5xl">📦</div>

              <h3 className="mt-4 text-xl font-bold">
                No orders yet
              </h3>

              <p className="mt-2 text-slate-500">
                Your completed orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        ORDER ID
                      </p>

                      <h3 className="mt-1 break-all font-bold text-slate-900">
                        #{order._id}
                      </h3>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">

                    <div>
                      <p className="text-sm text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-extrabold">
                        Rs. {order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Shipping Address
                      </p>

                      <p className="mt-1 font-medium text-slate-700">
                        {order.shippingAddress}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Items
                      </p>

                      <p className="mt-1 font-medium text-slate-700">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Orders;