import { promisePool } from "../db.js"; 

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await promisePool.execute(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description]
    );

    res.status(201).json({
      category_id: result.insertId,
      name,
      description,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      error: "An error occurred while creating the category",
      details: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const [result] = await promisePool.execute(
      "UPDATE categories SET name = ?, description = ? WHERE category_id = ?",
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      category_id: id,
      name,
      description,
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the category",
      details: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const [result] = await promisePool.execute(
      "DELETE FROM categories WHERE category_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res
      .status(500)
      .json({
        error: "An error occurred while deleting the category",
        details: error.message,
      });
  }
};

export const getCategories = async (req, res) => {
  try {
    const [categories] = await promisePool.query("SELECT * FROM categories");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching categories",
        details: error.message,
      });
  }
};

export const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [category] = await promisePool.execute(
      "SELECT * FROM categories WHERE category_id = ?",
      [id]
    );

    if (category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category[0]);
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the category",
        details: error.message,
      });
  }
};
