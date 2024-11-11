import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/auth.js";
import Navbar from "./NavBar.js";
import { useWishlist } from "./WishlistContext.js";
import { useCart } from "./CartContext.js";
import cartImage from "./chat.png";
import Footer from "./Footer.js";
import "./Cart.css";

const Wishlist = () => {
  const { updateWishlistCount } = useWishlist();
  const { updateCartCount } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [auth] = useAuth(); // Use the useAuth hook to get user data

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const userId = auth?.user?.user_id;
        const token = auth?.token; // Get the token from auth context

        if (!userId) {
          console.error("User is not logged in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/wishlist/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the header
            },
          }
        );

        if (Array.isArray(response.data)) {
          setWishlistItems(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
          setWishlistItems([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(
            "No wishlist items found for this user, setting to empty array."
          );
          setWishlistItems([]);
        } else {
          console.error("Error fetching wishlist items:", error);
          setWishlistItems([]);
        }
      }
    };

    if (auth && auth.user) {
      fetchWishlistItems();
    } else {
      console.warn("Auth not ready or user not logged in.");
    }
  }, [auth]);

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      const userId = auth?.user?.user_id;
      const token = auth?.token; // Get the token from auth context

      if (!userId) {
        console.error("User is not logged in.");
        return;
      }

      await axios.delete(
        `http://localhost:8080/api/wishlist/user/${wishlistItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );
      const updatedWishlistItems = wishlistItems.filter(
        (item) => item.wishlist_id !== wishlistItemId
      );
      setWishlistItems(updatedWishlistItems);

      const newWishlistCount = await fetchWishlistCount(); // You'll need to define this method to fetch the updated cart count
      updateWishlistCount(newWishlistCount); // Update the cart count in Navbar
    } catch (error) {
      console.error("Error removing course from wishlist:", error);
      alert("Error removing course from wishlist");
    }
  };

  const handleMoveToCart = async (wishlistItem) => {
    try {
      const userId = auth?.user?.user_id;
      const token = auth?.token;

      if (!userId) {
        console.error("User is not logged in.");
        return;
      }

      await axios.post(
        `http://localhost:8080/api/cart`,
        {
          user_id: userId,
          course_id: wishlistItem.course_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await handleRemoveFromWishlist(wishlistItem.wishlist_id);

      await updateCartCount(userId, token);
    } catch (error) {
      console.error("Error moving course to cart:", error);
      alert("Error moving course to cart.");
    }
  };

  const fetchWishlistCount = async () => {
    if (auth?.user) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/wishlist/count/${auth.user.user_id}`
        );
        updateWishlistCount(response.data.wishlist_count || 0); // Update cart count
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
      }
    }
  };

  fetchWishlistCount();

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Your Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="empty-cart">
            <img src={cartImage} alt="Empty Cart" />
            <p>Your Wishlist is empty</p>
          </div>
        ) : (
          <div className="cart-main-container">
          <div className="cart-list">
            <ul>
              {wishlistItems.map((item) => (
                <li key={item.wishlist_id} className="cart-item-list">
                  <img src={item.image_url} alt={item.course_title} />
                  <h3>{item.course_title}</h3>
                  <div>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.wishlist_id)}
                  >
                    Remove
                  </button>
                  <button onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </button>
                  </div>
                  <p>
                    {item.discount_price ? (
                      <>
                        <del>₹{Math.round(item.price)}</del>{" "}
                        <span>₹{Math.round(item.discount_price)}</span>
                      </>
                    ) : (
                      <span>₹ {Math.round(item.price)}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
