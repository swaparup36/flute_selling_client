"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <main className="bg-[#FFF5E6] min-h-screen py-16">
      <section className="max-w-7xl mx-auto px-2 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-0 md:p-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">
            <div className="flex-1 flex justify-center">
              <Image
                src="/images/classical-flute-banner.webp"
                alt="Bakale's Flute"
                width={440}
                height={440}
                className="rounded-2xl object-cover shadow-xl border-4 border-[#B8860B]/10"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#B8860B] mb-6 drop-shadow-sm">
                About Bakale&apos;s Flute
              </h1>
              <p className="text-gray-700 text-xl mb-5 leading-relaxed">
                Welcome to <span className="font-semibold text-[#B8860B]">Bakale&apos;s Flute</span> – your trusted destination for premium handcrafted bamboo flutes and accessories. With a passion for music and craftsmanship, we have been serving musicians, students, and enthusiasts for over <span className="font-semibold">25 years</span>.
              </p>
              <p className="text-gray-700 text-xl mb-5 leading-relaxed">
                Our flutes are crafted with precision and love, ensuring rich, resonant sound and superior playability. Whether you are a beginner or a professional, you&apos;ll find the perfect flute in our collection.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-[#FFF5E6] rounded-xl p-4 shadow flex flex-col items-center border border-[#B8860B]/10">
                  <Image src="/images/categories/hindustani-middle-flute.jpg" alt="Hindustani Flutes" width={60} height={60} className="rounded-lg mb-2" />
                  <span className="font-semibold text-[#B8860B] text-center text-sm">Hindustani Flutes</span>
                </div>
                <div className="bg-[#E6E8FF] rounded-xl p-4 shadow flex flex-col items-center border border-[#B8860B]/10">
                  <Image src="/images/categories/assam-bass-flute.jpg" alt="Classical Flutes" width={60} height={60} className="rounded-lg mb-2" />
                  <span className="font-semibold text-[#B8860B] text-center text-sm">Classical Flutes</span>
                </div>
                <div className="bg-[#FFE6E6] rounded-xl p-4 shadow flex flex-col items-center border border-[#B8860B]/10">
                  <Image src="/images/categories/flute-combo.jpg" alt="Flute Combos" width={60} height={60} className="rounded-lg mb-2" />
                  <span className="font-semibold text-[#B8860B] text-center text-sm">Flute Combos</span>
                </div>
                <div className="bg-[#E6FFE6] rounded-xl p-4 shadow flex flex-col items-center border border-[#B8860B]/10">
                  <Image src="/images/categories/flute-accessories.jpg" alt="Flute Accessories" width={60} height={60} className="rounded-lg mb-2" />
                  <span className="font-semibold text-[#B8860B] text-center text-sm">Flute Accessories</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-semibold text-[#B8860B] mb-4">Why Choose Us?</h2>
            <ul className="text-gray-700 text-lg space-y-3 max-w-3xl mx-auto">
              <li>🎶 <span className="font-medium">Handcrafted Excellence:</span> Every flute is made with care and expertise.</li>
              <li>🎵 <span className="font-medium">Wide Variety:</span> Hindustani, Classical, Combos, and Accessories for all needs.</li>
              <li>🚚 <span className="font-medium">Fast & Secure Shipping:</span> Your instrument arrives safely and quickly.</li>
              <li>💬 <span className="font-medium">Expert Guidance:</span> We help you choose the right flute for your journey.</li>
              <li>😊 <span className="font-medium">Trusted by 5000+ Musicians:</span> Join our happy community!</li>
            </ul>
          </div>
        </motion.div>
      </section>
    </main>
  );
}