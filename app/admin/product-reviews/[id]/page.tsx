"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productReviewType } from '@/lib/types';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import * as dotenv from "dotenv";

dotenv.config();


const AllReviews = () => {
  const path = usePathname();
  const router = useRouter();
  const productId = path.split("/")[path.split("/").length - 1];
  const [reviews, setReviews] = useState<productReviewType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

  const handleDeleteReviews = async (id: string | undefined, rating: number) => {
    try {
      if(!id) {
        return toast.error("review id not found");
      }

      const deleteReviewRes = await axios.post('/api/delete-product-review', { id: id, productId: productId, rating: rating });

      console.log("updated reviews: ", deleteReviewRes.data.updatedReviews);

      if(!deleteReviewRes.data.success){
        return toast.error(`can not delete review: ${deleteReviewRes.data.message}`);
      }

      setReviews(deleteReviewRes.data.updatedReviews);
      toast.success("review deleted successfully");
    } catch (error) {
      toast.error(`can not delete review: ${error}`);
    }
  }


  const fetchReviews = async (): Promise<productReviewType[] | null> => {
    try {
      const getReviewRes = await axios.post("/api/get-product-by-id", { id: productId });

      if(!getReviewRes.data.success){
        toast.warn(`can not get product: ${getReviewRes.data.message}`);
        return null
      }

      return getReviewRes.data.reviews;
    } catch (error) {
      toast.warn(`can not get product: ${error}`);
      return null
    }
  };

  const handleCopyReviewLink = async() => {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST_NAME}/add-product-review/${productId}`);

    setIsLinkCopied(true);

    setTimeout(() => {
      setIsLinkCopied(false);
    }, 1000);
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminToken');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
    const loadReviews = async () => {
      if (productId) {
        try {
          const reviews = await fetchReviews();
          if(reviews) {
            setReviews(reviews);
          }
        } catch (error) {
          console.error('Error loading product:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadReviews();
  }, [productId]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                </div>
                </div>
            </div>
        );
    }

  return (
    <>
        <ToastContainer />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </nav>

        <div className="max-w-3xl">
            <div className='flex justify-between items-center mb-8'>
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <button className='border-2 border-gray-500 py-1 px-2 w-[25%] rounded-md' onClick={handleCopyReviewLink}>
                {
                  isLinkCopied ? "Copied" : "Copy Review Link"
                }
              </button>
            </div>
            
            {/* All Reviews */}
            {
                reviews ? (
                    reviews.map((review)=>(
                      <div className="border-b border-gray-200 py-8" key={review.id}>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{review.author}</span>
                            <span className="text-gray-500"> – {(new Date(review.date).getDate()).toString().padStart(2, '0')}/{(new Date(review.date).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(review.date).getFullYear()).toString()}</span>
                          </div>
                  
                          <div className='text-red-400'>
                            <Trash2 className='w-4 h-4 cursor-pointer' onClick={() => handleDeleteReviews(review.id, review.rating)} />
                          </div>
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    ))
                ) : (
                    <p className='text-gray-600'>no reviews</p>
                )
            }
        </div>
      </div>
    </>
  );
};

export default AllReviews;