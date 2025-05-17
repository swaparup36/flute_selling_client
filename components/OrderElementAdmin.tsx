"use client";

import { OrdersWithItems } from "@/lib/types";
import { CheckCircle, ChevronDown, Clock, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";

function OrderElementAdmin({
  ordersWithItems,
}: {
  ordersWithItems: OrdersWithItems;
}) {
  const { order, orderItems } = ordersWithItems;

  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [trackingId, setTrackingId] = useState<string | null>(
    order.tracking_id || null
  );
  const [orderStatus, setOrderStatus] = useState<string>(order.status);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const statusOptions = ["pending", "confirmed", "delivered", "cancelled"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Clock className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const updateTrackingId = async (orderId: string, trackingId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/update-tracking-id",
        {
          orderId,
          trackingId,
        },
        {
          headers: {
            AdminSecret: process.env.NEXT_PUBLIC_ADMIN_SECRET,
          },
        }
      );

      if (!response.data.success) {
        setIsLoading(false);
        console.log("Can not update tracking ID: ", response.data.message);
      }

      setTrackingId(response.data.trackingId);
      setIsLoading(false);
      toast.success("Tracking ID updated successfully");
    } catch (error) {
      console.log("Can not update tracking ID: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/update-status",
        {
          orderId,
          status,
        },
        {
          headers: {
            AdminSecret: process.env.NEXT_PUBLIC_ADMIN_SECRET,
          },
        }
      );

      if (!response.data.success) {
        setIsLoading(false);
        console.log("Can not update tracking ID: ", response.data.message);
      }

      setOrderStatus(response.data.status);
      setIsLoading(false);
      toast.success("Status updated successfully");
    } catch (error) {
      console.log("Can not update tracking ID: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div key={order.id} className="p-6 mb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Order Summary */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleOrderExpansion(order.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                      expandedOrders.includes(order.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(
                  orderStatus
                )}`}
              >
                {getStatusIcon(orderStatus)}
                <span className="ml-2 text-sm font-medium capitalize">
                  {orderStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {order.buyer_firstName} {order.buyer_lastname}
                  <br />
                  {order.buyer_email}
                  <br />
                  {order.buyer_phone}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Shipping Address
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {order.buyer_address}
                  <br />
                  {order.buyer_city}, {order.buyer_state}
                  <br />
                  PIN: {order.buyer_pincode}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Payment Details
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  Method: {order.payment_method.toUpperCase()}
                  <br />
                  Amount: ₹{order.total_price}
                  <br />
                  Items: {order.total_quantity}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              {/* Tracking ID Input */}
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xs">
                    <label
                      htmlFor={`tracking-${order.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tracking ID
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        type="text"
                        id={`tracking-${order.id}`}
                        value={trackingId || ""}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking ID"
                      />
                      {order.tracking_id && (
                        <div className="flex items-center text-green-600">
                          <Truck className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="mt-5"
                    onClick={() => updateTrackingId(order.id, trackingId || "")}
                    disabled={isLoading || trackingId === order.tracking_id}
                  >
                    Update
                  </Button>
                </div>
              </div>
              {/* Order Status dropdown */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-medium text-gray-700">
                    Order Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <select
                      className="w-full px-4 py-2 border rounded-md focus:ring-[#C17777] focus:border-[#C17777]"
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                    >
                      <option value="">Select a Status</option>
                      {statusOptions.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="secondary"
                      onClick={() => updateStatus(order.id, orderStatus)}
                      disabled={isLoading || orderStatus === order.status}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Order Items */}
        {expandedOrders.includes(order.id) && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-50 rounded-lg p-4"
                >
                  <Image
                    height={200}
                    width={200}
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{item.price}
                    </p>
                    {/* Add thread colors and custom name */}
                    <div className="mt-2 space-y-1">
                      {item.thread_one && (
                        <p className="text-xs text-gray-500">
                          Thread Color 1:{" "}
                          <span className="capitalize">{item.thread_one}</span>
                        </p>
                      )}
                      {item.thread_two && (
                        <p className="text-xs text-gray-500">
                          Thread Color 2:{" "}
                          <span className="capitalize">{item.thread_two}</span>
                        </p>
                      )}
                      {item.name_on && (
                        <p className="text-xs text-gray-500">
                          Custom Name:{" "}
                          <span className="font-medium">{item.name_on}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderElementAdmin;
