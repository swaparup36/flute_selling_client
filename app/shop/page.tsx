"use client";



import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Filter, Heart, ShoppingCart, Star, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { productCategoryType, productType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GetContext } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';


const ProductsPage = () => {
  const { addToCart, productIds, getAllProductIdsOnCart } = GetContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [priceRange, setPriceRange] = useState([300, 5000]);
  const [sortingOrder, setSortingOrder] = useState<string>("Default sorting");
  const [filterCategory, setFilterCategory] = useState<string>(category? category : "all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<productType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<productCategoryType[] | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

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

  const addToWishlist = async (productId: string) => {
    try {
        const response = await axios.post('/api/add-to-wishlist', { productId: productId },
            { 
              headers: { 
                  "AuthToken": localStorage.getItem('usertoken')
              }
            }
        );
        if (!response.data.success) {
            return console.log("Can not add to cart: ", response.data.message);
        }
        getWishlistIds();
    } catch (error) {
        console.log("Can not add to cart: ", error);
    }
  }

  const getWishlistIds = async () => {
    try {
      const response = await axios.get('/api/get-wishlist-ids', {
        headers: {
          "AuthToken": localStorage.getItem('usertoken')
        }
      });

      if (!response.data.success) {
        return console.log(`can not fetch wishlist ids: ${response.data.message}`);
      }
      setWishlistIds(response.data.productIds);
    } catch (error) {
      console.log(`can not fetch wishlist ids: ${error}`);
    }
  }

  const deleteFromWishlist = async (productId: string) => {
    try {
      const response = await axios.post("/api/remove-wishlist", { productId }, {
        headers: {
          "AuthToken": localStorage.getItem('usertoken')
        }
      });
      console.log("wishlist from user: ", response.data);

      if (!response.data.success) {
        return console.log("Can not remove wishlist: ", response.data.message);
      }

      getWishlistIds();
    } catch (error) {
      console.log("Can not remove wishlist: ", error);
    }
  }

  const getAllProducts = async(isLoadMore: boolean = false) => {
    if (!isLoadMore) {
        setIsLoading(true);
    } else {
        setIsLoadingMore(true);
    }

    try {
        const getAllProductsResponse = await axios.get(`/api/get-all-products?category=${filterCategory}&page=${page}&limit=9`);

        if(!getAllProductsResponse.data.success){
            setIsLoading(false);
            setIsLoadingMore(false);
            return toast.warn(`can not fetch products: ${getAllProductsResponse.data.message}`);
        }

        const newProducts = getAllProductsResponse.data.allProducts;
        setHasMore(newProducts.length === 9); // If we got less than 9 products, we've reached the end

        if (isLoadMore) {
            setAllProducts(prev => prev ? [...prev, ...newProducts] : newProducts);
        } else {
            setAllProducts(newProducts);
        }

        setIsLoading(false);
        setIsLoadingMore(false);
    } catch (error) {
        toast.warn(`can not fetch products: ${error}`);
        setIsLoading(false);
        setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                setPage(prev => prev + 1);
            }
        },
        { threshold: 1.0 }
    );

    if (observerTarget.current) {
        observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    getAllCategories();
    setPage(1);
    setHasMore(true);
    getAllProducts();
    getAllProductIdsOnCart();
    getWishlistIds();
  }, [filterCategory]);

  useEffect(() => {
    if (page > 1) {
        getAllProducts(true);
    }
  }, [page]);

  return (
    <>
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-5 py-24">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li>›</li>
            <li className="text-gray-900">Shop</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 mr-4 mt-2 md:block hidden">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Product categories</h2>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => {
                    router.push(`/shop`);
                    setPage(1);
                    setFilterCategory('all');
                  }}>
                    All Categories
                  </span>
                </li>
                {
                  allCategories ? (
                    allCategories.map((category) => (
                      <li key={category.id}>
                        <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => {
                          router.push(`/shop?category=${category.title}`);
                          setPage(1);
                          setFilterCategory(category.title);
                        }}>
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
                <li>
                  <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => {
                    router.push(`/shop`);
                    setPage(1);
                    setFilterCategory('all');
                  }}>
                    All Categories
                  </span>
                </li>
                {
                  allCategories ? (
                    allCategories.map((category) => (
                      <li key={category.id}>
                        <span className="text-gray-600 hover:text-[#C17777] cursor-pointer" onClick={() => {
                          router.push(`/shop?category=${category.title}`);
                          setPage(1);
                          setFilterCategory(category.title);
                        }}>
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
                allProducts.filter((product) => product.instock === true).length > 0 ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
                    {allProducts
                    .filter((product) => product.instock === true)
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
                    .map((product) => (
                      <motion.div key={product.id} className="group">
                        <Link href={`/product-details/${product.id}`} className="block relative">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full aspect-square object-cover rounded-lg"
                            width={800}
                            height={800}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                        </Link>
                        <button
                          onClick={() => {
                            if (wishlistIds?.includes(product.id as string)) {
                              deleteFromWishlist(product.id as string);
                            } else {
                              addToWishlist(product.id as string);
                            }
                          }}
                          className="relative -top-72 -right-64 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 z-50"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              wishlistIds?.includes(product.id as string) 
                                ? 'fill-red-500 stroke-red-500' 
                                : 'stroke-gray-600'
                            }`}
                          />
                        </button>
                        <div className="mt-4">
                          <Link href={`/product-details/${product.id}`} className="block">
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
                          <div className="space-y-2 my-2 w-full">
                            <Button variant='secondary' className={`${productIds?.includes(product.id as string) ? 'bg-gray-800' : 'bg-black'} w-full text-white hover:bg-gray-800`} onClick={() => addToCart(product.id as string)} disabled={productIds?.includes(product.id as string)} >
                              {
                                productIds?.includes(product.id as string) ? (
                                  <>
                                    Already in cart
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className='w-4 h-4 mx-3' />
                                    Add to Cart
                                  </>
                                )
                              }
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className='flex justify-center items-center'>
                    <p className='text-gray-500'>No Products</p>
                  </div>
                )
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

            <div ref={observerTarget} className="w-full h-10 flex items-center justify-center">
                {isLoadingMore && (
                    <div className="text-gray-500">Loading more products...</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ShopProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  );
}