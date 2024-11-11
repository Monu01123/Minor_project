import { promisePool } from '../db.js'; 

export const addToCart = async (req, res) => {
    const { user_id, course_id } = req.body;

    try {
        let [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [user_id]);

        if (cart.length === 0) {
            const [cartResult] = await promisePool.query(`INSERT INTO cart (user_id) VALUES (?)`, [user_id]);
            cart = [{ cart_id: cartResult.insertId }];
        }

        const cart_id = cart[0].cart_id;

        const [existingCartItem] = await promisePool.query(
            `SELECT * FROM cart_items WHERE cart_id = ? AND course_id = ?`,
            [cart_id, course_id]
        );

        if (existingCartItem.length > 0) {
            return res.status(200).json({ message: 'Course is already in the cart' });
        }

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

export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cart_id = cart[0].cart_id;

        const [cartItems] = await promisePool.query(
            `SELECT 
                ci.cart_item_id, 
                ci.course_id, 
                c.title AS course_title, 
                c.price, 
                c.discount_price, 
                ci.added_at,
                c.image_url
             FROM cart_items ci
             JOIN courses c ON ci.course_id = c.course_id
             WHERE ci.cart_id = ?`,
            [cart_id]
        );
  
        if (cartItems.length === 0) {
            return res.status(200).json({ message: 'No items in the cart', cartItems: [] });
        }

        res.json(cartItems); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
};



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

// In your cartController.js
export const clearCart = async (userId) => {
    try {
        const [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        if (cart.length === 0) {
            console.log('Cart not found for user:', userId);
            return; // No cart to clear
        }
        const cart_id = cart[0].cart_id;
        await promisePool.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);
        console.log('Cart cleared successfully for user:', userId);
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error; // Rethrow for error handling in the webhook
    }
};


export const getCartCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const [cart] = await promisePool.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);

        if (cart.length === 0) {
            return res.status(200).json({ count: 0 }); // No cart found, return count as 0
        }

        const cart_id = cart[0].cart_id;

        // Count the number of items in the cart
        const [cartItems] = await promisePool.query(
            `SELECT COUNT(*) AS itemCount FROM cart_items WHERE cart_id = ?`,
            [cart_id]
        );

        res.json({ count: cartItems[0].itemCount || 0 }); // Return item count
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart count' });
    }
};

