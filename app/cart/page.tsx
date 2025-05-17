"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { GetContext } from '@/context/CartContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productType } from '@/lib/types';
import { threadColors } from '@/lib/constants';

interface CartItem extends productType {
    quantity: number;
    thread_one: string
    thread_two: string
    name_on?: string
}


function Cart() {
    const { getCartCount, cartItems, setCartItems, subtotal, setSubtotal, addToCart, setCheckoutItems } = GetContext();
    const router = useRouter();

    const shipping = 0;
    const total = subtotal + shipping;

    // const onQtyChange = (e: React.ChangeEvent<HTMLSelectElement>, productId: string) => {
    //     const item = cartItems.filter((item) => item.id === productId)[0];
    //     item.quantity = parseInt(e.target.value);

    //     let calculatedSubtotal = 0;
    //     for (const item of cartItems) {
    //         console.log("qty: ", item.quantity)
    //         const individualSubtotal = item.quantity ? item.discountedPrice * item.quantity : item.discountedPrice;
    //         calculatedSubtotal += individualSubtotal;
    //     }
    //     console.log("subtotal: ", calculatedSubtotal);
    //     setSubtotal(calculatedSubtotal);
    // }

    const handleItemUpdate = async (
        productId: string, 
        field: 'quantity' | 'thread_one' | 'thread_two' | 'name_on', 
        value: string | number
    ) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === productId) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setCartItems(updatedItems);
    
        // Update subtotal if quantity changes
        if (field === 'quantity') {
            let calculatedSubtotal = 0;
            for (const item of updatedItems) {
                const individualSubtotal = (item.quantity ? item.quantity : 1) * item.discountedPrice;
                calculatedSubtotal += individualSubtotal;
            }
            setSubtotal(calculatedSubtotal);
        }
    }

    const getAllProductsFromCart = async () => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            setCartItems(parsedCartItems);
            let calculatedSubtotal = 0;
            for (const product of parsedCartItems) {
                const individualSubtotal = product.discountedPrice * product.quantity ? product.quantity : 1;
                calculatedSubtotal += individualSubtotal;
            }
            console.log("subtotal: ", calculatedSubtotal);
            setSubtotal(calculatedSubtotal);
        } else {
            try {
                const response = await axios.get('/api/get-cart-products',
                    { 
                        headers: {
                            "AuthToken": localStorage.getItem('usertoken')
                        } 
                    }
                );
                if (!response.data.success) {
                    return console.log("Can not get cart products: ", response.data.message);
                }
    
                setCartItems(response.data.products);
                let calculatedSubtotal = 0;
                for (const product of response.data.products) {
                    const individualSubtotal = product.discountedPrice * 1;
                    calculatedSubtotal += individualSubtotal;
                }
                console.log("subtotal: ", calculatedSubtotal);
                setSubtotal(calculatedSubtotal);
            } catch (error) {
                console.log("Can not get cart products: ", error);
            }
        }
    }

    const deleteFromCart = async (productId: string) => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            const newCartItems = parsedCartItems.filter((item: CartItem) => item.id !== productId);
            console.log("newCartItems: ", newCartItems);
            setCartItems(newCartItems);
            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            let calculatedSubtotal = 0;
            for (const product of newCartItems) {
                const individualSubtotal = product.discountedPrice * 1;
                calculatedSubtotal += individualSubtotal;
            }
            console.log("subtotal: ", calculatedSubtotal);
            setSubtotal(calculatedSubtotal);
            getCartCount();
        } else {
            try {
                const response = await axios.post('/api/delete-product-from-cart', { productId: productId },
                    { 
                        headers: {
                            "AuthToken": localStorage.getItem('usertoken')
                        } 
                    }
                );
                if (!response.data.success) {
                    return console.log("Can not delete product from cart: ", response.data.message);
                }
    
                const newCartItems = cartItems.filter((item) => item.id !== productId);
                setCartItems(newCartItems);
                let calculatedSubtotal = 0;
                for (const product of newCartItems) {
                    const individualSubtotal = product.quantity ? product.discountedPrice * product.quantity : product.discountedPrice;
                    calculatedSubtotal += individualSubtotal;
                }
                console.log("subtotal: ", calculatedSubtotal);
                setSubtotal(calculatedSubtotal);
                getCartCount();
            } catch (error) {
                console.log("Can not delete product from cart: ", error);
            }   
        }
    }

    const uploadCartFromLocalstorage = async () => {
        try {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems: CartItem[] = cartItems ? JSON.parse(cartItems) : [];
            for (const cartItem of parsedCartItems) {
                addToCart(cartItem.id as string);
            }
            localStorage.removeItem('cartItems');
            getAllProductsFromCart();
        } catch (error) {
            console.log("Unable to get cart items from local storage: ", error);
        }
    }

    useEffect (() => {
        const userToken = localStorage.getItem('usertoken');
        if (userToken) {
            uploadCartFromLocalstorage();
        }
        getAllProductsFromCart();
        console.log("cartItems: ", cartItems);
        let calculatedSubtotal = 0;
        for (const item of cartItems) {
            const individualSubtotal = (item.quantity ? item.quantity : 1) * item.discountedPrice;
            calculatedSubtotal += individualSubtotal;
        }
        setSubtotal(calculatedSubtotal);
    }, []);

    return (
        <>
            {/* Cart Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
                        
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex flex-col py-6 border-b border-gray-200 last:border-0">
                                <div className="flex items-center">
                                    <Link href={`/product-details/${item.id}`}>
                                        <Image src={item.images[0]} alt={item.name} width={100} height={100} className="w-24 h-24 object-cover rounded-md" />
                                    </Link>
                                    <div className="ml-6 flex-1">
                                        <Link href={`/product-details/${item.id}`}>
                                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            {[...Array(item.rating)].map((_, i) => (
                                                <span key={i} className="text-yellow-400">★</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <span className="text-xl font-semibold text-gray-900">₹{item.discountedPrice}</span>
                                            <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => handleItemUpdate(item.id as string, 'quantity', parseInt(e.target.value))}
                                            className="mr-4 min-w-[50px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                        <button 
                                            className="text-gray-400 hover:text-red-500" 
                                            onClick={() => deleteFromCart(item.id as string)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Thread Colors and Name Input */}
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thread Color 1
                                        </label>
                                        <select
                                            value={item.thread_one}
                                            onChange={(e) => handleItemUpdate(item.id as string, 'thread_one', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                                        >
                                            <option value="no color">No color</option>
                                            {threadColors.map((color, index) => (
                                                <option key={index} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thread Color 2
                                        </label>
                                        <select
                                            value={item.thread_two}
                                            onChange={(e) => handleItemUpdate(item.id as string, 'thread_two', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                                        >
                                            <option value="no color">No color</option>
                                            {threadColors.map((color, index) => (
                                                <option key={index} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name on Flute (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={item.name_on}
                                            onChange={(e) => handleItemUpdate(item.id as string, 'name_on', e.target.value)}
                                            placeholder="Enter name"
                                            className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                                            maxLength={20}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>

                    <div className="mt-6">
                    <Link
                        href="/shop"
                        className="inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Continue Shopping
                    </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-900">₹{shipping}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-semibold text-gray-900">₹{total}</span>
                                </div>
                            </div>
                        </div>

                        <Button variant='secondary' className="mt-6 w-full text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={() => {
                            const userToken = localStorage.getItem('usertoken');
                            if (!userToken) {
                                router.push('/auth/login');
                            } else {
                                setCheckoutItems(cartItems);
                                router.push('/checkout');
                            }
                        }}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default Cart;