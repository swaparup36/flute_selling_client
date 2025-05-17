"use client";

import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { OrdersWithItems } from '@/lib/types';
import Image from 'next/image';
import axios from 'axios';
import OrderElementAdmin from '@/components/OrderElementAdmin';
import { ToastContainer } from 'react-toastify';

function AllOrders() {
  const [orders, setOrders] = useState<OrdersWithItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(({ order }) => {
    const searchString = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchString) ||
      order.buyer_email.toLowerCase().includes(searchString) ||
      order.buyer_phone.toLowerCase().includes(searchString) ||
      `${order.buyer_firstName} ${order.buyer_lastname}`.toLowerCase().includes(searchString)
    );
  });

  const getAllOrders = async () => {
    try {
        const response = await axios.get('/api/get-all-orders-admin', {
            headers: {
                'AdminSecret': process.env.NEXT_PUBLIC_ADMIN_SECRET
            }
        });

        if(!response.data.success) {
            setLoading(false);
            return console.log("Can not get all orders: ", response.data.message);
        }

        setOrders(response.data.ordersWithItems);
        setLoading(false);
    } catch (error) {
        console.log("Can not get all orders: ", error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  if (loading) {
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

  return (
    <>
      <ToastContainer />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((ordersWithItems, index) => (
              <OrderElementAdmin ordersWithItems={ordersWithItems} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllOrders;