import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  const getCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await axios.get(
        "/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Item removed from cart.");
      getCart();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        "/api/cart/clear",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Cart cleared.");
      getCart();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  };

  if (!cart) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-600">
          {message || "Loading cart..."}
        </h2>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-widest text-indigo-600">
            ShopEase
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            Shopping Cart 🛒
          </h1>

          <p className="mt-3 text-slate-500">
            Review your items before checkout.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-indigo-50 px-5 py-4 font-medium text-indigo-700">
            {message}
          </div>
        )}

        {cart.items.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-5 text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-slate-500">
              Add some products to your cart to continue.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-indigo-100 text-4xl">
                      🎧
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {item.product.name}
                      </h2>

                      <p className="mt-1 text-slate-500">
                        Rs. {item.product.price}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <p className="text-xl font-bold">
                      Rs.{" "}
                      {item.product.price *
                        item.quantity}
                    </p>

                    <button
                      onClick={() =>
                        removeItem(item.product._id)
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-white"
              >
                Clear Cart
              </button>
            </div>

            <div className="h-fit rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="my-6 border-t border-slate-200 pt-6">
                <div className="flex justify-between text-slate-500">
                  <span>Items</span>
                  <span>{cart.items.length}</span>
                </div>

                <div className="mt-4 flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. {total}</span>
                </div>

                <div className="my-6 border-t border-slate-200 pt-6">
                  <div className="flex justify-between text-xl font-extrabold">
                    <span>Total</span>
                    <span>Rs. {total}</span>
                  </div>
                </div>
              </div>

              <a
                href="/orders"
                className="block rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white hover:bg-indigo-700"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
