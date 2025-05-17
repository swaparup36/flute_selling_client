"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import * as dotenv from "dotenv";
import axios from 'axios';
import { productCategoryType } from '@/lib/types';

dotenv.config();


const AdminAddCategory = () => {
    const [allCategories, setAllCategories] = useState<productCategoryType[] | null>(null);
    const [newCategory, setNewCategory] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if(newCategory.trim() === "") {
                setIsSubmitting(false);
                return toast.error("category can not be empty");
            }

            const addCategoryRes = await axios.post("/api/add-category", { category: newCategory });

            if(!addCategoryRes.data.success) {
                setIsSubmitting(false);
                return toast.error(`can not add category: ${addCategoryRes.data.message}`);
            }

            toast.success("category added successfully");
            setIsSubmitting(false);
            setNewCategory("");
            getAllCategories();
        } catch (error) {
            toast.error(`can not add category: ${error}`);
            setIsSubmitting(false);
        }
    }

    const deleteCategory = async (categoryId: string | undefined) => {
        try {
            if(!categoryId) {
                return toast.error("category id not found");
            }

            const deleteCategoryRes = await axios.post("/api/delete-category", { categoryId: categoryId });

            if(!deleteCategoryRes.data.success) {
                toast.error(`can not delete category: ${deleteCategoryRes.data.message}`);
            }

            toast.success("category deleted successfully");

            getAllCategories();
        } catch (error) {
            toast.error(`can not delete category: ${error}`);
        }
    }

    const getAllCategories = async () => {
        try {
            const categoriesRes = await axios.get('/api/get-all-categories');

            if(!categoriesRes.data.success) {
                toast.error(`can not fetch categories: ${categoriesRes.data.message}`);
            }

            setAllCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error(`can not fetch categories: ${error}`);
        }
    }

    useEffect(()=>{
        getAllCategories();
    }, []);

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
              <h2 className="text-2xl font-bold">All Categories</h2>
            </div>
            
            {/* All Categries */}
            <div className='flex flex-col justify-between items-start my-4 w-full'>
                {
                    allCategories ? (
                        allCategories.map((category)=>(
                        <div className="border-b border-gray-200 py-4 flex justify-between items-center w-full" key={category.id}>
                            {category.title}
                            <Trash2 className='w-6 h-6 text-red-400 cursor-pointer' onClick={() => deleteCategory(category.id)} />
                        </div>
                        ))
                    ) : (
                        <p className='text-gray-600 py-2 w-full'>no category</p>
                    )
                }
            </div>
        </div>

        <div className='max-w-3xl'>
            <form onSubmit={handleAddCategory} className="space-y-6">
                {/* Category Input */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <input
                        type="text"
                        id="category"
                        required
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                        placeholder="category"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md transition-colors ${isSubmitting ? 'bg-[#f5afaf] text-white cursor-not-allowed' : 'bg-[#C17777] text-white hover:bg-[#a66565]'}`}
                        disabled={isSubmitting}
                    >
                        {
                          isSubmitting ? "Adding..." : "Add Category"
                        }
                    </button>
                </div>
            </form>
        </div>
      </div>
    </>
  );
};

export default AdminAddCategory;