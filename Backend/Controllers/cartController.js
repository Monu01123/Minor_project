import { promisePool } from '../db.js'; // Using a promise-based pool from mysql2

// Add a course to the cart
export const addToCart = async (req, res) => {
    const { user_id, course_id } = req.body;

    try {
        // Check if the user already has a cart, if not create one
        let [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [user_id]);

        if (cart.length === 0) {
            const [cartResult] = await promisePool.query(`INSERT INTO cart (user_id) VALUES (?)`, [user_id]);
            cart = [{ cart_id: cartResult.insertId }];
        }

        const cart_id = cart[0].cart_id;

        // Check if the course is already in the cart
        const [existingCartItem] = await promisePool.query(
            `SELECT * FROM cart_items WHERE cart_id = ? AND course_id = ?`,
            [cart_id, course_id]
        );

        if (existingCartItem.length > 0) {
            return res.status(400).json({ message: 'Course is already in the cart' });
        }

        // Add the course to the cart
        await promisePool.query(
            `INSERT INTO cart_items (cart_id, course_id) VALUES (?, ?)`,
            [cart_id, course_id]
        );

        res.status(201).json({ message: 'Course added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding course to cart' });
    }
};

// Get the contents of the cart for a user
export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cart_id = cart[0].cart_id;

        const [cartItems] = await promisePool.query(
            `SELECT ci.cart_item_id, ci.course_id, c.title AS course_title, ci.added_at
             FROM cart_items ci
             JOIN courses c ON ci.course_id = c.course_id
             WHERE ci.cart_id = ?`,
            [cart_id]
        );

        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
};

// Remove a course from the cart
export const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        const [result] = await promisePool.query(`DELETE FROM cart_items WHERE cart_item_id = ?`, [cartItemId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Course removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing course from cart' });
    }
};

// Clear the entire cart
export const clearCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cart_id = cart[0].cart_id;

        await promisePool.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
