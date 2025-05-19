import '../globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin | Satyam - Handcrafted Gifts with Indian Heritage',
  description: 'Discover unique handcrafted gifts that blend modern aesthetics with Indian cultural heritage at Satyam.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AdminNavbar />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}