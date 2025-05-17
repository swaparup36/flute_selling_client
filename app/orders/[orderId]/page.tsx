"use client";

import React, { useEffect } from 'react';
import { ChevronLeft, Truck, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { OrdersWithItems } from '@/lib/types';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function OrderDetails() {
    const { orderId } = useParams();
    const router = useRouter();
    const [orderData, setOrderData] = React.useState<OrdersWithItems | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [cancelLoading, setCancelLoading] = React.useState<boolean>(false);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
        case 'confirmed':
            return <Clock className="h-5 w-5" />;
        case 'delivered':
            return <CheckCircle className="h-5 w-5" />;
        case 'cancelled':
            return <XCircle className="h-5 w-5" />;
        default:
            return <Clock className="h-5 w-5" />;
        }
    };

    const getOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/get-order-details', {
                orderId: orderId
            },
            {
                headers: { 
                    "AuthToken": localStorage.getItem('usertoken')
                }
            });

            console.log("orderData: ", response.data);
            if (!response.data.success) {
                setIsLoading(false);
                return console.log("Can not get order details: ", response.data.message);
            }

            setOrderData(response.data.orderWithItems);
            setIsLoading(false);
        } catch (error) {
            console.log("Can not get order details: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancelOrder = async (orderId: string) => {
      setCancelLoading(true);
      try {
        const response = await axios.post('/api/cancel-order', { orderId }, {
          headers: {
            "AuthToken": localStorage.getItem('usertoken')
          }
        });

        if (!response.data.success) {
          setCancelLoading(false);
          return console.log("can not cancel order: ", response.data.message);
        }

        getOrderDetails();
        setCancelLoading(false);
      } catch (error) {
        console.log("Can not cancel order: ", error);
      } finally {
        setCancelLoading(false);
      }
    }

    useEffect(() => {
      getOrderDetails();
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

    if (!orderData) {
        return (
          <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              Order not found
            </div>
          </div>
        );
    }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Back Button */}
        <div className="mb-6">
          <button className="flex items-center text-gray-600 hover:text-gray-900" onClick={() => router.push('/myprofile?tab=orders')} >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Order Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Order #{orderData.order.id}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Placed on {new Date(orderData.order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(orderData.order.status)}`}>
                {getStatusIcon(orderData.order.status)}
                <span className="ml-2 text-sm font-medium capitalize">{orderData.order.status}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {orderData.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center bg-gray-50 rounded-lg p-4">
                      <div className='flex justify-between items-center w-full'>
                        <Image width={200} height={200} src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
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
                      </div>
                      <Button disabled={cancelLoading} className="w-[20%] border-2 border-[#B8860B] text-[#B8860B] py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2" onClick={() => router.push(`/add-product-review/${item.productId}`)}>
                        <Star className='w-4 mr-2' />
                        Review
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Items</span>
                      <span className="text-gray-900">{orderData.order.total_quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contact Email</span>
                      <span className="text-gray-900">{orderData.order.buyer_email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contact Phone</span>
                      <span className="text-gray-900">{orderData.order.buyer_phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="text-gray-900 capitalize">{orderData.order.payment_method}</span>
                    </div>
                    {orderData.order.tracking_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tracking ID</span>
                        <span className="text-gray-900">{orderData.order.tracking_id}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-900">Total Amount</span>
                        <span className="text-base font-medium text-gray-900">₹{orderData.order.total_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {orderData.order.buyer_firstName} {orderData.order.buyer_lastname}<br />
                        {orderData.order.buyer_address}<br />
                        {orderData.order.buyer_city}, {orderData.order.buyer_state}<br />
                        PIN: {orderData.order.buyer_pincode}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <Truck className="h-5 w-5 mr-2" />
                        <span>Standard Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help Section */}
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {
                      orderData.order.status === 'cancelled' ? (
                        <p className='w-full border-2 border-gray-500 py-2 rounded-md text-center'>Order Cancelled</p>
                      ) : (
                        orderData.order.status === 'delivered' ? (
                          <p className='w-full border-2 border-gray-500 py-2 rounded-md text-center'>Order Delivered</p>
                        ) : (
                          <div className='flex justify-start items-center bg-white'>
                            <p className='text-lg text-gray-600 font-semibold'>Contact: +91 6589452132</p>
                          </div>
                        )
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;