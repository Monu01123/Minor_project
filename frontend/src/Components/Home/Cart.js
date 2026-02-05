import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "./../../Context/auth.js";
import Navbar from "./NavBar.js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "./CartContext.js";
import { useWishlist } from "./WishlistContext.js";
<<<<<<< HEAD:frontend/src/components/Home/Cart.js
import Footer from "./Footer.js";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  IconButton, 
  Divider, 
  Stack,
  Chip 
} from "@mui/material";
import { 
  DeleteOutline, 
  FavoriteBorder, 
  ShoppingCartCheckout, 
  LocalOffer,
  ArrowBack
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import cartImage from "./chat.png"; // Keep or replace with MUI Icon
=======
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js

const stripePromise = loadStripe(
  "pk_test_51MiCn5SCTwSZDv2RQSoCBZEhWYnhCpG7Yi90uqZm6mTFi2KE2Sp2VNLgrZgjidU209nlFv6qS26GjrIVnCbOQ2eA00bdSwIX1F"
);

const Cart = () => {
  const { updateCartCount } = useCart();
  const { updateWishlistCount } = useWishlist();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const userId = auth?.user?.user_id;
        const token = auth?.token;

        if (!userId) return;

<<<<<<< HEAD:frontend/src/components/Home/Cart.js
        const response = await axiosInstance.get(`/api/cart/user/${userId}`);
=======
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/cart/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js

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
    let discount = 0;

    items.forEach((item) => {
      const price = Math.round(item.price);
      const discountPrice = item.discount_price ? Math.round(item.discount_price) : price;
      total += discountPrice;
      discount += price - discountPrice;
    });

    setTotalPrice(total);
    setTotalDiscount(discount);
  };

  const fetchCartCount = async () => {
      if (auth?.user) {
          try {
              const response = await axiosInstance.get(`/api/cart/count/${auth.user.user_id}`);
              updateCartCount(response.data.count || 0); 
          } catch (error) { console.error(error); }
      }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const token = auth?.token;
    try {
<<<<<<< HEAD:frontend/src/components/Home/Cart.js
      await axiosInstance.delete(`/api/cart/item/${cartItemId}`);
      const updatedCartItems = cartItems.filter((item) => item.cart_item_id !== cartItemId);
=======
      await axios.delete(`https://minor-project-3-18lw.onrender.com/api/cart/item/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
      });
      const updatedCartItems = cartItems.filter(
        (item) => item.cart_item_id !== cartItemId
      );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
      await fetchCartCount();
    } catch (error) {
      console.error("Error removing course from cart:", error);
    }
  };

  const handleMoveToWishlist = async (courseId, rmid) => {
    const userId = auth?.user?.user_id;
    const token = auth?.token;
    try {
<<<<<<< HEAD:frontend/src/components/Home/Cart.js
      await axiosInstance.post("/api/wishlist", { user_id: userId, course_id: courseId });

      await handleRemoveFromCart(rmid);
      
      // Update wishlist count
      const res = await axiosInstance.get(`/api/wishlist/count/${userId}`);
      updateWishlistCount(res.data.wishlist_count || 0);
=======
      await axios.post(
        "https://minor-project-3-18lw.onrender.com/api/wishlist",
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
      toast.success("Course moved to wishlist!");
      // console.log("Course moved to wishlist!");
      const newCartCount = await fetchCartCount();
      updateWishlistCount(userId, token);
      updateCartCount(newCartCount);
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js
    } catch (error) {
      console.error("Error moving course to wishlist:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const userId = auth?.user?.user_id;
      if (!userId) {
        alert("Please log in to proceed with the checkout.");
        return;
      }

      const items = cartItems.map((item) => ({
        name: item.course_title,
        price: item.discount_price ? item.discount_price : item.price,
        quantity: 1,
        courseId: item.course_id,
      }));

      const courseIds = cartItems.map((item) => item.course_id).join(",");
      const token = auth?.token;

<<<<<<< HEAD:frontend/src/components/Home/Cart.js
      const response = await axiosInstance.post("/create-checkout-session", { items, userId, courseIds });
=======
      const response = await axios.post(
        "https://minor-project-3-18lw.onrender.com/create-checkout-session",
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
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) alert("Error during checkout: " + error.message);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Error during checkout: " + error.message);
    }
  };

<<<<<<< HEAD:frontend/src/components/Home/Cart.js
  if (loading) {
      return (
          <>
            <Navbar />
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography>Loading Cart...</Typography>
            </Container>
            <Footer />
          </>
      );
  }

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>Shopping Cart</Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
             <Box 
                component="img" 
                src="https://img.freepik.com/free-vector/shopping-cart-illustration_1284-8069.jpg?w=740&t=st=1686734120~exp=1686734720~hmac=..." 
                alt="Empty Cart"
                sx={{ width: 200, mb: 3, opacity: 0.8 }}
             />
             <Typography variant="h5" color="text.secondary" gutterBottom>Your cart is empty</Typography>
             <Button variant="contained" component={Link} to="/" sx={{ mt: 2, bgcolor: '#a435f0', '&:hover': { bgcolor: '#8710d8' } }}>
                 Keep Shopping
             </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items List */}
            <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>{cartItems.length} Course{cartItems.length > 1 ? 's' : ''} in Cart</Typography>
                <Stack spacing={2}>
                    {cartItems.map((item) => (
                        <Card key={item.cart_item_id} sx={{ display: 'flex', p: 1, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 120, height: 80, borderRadius: 1, objectFit: 'cover' }}
                                image={item.image_url}
                                alt={item.course_title}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2, justifyContent: 'space-between' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{item.course_title}</Typography>
                                        <Typography variant="caption" color="text.secondary">By {item.instructor_name || "Instructor"}</Typography>
                                    </Box>
                                    <Box textAlign="right">
                                        <Typography variant="h6" color="#a435f0" fontWeight="bold">₹{Math.round(item.discount_price || item.price)}</Typography>
                                        {item.discount_price && (
                                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>₹{Math.round(item.price)}</Typography>
                                        )}
                                    </Box>
                                </Box>
                                
                                <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                                    <Button 
                                        size="small" 
                                        startIcon={<DeleteOutline />} 
                                        onClick={() => handleRemoveFromCart(item.cart_item_id)}
                                        sx={{ color: '#d32f2f', textTransform: 'none' }}
                                    >
                                        Remove
                                    </Button>
                                    <Button 
                                        size="small" 
                                        startIcon={<FavoriteBorder />} 
                                        onClick={() => handleMoveToWishlist(item.course_id, item.cart_item_id)}
                                        sx={{ color: '#1976d2', textTransform: 'none' }}
                                    >
                                        Move to Wishlist
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
                <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.secondary' }}>Total:</Typography>
                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>₹{totalPrice}</Typography>
                        {totalDiscount > 0 && (
                            <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>₹{totalPrice + totalDiscount}</Typography>
                        )}
                        {totalDiscount > 0 && (
                            <Typography variant="body2" sx={{ color: '#2e7d32', mb: 3 }}>You saved ₹{totalDiscount}!</Typography>
                        )}
                        
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            onClick={handleCheckout}
                            sx={{ 
                                bgcolor: '#a435f0', 
                                py: 1.5, 
                                fontWeight: 'bold', 
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: '#8710d8' } 
                            }}
                        >
                            Checkout
                        </Button>

                        <Divider sx={{ my: 3 }} />
                        
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Promotions</Typography>
                        <Box display="flex" border="1px solid #ccc" borderRadius={1} overflow="hidden">
                            <Box component="input" placeholder="Enter Coupon" sx={{ border: 'none', p: 1.5, flexGrow: 1, outline: 'none' }} />
                            <Button sx={{ borderRadius: 0, bgcolor: '#2d2f31', color: 'white', '&:hover': { bgcolor: 'black' } }}>Apply</Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
          </Grid>
        )}
      </Container>
      
      <Footer />
    </Box>
=======
  const fetchCartCount = async () => {
    if (auth?.user) {
      try {
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/cart/count/${auth.user.user_id}`
        );
        updateCartCount(response.data.count || 0); // Update cart count
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
      }
    }
  };

  fetchCartCount();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <Navbar />
        <div className="cart-container">
          <Toaster position="bottom-right" reverseOrder={true} />
          <h1>Your Cart</h1>
          {loading ? (
            <p>Loading...</p>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <img src={cartImage} alt="Empty Cart" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-main-container">
              <div className="cart-list">
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.cart_item_id} className="cart-item-list">
                      <img src={item.image_url} alt={item.course_title} />
                      <h3>{item.course_title}</h3>
                      <div>
                        <button
                          onClick={() =>
                            handleRemoveFromCart(item.cart_item_id)
                          }
                        >
                          Remove
                        </button>
                        <button
                          onClick={() =>
                            handleMoveToWishlist(
                              item.course_id,
                              item.cart_item_id
                            )
                          }
                        >
                          Move to Wishlist
                        </button>
                      </div>
                      <p>
                        {item.discount_price ? (
                          <div className="cart-buttons">
                            <span> ₹{Math.round(item.discount_price)}</span>
                            <del>₹{Math.round(item.price)}</del>
                          </div>
                        ) : (
                          <span>₹{Math.round(item.price)}</span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <div>
                  <h2>
                    <span style={{ color: "black" }}>Subtotal:</span>
                    <br /> ₹{totalPrice}
                  </h2>
                  <button onClick={handleCheckout}>Checkout</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </motion.div>
    </>
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Cart.js
  );
};

export default Cart;
