import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig.js";
import { useAuth } from "../../Context/auth.js";
import Navbar from "./NavBar.js";
import { useWishlist } from "./WishlistContext.js";
import { useCart } from "./CartContext.js";
import Footer from "./Footer.js";
<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js
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
  Tooltip,
  Skeleton
} from "@mui/material";
import { 
  DeleteOutline, 
  ShoppingCartOutlined 
} from "@mui/icons-material";
import { Link } from "react-router-dom";
=======
import "./Cart.css";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js

const Wishlist = () => {
  const { updateWishlistCount } = useWishlist();
  const { updateCartCount } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth(); // Use the useAuth hook to get user data

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setLoading(true);
      try {
        const userId = auth?.user?.user_id;
        const token = auth?.token;

        if (!userId) return;

<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js
        const response = await axiosInstance.get(`/api/wishlist/user/${userId}`);
=======
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/wishlist/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the header
            },
          }
        );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js

        if (Array.isArray(response.data)) {
          setWishlistItems(response.data);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
             setWishlistItems([]);
        } else {
             console.error("Error fetching wishlist items:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (auth && auth.user) {
      fetchWishlistItems();
    }
  }, [auth]);

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js
      const token = auth?.token;
      await axiosInstance.delete(`/api/wishlist/user/${wishlistItemId}`);
      const updatedWishlistItems = wishlistItems.filter((item) => item.wishlist_id !== wishlistItemId);
=======
      const userId = auth?.user?.user_id;
      const token = auth?.token; // Get the token from auth context

      if (!userId) {
        console.error("User is not logged in.");
        return;
      }

      await axios.delete(
        `https://minor-project-3-18lw.onrender.com/api/wishlist/user/${wishlistItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );
      const updatedWishlistItems = wishlistItems.filter(
        (item) => item.wishlist_id !== wishlistItemId
      );
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js
      setWishlistItems(updatedWishlistItems);
      
      const userId = auth?.user?.user_id;
      const res = await axiosInstance.get(`/api/wishlist/count/${userId}`);
      updateWishlistCount(res.data.wishlist_count || 0);

    } catch (error) {
      console.error("Error removing course from wishlist:", error);
    }
  };

  const handleMoveToCart = async (wishlistItem) => {
    try {
      const userId = auth?.user?.user_id;
      const token = auth?.token;

<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js
      await axiosInstance.post(
        "/api/cart",
        { user_id: userId, course_id: wishlistItem.course_id }
=======
      if (!userId) {
        console.error("User is not logged in.");
        return;
      }

      await axios.post(
        `https://minor-project-3-18lw.onrender.com/api/cart`,
        {
          user_id: userId,
          course_id: wishlistItem.course_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js
      );
      await handleRemoveFromWishlist(wishlistItem.wishlist_id);
<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js

      const res = await axiosInstance.get(`/api/cart/count/${userId}`);
      updateCartCount(res.data.count || 0);

=======
      toast.success("Course moved to cart!");
      await updateCartCount(userId, token);
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js
    } catch (error) {
      console.error("Error moving course to cart:", error);
    }
  };

<<<<<<< HEAD:frontend/src/components/Home/Wishlist.js
  if (loading) {
      return (
        <>
            <Navbar />
            <Container sx={{ py: 8 }}>
                <Grid container spacing={3}>
                    {[1,2,3,4].map(i => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={200} sx={{borderRadius: 2, mb: 1}} />
                            <Skeleton width="80%" />
                            <Skeleton width="60%" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </>
      );
  }

  return (
    <Box sx={{ bgcolor: "#F7F9FA", minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 6, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>My Wishlist</Typography>

        {wishlistItems.length === 0 ? (
           <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <Box sx={{ fontSize: '4rem', mb: 2 }}>❤️</Box>
                <Typography variant="h5" color="text.secondary" gutterBottom>Your wishlist is empty.</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Explore more courses and save them for later!</Typography>
                <Button variant="outlined" component={Link} to="/" sx={{ fontWeight: 'bold', border: '2px solid' }}>Browse Courses</Button>
           </Box>
        ) : (
            <Grid container spacing={3}>
                {wishlistItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.wishlist_id}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={item.image_url}
                                    alt={item.course_title}
                                />
                                <Tooltip title="Remove from Wishlist">
                                    <IconButton 
                                        size="small"
                                        onClick={() => handleRemoveFromWishlist(item.wishlist_id)}
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 8, 
                                            right: 8, 
                                            bgcolor: 'rgba(255,255,255,0.9)', 
                                            color: '#d32f2f',
                                            '&:hover': { bgcolor: 'white' }
                                        }}
                                    >
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 1, minHeight: '2.6em', overflow: 'hidden' }}>
                                    {item.course_title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    By {item.instructor_name || "Instructor"}
                                </Typography>
                                <Box display="flex" alignItems="baseline" gap={1}>
                                    <Typography variant="h6" fontWeight="bold" color="#a435f0">
                                        ₹{Math.round(item.discount_price || item.price)}
                                    </Typography>
                                    {item.discount_price && (
                                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                            ₹{Math.round(item.price)}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>

                            <Button 
                                fullWidth 
                                variant="contained"
                                startIcon={<ShoppingCartOutlined />}
                                onClick={() => handleMoveToCart(item)}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#2d2f31', 
                                    borderTop: '1px solid #e0e0e0',
                                    borderRadius: 0,
                                    py: 1.5,
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                            >
                                Move to Cart
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}
      </Container>

      <Footer />
    </Box>
=======
  const fetchWishlistCount = async () => {
    if (auth?.user) {
      try {
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/wishlist/count/${auth.user.user_id}`
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Navbar />
        <div className="cart-container">
          <Toaster position="bottom-right" reverseOrder={true} />
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
                          onClick={() =>
                            handleRemoveFromWishlist(item.wishlist_id)
                          }
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
      </motion.div>
    </>
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Wishlist.js
  );
};

export default Wishlist;
