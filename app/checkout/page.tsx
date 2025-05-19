"use client";

import React from "react";
import { Truck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GetContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import logo from "@/public/logo.png";
import * as dotenv from "dotenv";
import { shippingDetailsSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";

dotenv.config();

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: number | null;
  phone: string;
  paymentMethod: string;
}

function Checkout() {

  const { checkoutItems, subtotal, getCartCount } = GetContext();
  const router = useRouter();

  const [shippingDetails, setShippingDetails] = React.useState<ShippingDetails>(
    {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: null,
      phone: "",
      paymentMethod: "online"
    }
  );
  const [shipping, setShipping] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formValidationErrors, setFormValidationErrors] = React.useState<Record<string, string> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setShippingDetails((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setShippingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneInputChange = (value: string, country: any) => {
    console.log(country.name);
    if (country.name !== "India") {
      // Calculate the total quantity of items in the cart
      let totalQuantity = 0;
      for (const item of checkoutItems) {
        if (item.quantity) {
          totalQuantity += item.quantity;
        } else {
          totalQuantity += 1;
        }
      }

      setShipping(2000 * totalQuantity);
    } else {
      setShipping(0);
    }

    setShippingDetails(prev => ({
      ...prev,
      phone: value
    }));
  };

  function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    setFormValidationErrors(null);
    setIsLoading(true);
    const validationResult = shippingDetailsSchema.safeParse(shippingDetails);
    if(!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setFormValidationErrors(
          Object.fromEntries(
          Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] || "Invalid field"])
          )
      );
      setIsLoading(false);
      return console.log("zod error");
    }

    console.log("displaying razorpay");
    // Load the Razorpay script
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    console.log("razorpay displayed: ", res);

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsLoading(false);
        return;
    }

    // creating a new order
    const result = await axios.post("api/payment/order", { amount: total * 100, items: checkoutItems }, { 
      headers: { 
        "AuthToken": localStorage.getItem('usertoken')
      }
    });

    console.log("order response: ", result.data);
    if (!result.data.success) {
      if (result.data.message === "Item is out of stock") {
        alert(`${result.data.item} is out of stock`);
      }
      alert("Server error. Are you online?");
      setIsLoading(false);
      return;
    }

    // Getting the order details back
    console.log("payment order response: ", result.data);
    const { order: { amount, id: order_id, currency } } = result.data;

    let totalQuantity = 0;
    for (const item of checkoutItems) {
      if (item.quantity) {
        totalQuantity += item.quantity;
      } else {
        totalQuantity += 1;
      }
    }

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Bakale's Flute",
        description: "Test Transaction",
        image: { logo },
        order_id: order_id,
        handler: async function (response: any) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                shippingDetails: shippingDetails,
                items: checkoutItems,
                total_price: total,
                total_quantity: totalQuantity
            };

            const result = await axios.post("api/payment/pay-success", data, {
              headers: { 
                "AuthToken": localStorage.getItem('usertoken')
              }
            });

            console.log(result.data);

            if (!result.data.success) {
              alert("Payment failed. Please try again.");
              setIsLoading(false);
              return;
            }

            getCartCount();
            setIsLoading(false);
            router.push("/shop");
        },
        prefill: {
            name: shippingDetails.firstName + " " + shippingDetails.lastName,
            email: shippingDetails.email,
            contact: shippingDetails.phone,
        },
        notes: {
            address: shippingDetails.address,
        },
        theme: {
            color: "#B8860B",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setIsLoading(false);
  }

  async function handleCodOrder() {
      setFormValidationErrors(null);
      setIsLoading(true);
      const validationResult = shippingDetailsSchema.safeParse(shippingDetails);
      if(!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        setFormValidationErrors(
            Object.fromEntries(
            Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] || "Invalid field"])
            )
        );
        setIsLoading(false);
        return console.log("zod error");
      }

      let totalQuantity = 0;
      for (const item of checkoutItems) {
        if (item.quantity) {
          totalQuantity += item.quantity;
        } else {
          totalQuantity += 1;
        }
      }


      try {
        const data = {
          shippingDetails: shippingDetails,
          items: checkoutItems,
          total_price: total,
          total_quantity: totalQuantity
        };
  
        const result = await axios.post("api/payment/cod-order", data, {
          headers: { 
            "AuthToken": localStorage.getItem('usertoken')
          }
        });
  
        console.log(result.data);
  
        if (!result.data.success) {
          alert("Unable to place order. Please try again.");
          setIsLoading(false);
          return;
        }
  
        getCartCount();
        setIsLoading(false);
        router.push("/shop");
      } catch (error) {
        console.log("Can not Place order: ", error);
        setIsLoading(false);
      }
  }
 
  const total = subtotal + shipping;

  return (
    <>
      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Shipping and Payment Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Checkout
                </h2>

                {/* Shipping Information */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Truck className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Shipping Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={shippingDetails.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.firstName) &&
                            <p className="text-red-500 text-sm mt-1">
                                {formValidationErrors.firstName}
                            </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={shippingDetails.lastName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.lastName) &&
                            <p className="text-red-500 text-sm mt-1">
                                {formValidationErrors.lastName}
                            </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingDetails.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.email) &&
                            <p className="text-red-500 text-sm mt-1">
                                {formValidationErrors.email}
                            </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <PhoneInput
                        country={'in'} // Default country (India)
                        value={shippingDetails.phone}
                        onChange={handlePhoneInputChange}
                        inputClass="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 h-10"
                        containerClass="w-full"
                        inputProps={{
                          required: true,
                          name: 'phone'
                        }}
                      />
                      {(formValidationErrors && formValidationErrors.phone) &&
                        <p className="text-red-500 text-sm mt-1">
                            {formValidationErrors.phone}
                        </p>
                      }
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={shippingDetails.address}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.address) &&
                        <p className="text-red-500 text-sm mt-1">
                            {formValidationErrors.address}
                        </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.city) &&
                        <p className="text-red-500 text-sm mt-1">
                            {formValidationErrors.city}
                        </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.state) &&
                        <p className="text-red-500 text-sm mt-1">
                            {formValidationErrors.state}
                        </p>
                      }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="number"
                        name="pincode"
                        required
                        maxLength={6}
                        value={shippingDetails.pincode ? shippingDetails.pincode : ""}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-blue-500 h-10 px-2 focus:ring-blue-500"
                      />
                      {(formValidationErrors && formValidationErrors.pincode) &&
                        <p className="text-red-500 text-sm mt-1">
                            {formValidationErrors.pincode}
                        </p>
                      }
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`cursor-pointer border-2 ${
                            shippingDetails.paymentMethod === 'online'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300'
                          } rounded-md p-4 flex items-center justify-center`}
                          onClick={() =>
                            setShippingDetails((prev) => ({
                              ...prev,
                              paymentMethod: 'online'
                            }))
                          }
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={shippingDetails.paymentMethod === 'online'}
                                onChange={() =>
                                  setShippingDetails((prev) => ({
                                    ...prev,
                                    paymentMethod: 'online'
                                  }))
                                }
                                className="mr-2"
                              />
                              <span className="font-medium">Online Payment</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Pay with Razorpay</p>
                          </div>
                        </div>

                        <div
                          className={`cursor-pointer border-2 ${
                            shippingDetails.paymentMethod === 'cod'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300'
                          } rounded-md p-4 flex items-center justify-center`}
                          onClick={() =>
                            setShippingDetails((prev) => ({
                              ...prev,
                              paymentMethod: 'cod'
                            }))
                          }
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={shippingDetails.paymentMethod === 'cod'}
                                onChange={() =>
                                  setShippingDetails((prev) => ({
                                    ...prev,
                                    paymentMethod: 'cod'
                                  }))
                                }
                                className="mr-2"
                              />
                              <span className="font-medium">Cash on Delivery</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Pay when you receive</p>
                          </div>
                        </div>
                      </div>
                      {formValidationErrors && formValidationErrors.paymentMethod && (
                        <p className="text-red-500 text-sm mt-1">
                          {formValidationErrors.paymentMethod}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/cart"
                className="inline-flex items-center text-blue-600 hover:text-blue-500"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Cart
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-200 last:border-0"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity ? item.quantity : 1}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{item.discountedPrice}
                      </p>
                      <div className="mt-1 space-y-1">
                        <div className="flex justify-start items-center">
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
                            Name: <span className="font-medium">{item.name_on}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{shipping}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <Button 
                  variant='secondary' 
                  disabled 
                  className="mt-6 w-full text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Placing order...
                </Button>
              ) : (
                <Button 
                  variant='secondary' 
                  className="mt-6 w-full text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2" 
                  onClick={shippingDetails.paymentMethod === 'online' ? displayRazorpay : handleCodOrder}
                >
                  {shippingDetails.paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
