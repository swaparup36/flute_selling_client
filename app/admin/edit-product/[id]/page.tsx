"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productType } from '@/lib/types';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import uploadProductImages from '@/utils/uploader';
import ReactImageGallery from 'react-image-gallery';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


const AdminProductEdit = () => {
  const path = usePathname();
  const router = useRouter();
  const productId = path.split("/")[path.split("/").length - 1];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [product, setProduct] = useState<productType | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setAllCategories] = useState<{
    id:  string;
    title: string;
  }[]>([]);


  const fetchProduct = async (): Promise<productType | null> => {
    try {
      const getProductRes = await axios.post("/api/get-product-by-id", { id: productId });

      if(!getProductRes.data.success){
        toast.warn(`can not get product: ${getProductRes.data.message}`);
        return null
      }

      setPreviewUrls(getProductRes.data.requiredProduct.images);
      setExistingUrls(getProductRes.data.requiredProduct.images);
      return getProductRes.data.requiredProduct;
    } catch (error) {
      toast.warn(`can not get product: ${error}`);
      return null
    }
  };

  const loadProduct = async () => {
    if (productId) {
      try {
        const productData = await fetchProduct();
        if(productData) {
          setProduct(productData);
          setPreviewUrls(productData.images);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      let i = 0;
      for (const file of files) {
        if(!file){
          setIsSubmitting(false);
          return toast.warn("product image is not provided");
        }
        formData.append(`file-${i}`, file);
        i++;
      }

      const imgUploadRes = await uploadProductImages(formData, files.length);
      const imgUploadResObj = JSON.parse(imgUploadRes);

      if(!imgUploadResObj.success) {
        setIsSubmitting(false);
        return toast.warn(`can not edit product: ${imgUploadResObj.message}`);
      }

      const imagesToUpdate = [...existingUrls, ...imgUploadResObj.imageURLs];
      if(imagesToUpdate.length < 0) {
        setIsSubmitting(false);
        return toast.warn("you must have at least 1 image");
      }

      const editProductResponse = await axios.post("/api/edit-product", {
        ...product,
        images: imagesToUpdate
      });

      if(!editProductResponse.data.success){
        setIsSubmitting(false);
        toast.error(`can not edit product: ${editProductResponse.data.message}`);
      }

      toast.success("product edited successfully");
      setIsSubmitting(false);
      setTimeout(() => {
        router.push("/admin/all-products");
      }, 2000);
    } catch (error) {
      toast.error(`can not edit product: ${error}`);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!product) return;
    
    const { name, value } = e.target;
    setProduct(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'price' || name === 'discountedPrice' ? parseFloat(value) : value
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || !product) return;
    if (files.length > 5) return toast.warn("you can only upload 5 images");
    if (files.length + previewUrls.length > 5) return toast.warn("you can only have 5 images");

    const filesList: File[] = [];
    const newpreviewURLs: string[] = [];
    const imageNames: string[] = [];

    for (const file of files) {
      if (file && product) {
        if (file.size > 5 * 1024 * 1024) return toast.warn("image size should be less than 5MB");
        filesList.push(file);
        const url = URL.createObjectURL(file);
        newpreviewURLs.push(url);
        imageNames.push(file.name);
      }
    }

    setFiles(filesList);
    setPreviewUrls([...previewUrls, ...newpreviewURLs]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const previewURLList: string[] = [];
    const imageNames: string[] = [];

    const allfiles = e.dataTransfer.files;

    if (!files || !product) return;

    for (const file of allfiles) {
      if (file && file.type.startsWith('image/') && product) {
        imageNames.push(file.name);
        const url = URL.createObjectURL(file);
        previewURLList.push(url);
      }
    }

    setPreviewUrls(previewURLList);
    setProduct({
      ...product,
      images: imageNames
    });
  };

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

  const delteImage = (image: string) => {
    const index = previewUrls.indexOf(image);
    if (index < files.length) {
      const fileToDelete = files[index];
      const updatedFiles = files.filter(file => file !== fileToDelete);
      setFiles(updatedFiles);
      const updatedImages = previewUrls.filter(img => img !== image);
      setPreviewUrls(updatedImages);
    } else {
      const updatedImages = previewUrls.filter(img => img !== image);
      setPreviewUrls(updatedImages);
      setExistingUrls(updatedImages);
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminToken');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
    

    loadProduct();
    getAllCategories();
  }, []);


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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-red-500">Product not found</p>
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

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Edit Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={product?.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={product?.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.title}>{category.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={product?.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  min="0"
                  step="0.01"
                  value={product?.discountedPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                />
              </div>
            </div>

            {/* Current Image and Upload New Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex flex-col gap-4">
                {/* Current Image */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Image</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {previewUrls.map((image, index) => (
                      <div className="group mr-2" key={index}>
                        <div className="relative aspect-square overflow-hidden bg-white rounded-lg mb-4 h-48 w-48">
                          <Image
                            src={image}
                            alt="Product preview"
                            height={200}
                            width={200}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button type='button' onClick={() => delteImage(image)} className="bg-white text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-colors">
                                Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload New Image */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C17777] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload new image
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                name="description"
                required
                value={product?.description}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/all-products"
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`px-6 py-2 rounded-md transition-colors ${isSubmitting ? 'bg-[#e8a6a6] text-white cursor-not-allowed' : 'bg-[#C17777] text-white hover:bg-[#a66565]'}`}
                disabled={isSubmitting}
              >
                {
                  isSubmitting ? "Saving..." : "Save Changes"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminProductEdit;