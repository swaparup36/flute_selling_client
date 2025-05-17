"use client";



import React, { useEffect, useState } from 'react';
import { Filter, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { productCategoryType, productType } from '@/lib/types';


const AdminAllProductsPage = () => {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([300, 5000]);
  const [sortingOrder, setSortingOrder] = useState<string>("Default sorting");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<productType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<productCategoryType[] | null>(null)

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

  const getAllProducts = async() => {
    setIsLoading(true);
    try {
      const getAllProductsResponse = await axios.get("/api/get-all-products");

      if(!getAllProductsResponse.data.success){
        setIsLoading(false);
        return toast.warn(`can fetch all products: ${getAllProductsResponse.data.message}`);
      }

      setAllProducts(getAllProductsResponse.data.allProducts);
      setIsLoading(false);
    } catch (error) {
      toast.warn(`can fetch all products: ${error}`);
      setIsLoading(false);
    }
  }

  const handleDeleteProduct = async(productId: string) => {
    try {
      const deleteProductResponse = await axios.post("/api/delete-product", { id: productId });

      if(!deleteProductResponse.data.success){
        return toast.warn(`can not delete product: ${deleteProductResponse.data.message}`);
      }

      toast.success("product deleted successfully");
      getAllProducts();
    } catch (error) {
      toast.warn(`can not delete product: ${error}`);
    }
  }

  const handleMarkOutofStockProduct = async(productId: string) => {
    try {
      const markosResponse = await axios.post("/api/mark-out-of-stock", { id: productId });

      if(!markosResponse.data.success){
        return toast.warn(`can not mark product out of stock: ${markosResponse.data.message}`);
      }

      toast.success("product marked out of stock successfully");
      getAllProducts();
    } catch (error) {
      toast.warn(`can not mark product out of stock: ${error}`);
    }
  }

  useEffect(()=>{
    const isAuthenticated = localStorage.getItem('adminToken');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
    getAllCategories();
    getAllProducts();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-5 py-24">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Admin</Link></li>
            <li>›</li>
            <li className="text-gray-900">All Products</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 mr-4 mt-2 md:block hidden">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Product categories</h2>
              <ul className="space-y-3">
                {
                  allCategories ? (
                    allCategories.map((category) => (
                      <li key={category.id}>
                        <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => setSelectedCategory(category.title)}>
                          {category.title}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className='text-gray-500'>no categories</p>
                  )
                }
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Filter by Price</h2>
              <input
                type="range"
                min="300"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                <span className="text-gray-600">Price: ₹{priceRange[0]} — ₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Sidebad for mobile */}
          <div className={`md:col-span-1 px-2 mt-2 md:hidden ${isFilterOpen ? 'block' : 'hidden'}`}>
            <div className="mb-8">
              <div className='flex justify-end items-center w-full'>
                <X onClick={() => setIsFilterOpen(!isFilterOpen) } />
              </div>
              <h2 className="text-xl font-bold mb-4">Product categories</h2>
              <ul className="space-y-3">
                {
                  allCategories ? (
                    allCategories.map((category) => (
                      <li key={category.id}>
                        <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => setSelectedCategory(category.title)}>
                          {category.title}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className='text-gray-500'>no categories</p>
                  )
                }
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Filter by Price</h2>
              <input
                type="range"
                min="50"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                <span className="text-gray-600">Price: ₹{priceRange[0]} — ₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-start md:items-center mb-8 md:flex-row flex-col-reverse">
              <p className="text-gray-600">Showing 1–4 of {allProducts?.length} results</p>
              <div className="flex items-center justify-between w-full md:w-fit space-x-4 mb-4">
                <select className="border rounded-md px-4 py-2" value={sortingOrder} onChange={(e) => setSortingOrder(e.target.value)}>
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by average rating</option>
                  <option>Sort by latest</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                </select>

                {
                  !isFilterOpen && <Filter className='md:hidden' onClick={() => setIsFilterOpen(!isFilterOpen) } />
                }
              </div>
            </div>

            {
              allProducts ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
                  {allProducts
                  .filter((product) => product.discountedPrice < priceRange[1])
                  .sort((a, b) => {
                    switch(sortingOrder) {
                      case "Sort by price: low to high": return a.discountedPrice - b.discountedPrice
                      case "Sort by price: high to low": return b.discountedPrice - a.discountedPrice
                      case "Sort by average rating": return b.rating - a.rating
                      case "Sort by popularity": return b.reviews.length - a.reviews.length
                      default: return 0
                    }
                  })
                  .filter((product) => {
                    if(selectedCategory !== "All Categories") {
                      return product.category === selectedCategory;
                    }

                    return product;
                  })
                  .map((product) => (
                    <div key={product.id} className="group">
                      <Link href={`/admin/edit-product/${product.id}`} className="block relative">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full aspect-square object-cover rounded-lg"
                          width={800}
                          height={800}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                      </Link>
                      <div className="mt-4">
                        <Link href={`/admin/edit-product/${product.id}`} className="block">
                          <h3 className="text-lg font-medium text-gray-900 hover:text-[#C17777]">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < product.rating ? 'fill-current' : ''}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-medium text-[#C17777]">
                            ₹{product.discountedPrice}
                          </span>
                          {product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex justify-between items-center mt-4'>
                          <Button onClick={() => handleMarkOutofStockProduct(product.id ? product.id : '')} className="bg-white text-[#B8860B] border-2 border-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-colors mr-1">
                              {
                                product.instock ? "Mark Out of Stock" : "Mark In Stock"
                              }
                          </Button>
                          <Button onClick={() => handleDeleteProduct(product.id ? product.id : '')} className="bg-[#B8860B] border-2 border-[#B8860B] text-white hover:bg-[#B8860B] hover:text-white transition-colors w-full ml-1">
                              Delete
                          </Button>
                      </div>
                      <div className='flex justify-center items-center mt-2 w-full'>
                          <Link href={`/admin/product-reviews/${product.id}`} className="bg-[#B8860B] border-2 border-[#B8860B] text-white hover:bg-[#B8860B] hover:text-white transition-colors w-full flex rounded-md justify-center items-center py-2">
                              All Reviews
                          </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                isLoading ? (
                  <div className='flex justify-center items-center'>
                    <p className='text-gray-500'>Loading...</p>
                  </div>
                ) : (
                  <div className='flex justify-center items-center'>
                    <p className='text-gray-500'>No Products</p>
                  </div>
                )
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAllProductsPage;