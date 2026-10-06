import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Products error:", error);
        setMessage("Failed to load products");
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      await axios.post(
        "/api/cart/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product added to cart! 🛒");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-600">
          Loading products...
        </h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-widest text-indigo-600">
            ShopEase Store
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            Our Products
          </h1>

          <p className="mt-3 text-slate-500">
            Discover quality products at great prices.
          </p>
        </div>

        {message && (
          <div className="mb-8 rounded-xl bg-indigo-50 px-5 py-4 font-medium text-indigo-700">
            {message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-500">
              No products available.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                  <span className="text-7xl">🎧</span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold">
                      {product.name}
                    </h2>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                      {product.category}
                    </span>
                  </div>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900">
                        Rs. {product.price}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.stock} available
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;
