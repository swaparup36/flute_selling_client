"use client";

import { productType } from "@/lib/types";
import axios from "axios";
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { toast } from "react-toastify";

interface CartItem extends productType {
    quantity: number;
    thread_one: string
    thread_two: string
    name_on?: string
}

interface CartContextType {
    cartCount: number;
    setCartCount: Dispatch<SetStateAction<number>>;
    getCartCount: () => void;
    addToCart: (productId: string) => void;
    getAllProductIdsOnCart: () => void;
    productIds: string[],
    setProductIds: Dispatch<SetStateAction<string[]>>;
    cartItems: CartItem[],
    setCartItems: Dispatch<SetStateAction<CartItem[]>>;
    subtotal: number,
    setSubtotal: Dispatch<SetStateAction<number>>;
    checkoutItems: CartItem[],
    setCheckoutItems: Dispatch<SetStateAction<CartItem[]>>
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    setCartCount: () => {},
    addToCart: (productId: string) => {},
    getCartCount: () => {},
    getAllProductIdsOnCart: () => {},
    productIds: [],
    setProductIds: () => {},
    cartItems: [],
    setCartItems: () => {},
    subtotal: 0,
    setSubtotal: () => {},
    checkoutItems: [],
    setCheckoutItems: () => {}
});

export const GetContext = () => {
  return useContext(CartContext);
};

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [cartCount, setCartCount] = useState<number>(0);
    const [productIds, setProductIds] = useState<string[]>([]);
    const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
    const [checkoutItems, setCheckoutItems] = React.useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    
    const getCartCount = async () => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            setCartCount(parsedCartItems.length);
        } else {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            const cartCountLocal = parsedCartItems.length;

            try {
                const response = await axios.get('/api/get-cart-count', 
                    { 
                        headers: { 
                            "AuthToken": localStorage.getItem('usertoken')
                        } 
                    }
                );
                if (!response.data.success) {
                    return console.log("Can not get cart count: ", response.data.message);
                }
    
                setCartCount(response.data.cartcount + cartCountLocal);
            } catch (error) {
                console.log("Can not get cart count: ", error);
            }
        }
    }

    const addToCart = async (productId: string) => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            try {
                const getProductRes = await axios.post("/api/get-product-by-id", { id: productId });
    
                if(!getProductRes.data.success){
                    toast.error(`can not get product: ${getProductRes.data.message}`);
                    return null;
                }
    
                const product = getProductRes.data.requiredProduct;
                const cartItem = localStorage.getItem('cartItems');
                const parsedCartItems = cartItem ? JSON.parse(cartItem) : [];
                const newCartItems: CartItem[] = [...parsedCartItems, { ...product, quantity: 1 }];
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                setCartCount(cartCount+1);
                setCartItems(newCartItems);
                setSubtotal(subtotal + product.discountedPrice);
                getAllProductIdsOnCart();
            } catch (error) {
                console.log("Can not add to cart: ", error);
            } 
        } else {
            try {
                const response = await axios.post('/api/add-to-cart', { productId: productId },
                    { 
                        headers: { 
                            "AuthToken": localStorage.getItem('usertoken')
                        }
                    }
                );
                if (!response.data.success) {
                    return console.log("Can not add to cart: ", response.data.message);
                }
    
                setCartCount(response.data.cartsCount);
                getAllProductIdsOnCart();
            } catch (error) {
                console.log("Can not add to cart: ", error);
            }
        }
    }

    const getAllProductIdsOnCart = async () => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            setCartCount(parsedCartItems.length);
            const allProductIds = parsedCartItems.map((item: CartItem) => item.id);
            setProductIds(allProductIds);
        } else {
            try {
                const response = await axios.get('/api/get-cart-products-arr',
                    { 
                        headers: {
                            "AuthToken": localStorage.getItem('usertoken')
                        } 
                    }
                );
                if (!response.data.success) {
                    return console.log("Can not get cart product ids: ", response.data.message);
                }
    
                setProductIds(response.data.productIds);
            } catch (error) {
                console.log("Can not get cart product ids: ", error);
            }
        }
    }

    return (
        <CartContext.Provider value={{ cartCount, getCartCount, addToCart, setCartCount, productIds, setProductIds, getAllProductIdsOnCart, cartItems, setCartItems, subtotal, setSubtotal, checkoutItems, setCheckoutItems }}>
            {children}
        </CartContext.Provider>
    );
};
