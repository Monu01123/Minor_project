import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import Navbar from "../Home/NavBar";
import Footer from "../Home/Footer.js";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Edit, Delete, Add, Category } from "@mui/icons-material";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenDialog = (category = null) => {
      if(category) {
          setName(category.name);
          setDescription(category.description);
          setEditId(category.category_id);
      } else {
          setName("");
          setDescription("");
          setEditId(null);
      }
      setOpenDialog(true);
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
      resetForm();
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    const categoryData = { name, description };

    try {
        const token = JSON.parse(localStorage.getItem("auth"))?.token;
        const headers = { Authorization: `Bearer ${token}` };

        if (editId) {
            await axiosInstance.put(`/categories/${editId}`, categoryData, { headers });
        } else {
            await axiosInstance.post("/categories", categoryData, { headers });
        }

        fetchCategories();
        handleCloseDialog();
    } catch (error) {
        console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditId(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Navbar />
      
      <Box sx={{ bgcolor: '#0F172A', py: 4, color: 'white', mb: 4 }}>
          <Container maxWidth="lg">
              <Typography variant="h4" fontWeight="bold" fontFamily="Inter" gutterBottom>
                  Category Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                  Create and manage course categories.
              </Typography>
          </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="600" fontFamily="Inter">
                    Existing Categories
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#0F172A' }}
                >
                    Add Category
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.category_id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Category fontSize="small" color="action" />
                                        <Typography variant="body2" fontWeight="500">{category.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpenDialog(category)} sx={{ mr: 1 }}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteCategory(category.category_id)} color="error">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
      </Container>
      
      <Footer />

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', fontFamily: 'Inter' }}>
              {editId ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogContent>
              <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                      label="Category Name"
                      fullWidth
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                  />
              </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
              <Button 
                onClick={handleAddOrUpdateCategory} 
                variant="contained" 
                sx={{ bgcolor: '#0F172A' }}
              >
                  {editId ? "Update" : "Add"}
              </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
