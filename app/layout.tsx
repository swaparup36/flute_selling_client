import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Satyam - Handcrafted Gifts with Indian Heritage',
  description: 'Discover unique handcrafted gifts that blend modern aesthetics with Indian cultural heritage at Satyam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CartProvider>
        <body className={poppins.className}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </CartProvider>
    </html>
  );
}