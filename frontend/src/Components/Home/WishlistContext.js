import React, { createContext, useState, useContext } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlistCount, setWishlistCount] = useState(0);

    const updateWishlistCount = (count) => {
        setWishlistCount(count);
    };

    return (
        <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
};

