"use client";

import React, { Suspense, useEffect } from 'react';
import { User, Package, Heart, Settings, Edit2, Star, ChevronRight, Trash2, LogOut } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { OrdersWithItems } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { productType } from '@/lib/types';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
}

function MyProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'profile';
  const [isEditing, setIsEditing] = React.useState(false);
  
  const [profile, setProfile] = React.useState<UserProfile>({
    name: '',
    email: '',
  });

  const [ordersWithItems, setOrdersWithItems] = React.useState<OrdersWithItems[]>([]);

  const [wishlist, setWishlist] = React.useState<productType[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('usertoken');
    router.push('/auth/login');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save the profile changes to a backend
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getProfile = async () => {
    try {
      const response = await axios.get("/api/get-user-profile",  {
        headers: { 
          "AuthToken": localStorage.getItem('usertoken')
        }
      });

      if (!response.data.success) {
        return console.log("Can not get user profile: ", response.data.message);
      }

      setProfile({
        email: response.data.user.email,
        name: response.data.user.name
      })
    } catch (error) {
      console.log("Can not get user profile: ", error);
    }
  }

  const getOrders = async () => {
    try {
      const response = await axios.get("/api/get-orders-by-user",  {
        headers: { 
          "AuthToken": localStorage.getItem('usertoken')
        }
      });

      console.log("orders from user: ", response.data);

      if (!response.data.success) {
        return console.log("Can not get orders from user: ", response.data.message);
      }

      setOrdersWithItems(response.data.ordersWithItems)
    } catch (error) {
      console.log("Can not get orders from user: ", error);
    }
  }

  const getWishList = async () => {
    try {
      const response = await axios.get("/api/get-wishlist", {
        headers: {
          "AuthToken": localStorage.getItem('usertoken')
        }
      });
      console.log("wishlist from user: ", response.data);

      if (!response.data.success) {
        return console.log("Can not get wishlist from user: ", response.data.message);
      }

      setWishlist(response.data.products);
    } catch (error) {
      console.log("Can not get wishlist: ", error);
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
        return console.log("Can not get wishlist from user: ", response.data.message);
      }

      getWishList();
    } catch (error) {
      console.log("Can not get wishlist: ", error);
    }
  }

  useEffect(() => {
    getProfile();
    getOrders();
    getWishList();
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => router.push('/myprofile?tab=profile')}
                className={`${
                  tab === 'profile'
                    ? 'border-[#B8860B] text-[#B8860B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </button>
              <button
                onClick={() => router.push('/myprofile?tab=orders')}
                className={`${
                  tab === 'orders'
                    ? 'border-[#B8860B] text-[#B8860B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <Package className="h-5 w-5 mr-2" />
                Orders
              </button>
              <button
                onClick={() => router.push('/myprofile?tab=wishlist')}
                className={`${
                  tab === 'wishlist'
                    ? 'border-[#B8860B] text-[#B8860B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
              >
                <Heart className="h-5 w-5 mr-2" />
                Wishlist
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {tab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-[#B8860B] hover:text-[#8B6914]"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6">
                      <Button
                        type="submit"
                        variant='secondary'
                        className="text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="flex items-center text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Orders</h2>
                <div className="space-y-6">
                  {ordersWithItems.map((orderWithItems) => (
                    <div key={orderWithItems.order.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order #{orderWithItems.order.id}</h3>
                          <p className="text-sm text-gray-500">Placed on {new Date(orderWithItems.order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            orderWithItems.order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            orderWithItems.order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            orderWithItems.order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {orderWithItems.order.status.charAt(0).toUpperCase() + orderWithItems.order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {orderWithItems.orderItems.map((item) => (
                          <div key={`${orderWithItems.order.id}-${item.id}`} className="flex items-center">
                          <Image 
                            height={200} 
                            width={200} 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                            
                            <div className="mt-1 space-y-1">
                              <div className='flex justify-start items-center'>
                                {item.thread_one && (
                                  <p className="text-xs text-gray-500 mr-2">
                                    Thread 1: <span className="capitalize">{item.thread_one}</span>
                                  </p>
                                )}
                                {item.thread_two && (
                                  <p className="text-xs text-gray-500">
                                    Thread 2: <span className="capitalize">{item.thread_two}</span>
                                  </p>
                                )}
                              </div>
                              {item.name_on && (
                                <p className="text-xs text-gray-500">
                                  Custom Name: <span className="font-medium">{item.name_on}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Add Review Button for delivered items */}
                          {orderWithItems.order.status === 'delivered' && (
                            <Button
                              onClick={() => router.push(`/add-product-review/${item.productId}`)}
                              variant="outline"
                              size="sm"
                              className="ml-4 flex items-center text-yellow-600 hover:text-yellow-700"
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center" 
                          onClick={() => router.push(`/orders/${orderWithItems.order.id}`)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {tab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Wishlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {
                    wishlist.length > 0 ? (
                        wishlist.map((item) => (
                          <div key={item.id} className="flex items-center py-6 px-4 border-b border-gray-200 last:border-0 shadow-sm hover:shadow-lg rounded-md transition-all duration-300 transform hover:-translate-y-1">
                            <Link href={`/product-details/${item.id}`}>
                              <Image src={item.images[0]} alt={item.name} width={100} height={100} className="w-24 h-24 object-cover rounded-md" />
                            </Link>
                            <div className="ml-6 flex-1">
                                <Link href={`/product-details/${item.id}`}>
                                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                </Link>
                                <div className="flex items-center mt-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                    <span key={`${item.id}-star-${i}`} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <div className="flex items-center mt-2">
                                    <span className="text-xl font-semibold text-gray-900">₹{item.discountedPrice}</span>
                                    <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="text-gray-400 hover:text-red-500" onClick={() => deleteFromWishlist(item.id as string)}>
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                      ))
                    ) : (
                      <p>Empty Wishlist</p>
                    )
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MyProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyProfile />
    </Suspense>
  );
}