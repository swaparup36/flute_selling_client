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
  title: "Bakale's Flute – Premium Handcrafted Bamboo Flutes | Perfect for Beginners & Professionals",
  description: "Shop authentic, handcrafted bamboo flutes at Bakale's Flute – crafted for musicians of all levels. Our premium bansuris deliver rich, resonant sound with superior craftsmanship, ideal for classical music, meditation, and folk traditions. Enjoy fast shipping, expert guidance, and affordable prices. Elevate your music journey with Bakale's Flute today!",
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