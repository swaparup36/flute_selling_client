'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GetContext } from '@/context/CartContext';
import { productType } from '@/lib/types';

interface CartItem extends productType {
    quantity: number;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const router = useRouter();

  const { cartCount, getCartCount } = GetContext();


  useEffect(() => {
    const token = localStorage.getItem('usertoken');
    if (token) {
      console.log("loggedin")
      setIsLoggedin(true);
      getCartCount();
    }
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center w-fit">
            <Image src="/logo.png" alt='logo' width={200} height={200} className='w-32 h-12' />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-14 -ml-20">
            <Link href="/" className="text-gray-700 hover:text-[#B8860B] transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-[#B8860B] transition-colors">
              Shop
            </Link>
            <Link href="/about-us" className="text-gray-700 hover:text-[#B8860B] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#B8860B] transition-colors">
              Contact
            </Link>
          </div>

          {/* Login/Signup Button */}
          {
            isLoggedin ? (
              <div className="flex items-center text-black space-x-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartCount > 0 && (
                    <div className="relative -translate-y-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </div>
                  )}
                </Button>
                <Button variant="ghost" className='rounded-full border-2 border-gray-700' size="icon" onClick={() => router.push('/myprofile')}>
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {cartCount > 0 && (
                    <div className="relative -translate-y-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </div>
                  )}
                </Button>
                <Button variant="secondary" className='ml-2' onClick={() => router.push('/auth/login')}>
                  Login/Signup
                </Button>
              </div>
            )
          }

          {/* Right Icons */}
          <div className="flex items-center space-x-4 md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-[#B8860B] transition-colors">
                Home
              </Link>
              <Link href="/shop" className="block px-3 py-2 text-gray-700 hover:text-[#B8860B] transition-colors">
                Shop
              </Link>
              <Link href="/about-us" className="block px-3 py-2 text-gray-700 hover:text-[#B8860B] transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-[#B8860B] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}