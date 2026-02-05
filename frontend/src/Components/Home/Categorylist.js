import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import { Box, Chip, Stack, Typography, CircularProgress, Button, Alert } from "@mui/material";
import { Category, Code, Brush, Science, Business, MusicNote, Refresh } from "@mui/icons-material";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { categoryId } = useParams();

<<<<<<< HEAD:frontend/src/components/Home/Categorylist.js
  const fetchCategories = () => {
      setLoading(true);
      setError(null);
      axiosInstance
      .get("/categories") // standardized URL
=======
  useEffect(() => {
    axios
      .get("https://minor-project-3-18lw.onrender.com/categories")
>>>>>>> 995151149dff8b0c9bec73fe1c10fc0724e34610:frontend/src/Components/Home/Categorylist.js
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper to get random icon
  const getIcon = (index) => {
    const icons = [<Code />, <Brush />, <Business />, <Science />, <MusicNote />];
    return icons[index % icons.length] || <Category />;
  };

  if (loading) return <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} /></Box>;

  if (error) {
     return (
         <Box display="flex" flexDirection="column" alignItems="center" p={2}>
             <Typography color="error" variant="body2" gutterBottom>{error}</Typography>
             <Button startIcon={<Refresh />} size="small" onClick={fetchCategories}>Retry</Button>
         </Box>
     );
  }

  return (
    <Box sx={{ py: 4, px: 2, bgcolor: "#f9f9f9" }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3} sx={{color: "#333"}}>
        Explore Top Categories
      </Typography>
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          overflowX: "auto", 
          pb: 2, 
          justifyContent: { md: "center", xs: "flex-start" },
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: "10px" }
        }}
      >
        {categories.map((category, index) => {
            const isActive = categoryId === String(category.category_id);
            return (
                <Chip
                    key={category.category_id}
                    icon={getIcon(index)}
                    label={category.name}
                    clickable
                    onClick={() => navigate(`/category/${category.category_id}`)}
                    sx={{
                        px: 1,
                        py: 3,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        backgroundColor: isActive ? "#007791" : "white",
                        color: isActive ? "white" : "#444",
                        boxShadow: isActive ? "0 4px 12px rgba(0,119,145,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
                        border: "1px solid",
                        borderColor: isActive ? "transparent" : "#eee",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            backgroundColor: isActive ? "#005f73" : "#fff",
                            transform: "translateY(-3px)",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
                        }
                    }}
                />
            );
        })}
      </Stack>
    </Box>
  );
};

export default CategoryList;
