import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./../../Context/auth.js";
import Navbar from "./NavBar.js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MiCn5SCTwSZDv2RQSoCBZEhWYnhCpG7Yi90uqZm6mTFi2KE2Sp2VNLgrZgjidU209nlFv6qS26GjrIVnCbOQ2eA00bdSwIX1F"
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const userId = auth?.user?.user_id;
        const token = auth?.token; 

        if (!userId) {
          console.error("User is not logged in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/cart/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (Array.isArray(response.data)) {
          setCartItems(response.data);
          calculateTotal(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [auth]);

  const calculateTotal = (items) => {
    let total = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const price = Math.round(item.price);
      const discountPrice = item.discount_price
        ? Math.round(item.discount_price)
        : price;

      total += discountPrice;
      totalDiscount += price - discountPrice;
    });

    setTotalPrice(total);
    setDiscount(totalDiscount);
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const token = auth?.token; 
    try {
      await axios.delete(`http://localhost:8080/api/cart/item/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });
      const updatedCartItems = cartItems.filter(
        (item) => item.cart_item_id !== cartItemId
      );
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error("Error removing course from cart:", error);
      alert("Error removing course from cart");
    }
  };

  const handleMoveToWishlist = async (courseId, rmid) => {
    const userId = auth?.user?.user_id;
    const token = auth?.token; 
    try {
      await axios.post(
        "http://localhost:8080/api/wishlist",
        {
          user_id: userId,
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      await handleRemoveFromCart(rmid);
      console.log("Course moved to wishlist!");
    } catch (error) {
      console.error("Error moving course to wishlist:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const userId = auth?.user?.user_id;

      if (!userId) {
        console.error("User is not logged in.");
        alert("Please log in to proceed with the checkout.");
        return;
      }

      const items = cartItems.map((item) => ({
        name: item.course_title,
        price: item.discount_price ? item.discount_price : item.price,
        quantity: 1,
        courseId: item.course_id, 
      }));

      
      const courseIds = cartItems.map((item) => item.course_id).join(',');

      const token = auth?.token;

      const response = await axios.post(
        "http://localhost:8080/create-checkout-session",
        {
          items: items,
          userId: userId,
          courseIds: courseIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { sessionId } = response.data;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe checkout error:", error);
        alert("Error during checkout: " + error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Error during checkout: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            <ul>
              {cartItems.map((item) => (
                <li key={item.cart_item_id}>
                  <h3>{item.course_title}</h3>
                  <p>
                    {item.discount_price ? (
                      <>
                        <del>₹{Math.round(item.price)}</del>
                        <span> ₹{Math.round(item.discount_price)}</span>
                      </>
                    ) : (
                      <span>₹{Math.round(item.price)}</span>
                    )}
                  </p>
                  <button
                    onClick={() => handleRemoveFromCart(item.cart_item_id)}
                  >
                    Remove
                  </button>
                  <button onClick={() => handleMoveToWishlist(item.course_id, item.cart_item_id)}>
                    Move to Wishlist
                  </button>
                </li>
              ))}
            </ul>
            <h2>Total Price: ₹{totalPrice}</h2>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
