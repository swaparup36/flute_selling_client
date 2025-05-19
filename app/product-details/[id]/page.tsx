"use client";


import React, { useEffect, useState } from 'react';
import { Share2, Star } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { productReviewType, productType } from '@/lib/types';
import RatingStars from '@/components/RatingStars';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import FeatureProducts from '@/app/FeatureProducts';
import * as dotenv from "dotenv";
import { GetContext } from '@/context/CartContext';
import { threadColors } from '@/lib/constants';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface CartItem extends productType {
    quantity: number;
    thread_one: string
    thread_two: string
    name_on?: string
}

dotenv.config();

const ProductReview = ({ rating, author, date, content }: { 
  rating: number;
  author: string;
  date: string;
  content: string;
}) => (
  <div className="border-b border-gray-200 py-8">
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-current' : ''}`}
          />
        ))}
      </div>
      <div className="text-sm">
        <span className="font-medium text-gray-900">{author}</span>
        <span className="text-gray-500"> – {(new Date(date).getDate()).toString().padStart(2, '0')}/{(new Date(date).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(date).getFullYear()).toString()}</span>
      </div>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

const ProductDetails = () => {
    const { setCheckoutItems, productIds, cartItems, setCartItems, subtotal, setSubtotal, getAllProductIdsOnCart, setCartCount, cartCount } = GetContext();
    const router = useRouter();
    const path = usePathname();
    const productId = path.split("/")[path.split("/").length - 1];

    const [productDetails, setProductDetails] = useState<productType | null>(null);
    const [reviews, setReviews] = useState<productReviewType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(0);
    const [threadOne, setThreadOne] = useState<string>('no color');
    const [threadTwo, setThreadTwo] = useState<string>('no color');
    const [nameOnFlute, setNameOnFlute] = useState<string| undefined>(undefined);
    const [activeTab, setActiveTab] = useState('description');
    const [isBuyLoading, setIsBuyLoading] = useState<boolean>(false);

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const fetchProduct = async (): Promise<productType | null> => {
        setIsLoading(true);
        try {
          const getProductRes = await axios.post("/api/get-product-by-id", { id: productId });
    
          if(!getProductRes.data.success){
            toast.error(`can not get product: ${getProductRes.data.message}`);
            setIsLoading(false);
            return null;
          }

          setProductDetails(getProductRes.data.requiredProduct);
          setReviews(getProductRes.data.reviews);
          setIsLoading(false);
          return getProductRes.data.requiredProduct;
        } catch (error) {
          toast.error(`can not get product: ${error}`);
          setIsLoading(false);
          return null;
        }
    };

    const getAllProductsFromCart = async () => {
        const userToken = localStorage.getItem('usertoken');
        if (!userToken) {
            const cartItems = localStorage.getItem('cartItems');
            const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
            setCartItems(parsedCartItems);
            let calculatedSubtotal = 0;
            for (const product of parsedCartItems) {
                const individualSubtotal = product.discountedPrice * 1;
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
    
                // Update the product from cart
                const updatedItems: CartItem[] = response.data.products.map((item: CartItem) => {
                    const currentItemId = item.id;
                    const existingCartItm = cartItems.find((cartItm) => cartItm.id === currentItemId);
                    if (currentItemId === productId) {
                        return { ...item, quantity: quantity === 0 ? 1 : quantity, thread_one: threadOne, thread_two: threadTwo, name_on: nameOnFlute };
                    } else if (existingCartItm) {
                        return existingCartItm;
                    } else {
                        return item;
                    }
                });
                
                console.log("updated items: ", updatedItems);
                setCartItems(updatedItems);
                const itemToCheckout = updatedItems.filter((item: CartItem)=> item.id === productId );
                setCheckoutItems(itemToCheckout);
                const calculatedSubtotal = itemToCheckout[0].discountedPrice * itemToCheckout[0].quantity;
                setSubtotal(calculatedSubtotal);
                getAllProductIdsOnCart();
                console.log("subtotal: ", calculatedSubtotal);
            } catch (error) {
                console.log("Can not get cart products: ", error);
            }
        }
    }

    const handleBuyNow = async (productId: string | undefined) => {
        if(!productId) return console.log("product id not found");
        setIsBuyLoading(true);

        // Add the product to the cart
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
                const newCartItems: CartItem[] = [...parsedCartItems, { ...product, quantity: quantity, thread_one: threadOne, thread_two: threadTwo, name_on: nameOnFlute }];
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                setCartCount(cartCount+1);
                setCartItems(newCartItems);
                setCheckoutItems([{ ...product, quantity: quantity === 0 ? 1 : quantity, thread_one: threadOne, thread_two: threadTwo, name_on: nameOnFlute }]);
                setSubtotal(product.discountedPrice * (quantity === 0 ? 1 : quantity));
                getAllProductIdsOnCart();
                setIsBuyLoading(false);
            } catch (error) {
                console.log("Can not add to cart: ", error);
                setIsBuyLoading(false);
            } 
        } else {
            try {
                if (!productIds.includes(productDetails?.id as string)) {
                    const response = await axios.post('/api/add-to-cart', { productId: productId },
                        { 
                            headers: { 
                                "AuthToken": localStorage.getItem('usertoken')
                            }
                        }
                    );
                    if (!response.data.success) {
                        setIsBuyLoading(false);
                        return console.log("Can not add to cart: ", response.data.message);
                    }
        
                    setCartCount(response.data.cartsCount);
                }
                
                // Get the allcarts
                getAllProductsFromCart();
                setIsBuyLoading(false);
            } catch (error) {
                setIsBuyLoading(false);
                console.log("Can not add to cart: ", error);
            }
        }

        router.push('/checkout');
    }

    useEffect(()=>{
        getAllProductIdsOnCart();
        fetchProduct();
    }, []);

    if (isLoading) {
        return (
          <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        );
    }

    if (!productDetails) {
        return (
          <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              Product not found
            </div>
          </div>
        );
    }

    return (
        <>
            <ToastContainer />

            <section className="max-w-7xl mx-auto px-4 py-8 pt-24">
            {/* Previous content remains the same until the end of Product Meta */}
            <nav className="text-sm mb-8">
                <ol className="flex items-center space-x-2 text-gray-500">
                <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                <li>›</li>
                <li><Link href="/shop" className="hover:text-gray-700">Products</Link></li>
                <li>›</li>
                <li className="text-gray-900">{productDetails?.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="relative">
                    <ImageGallery
                        items={productDetails ? productDetails.images.map((img: string) => { 
                            return {
                                original: img, 
                                thumbnail: img
                            }
                        }) : ["/images/products/product3.jpg"].map((img) => {
                            return {
                                original: img, 
                                thumbnail: img
                            }
                        })}
                        showPlayButton={false}
                        showNav={true}
                        showFullscreenButton={false}
                        renderLeftNav={(onClick, disabled) => (
                            <button
                                className="image-gallery-icon image-gallery-left-nav absolute left-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white/90 shadow-md"
                                onClick={onClick}
                                disabled={disabled}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                            </button>
                        )}
                        renderRightNav={(onClick, disabled) => (
                            <button
                                className="image-gallery-icon image-gallery-right-nav absolute right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white/90 shadow-md"
                                onClick={onClick}
                                disabled={disabled}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        )}
                    />
                </div>

                {/* Product Details */}
                <div>
                <h1 className="text-3xl font-bold mb-4">{productDetails?.name}</h1>
                
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-3xl text-[#C17777]">₹{productDetails?.discountedPrice}</span>
                    <span className="text-gray-500 line-through">₹{productDetails?.price}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-6">
                <RatingStars rating={productDetails?.rating ? productDetails?.rating : 0} />
                    <span className="text-gray-500">({reviews ? reviews.length : 0} customer reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    {productDetails?.description.slice(0, 200) + "..."}
                </p>

                {/* Customization Option */}
                <div className="mb-8 space-y-6">
                    <h3 className="font-medium text-gray-900">Customize Your Flute</h3>
                    
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Thread Color 1
                            </label>
                            <select 
                                value={threadOne} 
                                onChange={(e) => setThreadOne(e.target.value)}
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C17777] focus:border-[#C17777] transition-colors"
                            >
                                <option value="no color">No color</option>
                                {threadColors.map((color, index) => (
                                    <option key={index} value={color} className="py-1">
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Thread Color 2
                            </label>
                            <select 
                                value={threadTwo} 
                                onChange={(e) => setThreadTwo(e.target.value)}
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C17777] focus:border-[#C17777] transition-colors"
                            >
                                <option value="no color">No color</option>
                                {threadColors.map((color, index) => (
                                    <option key={index} value={color} className="py-1">
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thread Color 1 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Thread Color 1
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${threadOne === 'no color' ? 'border-[#C17777]' : 'border-gray-300'}`}
                                    style={{ background: '#fff' }}
                                    onClick={() => setThreadOne('no color')}
                                    title="No color"
                                >
                                    <span className="text-xs text-gray-400">×</span>
                                </button>
                                {threadColors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${threadOne === color ? 'border-[#C17777] scale-110' : 'border-gray-300'}`}
                                        style={{ background: color }}
                                        onClick={() => setThreadOne(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">Selected: {threadOne}</span>
                        </div>

                        {/* Thread Color 2 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Thread Color 2
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${threadTwo === 'no color' ? 'border-[#C17777]' : 'border-gray-300'}`}
                                    style={{ background: '#fff' }}
                                    onClick={() => setThreadTwo('no color')}
                                    title="No color"
                                >
                                    <span className="text-xs text-gray-400">×</span>
                                </button>
                                {threadColors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${threadTwo === color ? 'border-[#C17777] scale-110' : 'border-gray-300'}`}
                                        style={{ background: color }}
                                        onClick={() => setThreadTwo(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">Selected: {threadTwo}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Name on Flute (Optional)
                        </label>
                        <input
                            type="text"
                            value={nameOnFlute || ''}
                            onChange={(e) => setNameOnFlute(e.target.value)}
                            placeholder="Enter name to be printed"
                            maxLength={20}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C17777] focus:border-[#C17777] transition-colors placeholder:text-gray-400"
                        />
                        <p className="text-xs text-gray-500">
                            Maximum 20 characters
                        </p>
                    </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex md:flex-row flex-col items-center space-x-4 mb-8">
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="mr-4">Quantity:</span>
                        <div className="flex border rounded">
                            <button 
                            onClick={decrementQuantity}
                            className="px-3 py-1 border-r hover:bg-gray-100"
                            >
                            -
                            </button>
                            <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-16 text-center"
                            />
                            <button 
                            onClick={incrementQuantity}
                            className="px-3 py-1 border-l hover:bg-gray-100"
                            >
                            +
                            </button>
                        </div>
                    </div>
                    
                    <div className='flex w-full justify-between items-center'>
                        {
                            isBuyLoading ? (
                                <button onClick={() => handleBuyNow(productDetails?.id)} disabled className="bg-gray-700 text-white md:px-6 py-2 rounded cursor-not-allowed w-full">
                                    Wait...
                                </button>
                            ) : (
                                <button onClick={() => handleBuyNow(productDetails?.id)} className="bg-gray-900 text-white md:px-6 py-2 rounded hover:bg-gray-800 w-full">
                                    Buy Now
                                </button>
                            )
                        }
                        
                        {/* Share button */}
                        <button 
                            onClick={() => {
                                const url = window.location.href;
                                navigator.clipboard.writeText(url);
                                toast.success("Link copied to clipboard!", {
                                    position: "bottom-right",
                                    autoClose: 2000
                                });
                            }} 
                            className="p-2 border rounded hover:bg-gray-50 mx-4 w-fit group relative"
                            title="Share product"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Share product
                            </span>
                        </button>
                    </div>
                </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-16">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                <button
                    className={`pb-4 px-8 font-medium ${
                    activeTab === 'description'
                        ? 'border-b-2 border-[#C17777] text-[#C17777]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                <button
                    className={`pb-4 px-8 font-medium ${
                    activeTab === 'reviews'
                        ? 'border-b-2 border-[#C17777] text-[#C17777]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviews ? reviews.length : 0})
                </button>
                </div>

                {activeTab === 'reviews' && (
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
                    
                    {/* Individual Reviews */}
                    {
                        reviews ? (
                            reviews.map((review)=>(
                                <ProductReview
                                    key={review.id}
                                    rating={review.rating}
                                    author={review.author}
                                    date={review.date}
                                    content={review.content}
                                />
                            ))
                        ) : (
                            <p className='text-gray-600'>no reviews</p>
                        )
                    }


                </div>
                )}

                {activeTab === 'description' && (
                <div className="max-w-3xl prose prose-gray">
                    <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                    {
                        productDetails?.description.split('\n').map((paragraph, index)=>(
                            <p key={index} className="text-gray-600 mb-4">
                                {paragraph}
                            </p>
                        ))
                    }
                </div>
                )}
            </div>

            {/* Featured Items Section */}
            <FeatureProducts />

            </section>
        </>
    );
};

export default ProductDetails;