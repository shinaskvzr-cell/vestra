import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.warn("Please select a size!");
      return;
    }

    if (product.sizes[selectedSize] < quantity) {
      toast.error("Not enough stock!");
      return;
    }

    try {
      // Fetch current user data
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;

      // Check if item already exists in cart
      const existingCartItemIndex = user.cart.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      let updatedCart;

      if (existingCartItemIndex !== -1) {
        // Update quantity if item already exists
        updatedCart = user.cart.map((item, index) =>
          index === existingCartItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const cartItem = {
          ...product,
          selectedSize: selectedSize,
          quantity: quantity,
        };
        updatedCart = [...user.cart, cartItem];
      }

      // Update user's cart in JSON server
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        cart: updatedCart,
      });

      // Update product stock
      const updatedProduct = {
        ...product,
        sizes: {
          ...product.sizes,
          [selectedSize]: product.sizes[selectedSize] - quantity,
        },
        stock: product.stock - quantity,
      };

      await axios.put(`http://localhost:5000/products/${id}`, updatedProduct);
      setProduct(updatedProduct);

      toast.success("✅ Added to cart successfully!");

    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding to cart. Please try again.");
    }
  };

  const handleBuyNow = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("Please login to proceed!");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.warn("Please select a size!");
      return;
    }

    if (product.sizes[selectedSize] < quantity) {
      toast.error("Not enough stock!");
      return;
    }

    // Navigate to BuyNow page with product data
    navigate("/buy-now", {
      state: {
        product: product,
        selectedSize: selectedSize,
        quantity: quantity
      }
    });
  };

  if (!product) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-12">
      {/* Left: Product Image */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-500 text-lg mb-2">{product.kit} Kit</p>
          <p className="text-gray-500 text-lg mb-4">Year: {product.year}</p>
          <p className="text-3xl font-bold text-rose-500 mb-6">${product.price}</p>

          {/* Size selection */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Select Size:</h2>
            <div className="flex gap-3 flex-wrap">
              {Object.keys(product.sizes).map((size) => (
                <button
                  key={size}
                  disabled={product.sizes[size] === 0}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg font-semibold transition-colors ${selectedSize === size
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-green-100"
                    } ${product.sizes[size] === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {size} ({product.sizes[size]})
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Quantity:</h2>
            <input
              type="number"
              min="1"
              max={selectedSize ? product.sizes[selectedSize] : product.stock}
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                const maxQuantity = selectedSize ? product.sizes[selectedSize] : product.stock;
                if (value >= 1 && value <= maxQuantity) {
                  setQuantity(value);
                }
              }}
              className="px-4 py-2 border rounded-lg w-24"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex-1"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex-1"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Stock Info */}
        <p className="mt-8 text-gray-500">
          Total Stock: <span className="font-semibold">{product.size}</span>

        </p>
        {/* <p className="mt-8 text-gray-500">
          Total Stock:{" "}
          <span className="font-semibold">
            {Object.values(product.sizes).reduce((total, val) => total + val, 0)}
          </span>
        </p> */}

      </div>
    </div>
  );
}

export default ProductDetail;