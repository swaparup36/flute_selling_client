"use client";

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Store Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">OUR STORE</h3>
            <p className="text-gray-600 mb-4">
              We promise {"we'll"} get back to you promptly— your gifting needs are always on our minds!
            </p>
            <p className="text-gray-600">Monday – Friday 8am – 6pm pts.</p>
          </div>

          {/* Information */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">INFOMATION</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">My account</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Track Orders</a></li>
              <li><a href="#" className="text-gray-600 hover:text-red-500">Reminder Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Sign Up</a></li>
            </ul>
          </div> */}

          {/* Admin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Admin</h3>
            <ul className="space-y-2">
              <li><Link href="/admin/login" className="text-gray-600 hover:text-gray-900">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SERVICES</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
            <ul className="space-y-2">
              <li><p className="text-gray-600 hover:text-gray-900">Email: demo@email.com</p></li>
              <li><p className="text-gray-600 hover:text-gray-900">Phone: +91 8892217365</p></li>
              <li><p className="text-gray-600 hover:text-gray-900">Address: S.S.K. Colony Mulgund Road. GADAG-582 103, Raod, Mulgund, Gadag-Betageri, Karnataka - 582103</p></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            Copyright© 2025 Swaparup Mukherjee. All Rights Reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;