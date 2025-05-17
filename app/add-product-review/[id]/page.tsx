"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { productReviewType, productType } from '@/lib/types';

type Product = {
  id: number;
  name: string;
  image: string;
};

const AddProductReview = () => {
  const path = usePathname();
  const productId = path.split("/")[path.split("/").length - 1];
  const router = useRouter();

  const [review, setReview] = useState<productReviewType>({
    author: '',
    content: '',
    date: '',
    productId: productId,
    rating: 0
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchProduct = async (): Promise<productType | null> => {
    setIsLoading(true);
    try {
      const getProductRes = await axios.post("/api/get-product-by-id", { id: productId });

      if(!getProductRes.data.success){
        toast.error(`can not get product: ${getProductRes.data.message}`);
        setIsLoading(false);
        return null;
      }

      setProduct(getProductRes.data.requiredProduct);
      setIsLoading(false);
      return getProductRes.data.requiredProduct;
    } catch (error) {
      toast.error(`can not get product: ${error}`);
      setIsLoading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const postReviewResponse = await axios.post("/api/add-review", {
        ...review,
        productId: productId
      });

      if(!postReviewResponse.data.success){
        setIsSubmitting(false);
        return toast.error(`can not add review: ${postReviewResponse.data.message}`);
      }

      toast.success("review added successfully");
      setIsSubmitting(false);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting review:', error);
      toast.error(`can not add review: ${error}`);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <>
        <ToastContainer />

        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-4 mb-8 text-sm">
                <Link 
                href={`/product-details/${productId}`} 
                className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
                </Link>
            </nav>

            <div className="bg-white rounded-lg shadow-md p-8">
                {/* Product Info */}
                <div className="flex items-center space-x-4 mb-8 pb-8 border-b">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                    width={500}
                    height={500}
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                    <p className="text-sm text-gray-500">Write a review for this product</p>
                </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                    </label>
                    <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="focus:outline-none"
                        >
                        <Star
                            className={`w-8 h-8 ${
                            (hoveredStar !== null ? star <= hoveredStar : star <= review.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                        />
                        </button>
                    ))}
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                    </label>
                    <input
                    type="text"
                    id="name"
                    required
                    value={review.author}
                    onChange={(e) => setReview({ ...review, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                    placeholder="Enter your name"
                    />
                </div>

                {/* Review Content */}
                <div>
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                    </label>
                    <textarea
                    id="review"
                    required
                    rows={6}
                    value={review.content}
                    onChange={(e) => setReview({ ...review, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                    placeholder="Share your experience with this product..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <Link
                        href={`/product-details/${productId}`}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md transition-colors ${isSubmitting ? 'bg-[#f5afaf] text-white cursor-not-allowed' : 'bg-[#C17777] text-white hover:bg-[#a66565]'}`}
                        disabled={isSubmitting}
                    >
                        {
                          isSubmitting ? "Submitting..." : "Submit Review"
                        }
                    </button>
                </div>
                </form>
            </div>
        </div>
    </>
  );
};

export default AddProductReview;