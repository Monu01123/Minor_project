import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig.js";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  alpha,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCartOutlined,
  FavoriteBorderOutlined,
  AccountCircle,
  Logout,
  Category,
  Dashboard,
  School,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../../Context/auth.js";
import { useCart } from "./CartContext.js";
import { useWishlist } from "./WishlistContext.js";
import logo from "./logo.png";
import UserProfile from "../Student/Profile.js";
import Modal from "./modal.js"; // Keeping existing Modal for now

// Styled Components for unique look
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px", // Rounded modern look
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  transition: "all 0.3s ease",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch", // Wider search bar
    },
  },
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)", // Glassmorphism base
  backdropFilter: "blur(12px)", // The blur effect
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)", // Soft shadow
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  color: "#333", // Text color
}));

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const { wishlistCount, updateWishlistCount } = useWishlist();
  const { cartCount, updateCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
<<<<<<< HEAD:frontend/src/components/Home/NavBar.js
        const response = await axiosInstance.get("/categories");
=======
        const response = await axios.get("https://minor-project-3-18lw.onrender.com/categories");
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/NavBar.js
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
<<<<<<< HEAD:frontend/src/components/Home/NavBar.js
      // Logic for fetching counts is handled by contexts usually, but keeping this for compatibility
       const fetchCounts = async () => {
        if (auth?.user) {
            try {
                const cartRes = await axiosInstance.get(`/api/cart/count/${auth.user.user_id}`);
                updateCartCount(cartRes.data.count || 0);
                const wishRes = await axiosInstance.get(`/api/wishlist/count/${auth.user.user_id}`);
                updateWishlistCount(wishRes.data.wishlist_count || 0);
            } catch (err) {
                console.error("Error fetching counts", err);
            }
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
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/NavBar.js
        }
    };
    fetchCounts();
  }, [auth, updateCartCount, updateWishlistCount]);

<<<<<<< HEAD:frontend/src/components/Home/NavBar.js
=======
    fetchCartCount();
  }, [auth, updateCartCount]);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      // console.log("caaledfdlfkdjf");
      if (auth?.user) {
        try {
          const response = await axios.get(
            `https://minor-project-3-18lw.onrender.com/api/wishlist/count/${auth.user.user_id}`
          );
          updateWishlistCount(response.data.wishlist_count || 0);
          // console.log(response);
        } catch (error) {
          console.error("Error fetching cart count:", error.message);
        }
      }
    };

    fetchWishlistCount();
  }, [auth, updateWishlistCount]);

  const userRole = auth?.user?.role;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "https://dazzling-starship-a6b164.netlify.app/category/1";
  };
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/NavBar.js

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
<<<<<<< HEAD:frontend/src/components/Home/NavBar.js
        const response = await axiosInstance.get(
          `/api/search?keyword=${encodeURIComponent(searchTerm)}`
=======
        const response = await axios.get(
          `https://minor-project-3-18lw.onrender.com/api/search?keyword=${encodeURIComponent(
            searchTerm
          )}`
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/NavBar.js
        );
        setSearchResults(response.data);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth({ ...auth, user: null, token: "" });
    navigate("/");
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenCategoryMenu = (event) => setAnchorElCategory(event.currentTarget);
  const handleCloseCategoryMenu = () => setAnchorElCategory(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { text: "Home", path: "/", icon: null },
    ...(auth?.user?.role === "student" ? [{ text: "My Courses", path: "/student-dashboard", icon: <School /> }] : []),
    ...(auth?.user?.role === "instructor" ? [{ text: "Instructor Dashboard", path: "/instructor-dashboard/course", icon: <Dashboard /> }] : []),
    ...(auth?.user?.role === "admin" ? [{ text: "Admin Dashboard", path: "/instructor-dashboard/category", icon: <Dashboard /> }] : []),
  ];

  const drawer1 = (
    <Box sx={{ width: 280, pt: 2 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}>
          <IconButton onClick={handleDrawerToggle}><Close /></IconButton>
      </Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Logo" style={{ height: 50 }} />
          <Typography variant="h6" fontWeight="bold">Skillora</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon || <Category />}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
         <ListItem disablePadding>
            <ListItemButton onClick={(e) => { e.stopPropagation(); setAnchorElCategory(e.currentTarget); }}>
                <ListItemIcon><Category /></ListItemIcon>
                <ListItemText primary="Categories" />
            </ListItemButton>
          </ListItem>
          {auth?.user && (
              <>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/cart")}>
                        <ListItemIcon><Badge badgeContent={cartCount} color="error"><ShoppingCartOutlined /></Badge></ListItemIcon>
                        <ListItemText primary="Cart" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/wishlist")}>
                        <ListItemIcon><Badge badgeContent={wishlistCount} color="error"><FavoriteBorderOutlined /></Badge></ListItemIcon>
                        <ListItemText primary="Wishlist" />
                    </ListItemButton>
                </ListItem>
                 <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon><Logout /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
              </>
          )}
          {!auth?.user && (
               <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                   <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>Log In</Button>
                   <Button variant="contained" fullWidth onClick={() => navigate("/register")} sx={{ bgcolor: "#007791" }}>Sign Up</Button>
               </Box>
          )}
      </List>
    </Box>
  );

  return (
    <>
      <GlassAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo Desktop */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "#2c3e50",
                textDecoration: "none",
                alignItems: "center",
              }}
            >
              <img src={logo} alt="Skillora" style={{ height: 40, marginRight: 10 }} />
              Skillora
            </Typography>

             {/* Mobile Menu Icon */}
             <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo Mobile */}
             <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                color: "#2c3e50",
                textDecoration: "none",
              }}
            >
              Skillora
            </Typography>


            {/* Search Bar */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, justifyContent: 'center' }}>
                 <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px' }}>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Search for courses..."
                        inputProps={{ "aria-label": "search" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Search>
                </form>
            </Box>

            {/* Desktop Actions */}
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 2 }}>
               
               {/* Categories Dropdown */}
                <Button 
                    onClick={handleOpenCategoryMenu}
                    color="inherit" 
                    startIcon={<Category />}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Categories
                </Button>
                <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElCategory}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorElCategory)}
                    onClose={handleCloseCategoryMenu}
                >
                    {categories.map((category) => (
                    <MenuItem key={category.category_id} onClick={() => { handleCloseCategoryMenu(); navigate(`/category/${category.category_id}`); }}>
                        <Typography textAlign="center">{category.name}</Typography>
                    </MenuItem>
                    ))}
                </Menu>


               {auth?.user ? (
                   <>
                        <Tooltip title="My Courses">
                            <Button onClick={() => navigate(auth.user.role === 'instructor' ? "/instructor-dashboard/course" : "/student-dashboard")} color="inherit" sx={{textTransform: 'none', fontWeight: 600}}>
                                {auth.user.role === 'instructor' ? "Instructor" : "My Learning"}
                            </Button>
                        </Tooltip>

                        <Tooltip title="Wishlist">
                            <IconButton onClick={() => navigate("/wishlist")} color="inherit">
                                <Badge badgeContent={wishlistCount} color="error">
                                    <FavoriteBorderOutlined />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Cart">
                            <IconButton onClick={() => navigate("/cart")} color="inherit">
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCartOutlined />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={auth.user.full_name} src="/static/images/avatar/2.jpg" sx={{ bgcolor: "#007791" }} />
                            </IconButton>
                        </Tooltip>
                        
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{auth.user.full_name}</Typography>
                                <Typography variant="body2" color="text.secondary">{auth.user.email}</Typography>
                            </Box>
                            <MenuItem onClick={() => { handleCloseUserMenu(); /* Add Profile modal/route logic here if needed */ }}>
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>
                           {/* Using the Profile Component logic inside menu usually requires a refactor or a dedicated route. 
                               For now, we can render the UserProfile in a modal or similar, but the original code had it in a dropdown.
                               To keep it simple: */}
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                   </>
               ) : (
                   <>
                        <Button variant="outlined" onClick={() => navigate("/login")} sx={{ borderColor: "#007791", color: "#007791", borderRadius: 20, px: 3 }}>
                            Log In
                        </Button>
                        <Button variant="contained" onClick={() => navigate("/register")} sx={{ bgcolor: "#007791", color: "white", borderRadius: 20, px: 3, "&:hover":{ bgcolor: "#005f73"} }}>
                            Sign Up
                        </Button>
                   </>
               )}

            </Box>
          </Toolbar>
        </Container>
      </GlassAppBar>

    {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer1}
      </Drawer>

<<<<<<< HEAD:frontend/src/components/Home/NavBar.js
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} results={searchResults} />
    </>
=======
      <div className="menu-icon" style={{ cursor: "pointer" }}>
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      <div className={`navbar-items ${isMenuOpen ? "active" : ""}`}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" type="submit">
            <SearchIcon className="search-icon" />
          </button>
        </form>

        {/* Modal for displaying search results */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          results={searchResults}
        />

        <div className="navbar-right">
          {!auth?.user && (
            <>
              <NavLink
                to="/login"
                className="nav-link login-btn"
                data-text="Log in"
              >
                {/* Log in */}
              </NavLink>
              <NavLink
                to="/register"
                className="nav-link signup-btn"
                data-text="Sign up"
              >
                {/* Sign up */}
              </NavLink>
            </>
          )}

          {userRole === "student" && (
            <>
              <NavLink to="/student-dashboard" className="nav-link">
                My Courses
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          )}

          {userRole === "admin" && (
            <>
            <NavLink to="/student-dashboard" className="nav-link">
                My <br />
                Courses
              </NavLink>
              <NavLink to="/instructor-dashboard/category" className="nav-link">
                Admin Dashboard
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          )}

          {userRole === "instructor" && (
            <>
              <NavLink to="/student-dashboard" className="nav-link">
                My <br />
                Courses
              </NavLink>
              <NavLink to="/instructor-dashboard/course" className="nav-link">
                Instructor
                <br /> Dashboard
              </NavLink>
              <NavLink to="/wishlist" style={{ textDecoration: "none" }}>
                <FavoriteBorderOutlinedIcon className="nav-icon" />
                <span className="cart-count">{wishlistCount}</span>
              </NavLink>
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="nav-icon" />
                <span className="cart-count">{cartCount}</span>
              </NavLink>
              <span className="profile-menu">
                <AccountBoxOutlinedIcon
                  className="nav-icon profile-icon"
                  onClick={toggleProfileDropdown}
                />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <UserProfile />
                  </div>
                )}
              </span>
              <NavLink to="/" className="nav-logout" onClick={handleLogout}>
                <LogoutIcon />
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/NavBar.js
  );
};

export default Navbar;
