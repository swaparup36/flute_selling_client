"use client";

import { Button } from "@/components/ui/button";
import {
  Gift,
  ArrowRight,
  Package,
  HeadphonesIcon,
  Star,
  Quote,
  PartyPopper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FeatureProducts from "./FeatureProducts";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function Home() {
  const router = useRouter();
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604548738669-d4e6c5666dc4')] bg-cover bg-center opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center px-4 py-2 bg-[#FFF5E6] rounded-full"
              >
                <Gift className="h-5 w-5 text-[#B8860B] mr-2" />
                <span className="text-sm font-medium text-[#B8860B]">
                  Handcrafted with Passion
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-6xl font-bold text-gray-900"
              >
                Discover Exquisite
                <span className="block text-[#B8860B] mt-2">Indian Flutes</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 max-w-2xl"
              >
                Experience the rich tradition of Indian flute craftsmanship.
                Each flute is meticulously crafted to produce the perfect sound,
                blending ancient techniques with modern precision.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/shop"
                  className="bg-[#B8860B] hover:bg-[#8B6914] text-white px-8 py-6 text-lg flex items-center h-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md justify-center"
                >
                  Explore Flutes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Button
                  variant="outline"
                  className="border-[#B8860B] text-[#B8860B] hover:bg-[#FFF5E6] px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </motion.div>

              <motion.div
                variants={staggerChildren}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                {[
                  { count: "100+", text: "Flute Varieties" },
                  { count: "5000+", text: "Happy Musicians" },
                  { count: "25+", text: "Years Experience" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h4 className="text-2xl font-bold text-gray-900">
                      {stat.count}
                    </h4>
                    <p className="text-gray-600">{stat.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative md:block hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square rounded-full bg-[#FFF5E6] overflow-hidden">
                <Image
                  src="/images/hero.jpg"
                  alt="Handcrafted Indian Gifts"
                  className="object-cover w-full h-full transform scale-90"
                  width={800}
                  height={800}
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-500">
                      On orders above ₹999
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Package className="h-8 w-8 text-[#B8860B]" />,
                title: "Premium Quality Flutes",
                description:
                  "Handcrafted from the finest materials for exceptional sound quality",
                bgColor: "bg-[#E6E8FF]",
              },
              {
                icon: <PartyPopper className="h-8 w-8 text-[#B8860B]" />,
                title: "For All Skill Levels",
                description:
                  "Perfect flutes for beginners, intermediate players, and professionals",
                bgColor: "bg-[#FFF5E6]",
              },
              {
                icon: <HeadphonesIcon className="h-8 w-8 text-[#B8860B]" />,
                title: "Expert Guidance",
                description:
                  "Professional advice to help you choose the perfect flute",
                bgColor: "bg-[#FFE6E6]",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="py-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of handcrafted flutes for every musical
              journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Hindustani Classical Middle Flute",
                description: "Traditional middle-range flutes for Indian classical music",
                image: "/images/categories/hindustani-middle-flute.jpg",
                bgColor: "bg-[#FFF5E6]",
              },
              {
                title: "Hindustani Classical Bass Flute",
                description: "Deep, resonant bass flutes for Hindustani performances",
                image: "/images/categories/hindustani-bass-flute.jpg",
                bgColor: "bg-[#E6E8FF]",
              },
              {
                title: "Assam Bamboo Bass Flute",
                description: "Authentic Assam bamboo bass flutes with rich tones",
                image: "/images/categories/assam-bass-flute.jpg",
                bgColor: "bg-[#FFE6E6]",
              },
              {
                title: "Assam Bamboo Carnatic Flute",
                description: "Carnatic flutes crafted from Assam bamboo",
                image: "/images/categories/assam-carnatic-flute.jpg",
                bgColor: "bg-[#E6FFE6]",
              },
              {
                title: "Kerala Bamboo Bass Flute",
                description: "Kerala bamboo bass flutes for soulful melodies",
                image: "/images/categories/kerala-bass-flute.jpg",
                bgColor: "bg-[#FFF5E6]",
              },
              {
                title: "Kerala Bamboo Carnatic Flute",
                description: "Carnatic flutes made from Kerala bamboo",
                image: "/images/categories/kerala-carnatic-flute.jpg",
                bgColor: "bg-[#E6E8FF]",
              },
              {
                title: "Flute Combo",
                description: "Curated flute sets for enhanced musical experience",
                image: "/images/categories/flute-combo.jpg",
                bgColor: "bg-[#FFE6E6]",
              },
              {
                title: "Accessories",
                description: "Essential accessories to complement your flute",
                image: "/images/categories/flute-accessories.jpg",
                bgColor: "bg-[#E6FFE6]",
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                variants={slideIn}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${category.bgColor} rounded-2xl p-6 cursor-pointer transition-shadow hover:shadow-lg`}
                onClick={() => router.push(`/shop?category=${category.title}`)}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-6">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Items Section */}
      <FeatureProducts />

      {/* Menu Banner Section */}
      <motion.section
        className="px-24 bg-[#FFF5E6]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="py-24 relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-[url('/images/banner-bg.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div className="space-y-6" variants={fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Our Collections
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover our exquisite range of handcrafted flutes, from classical to contemporary designs
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <motion.button
                  className="px-8 py-3 bg-[#B8860B] text-white rounded-full hover:bg-[#8B6914] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Collections
                </motion.button>

                <motion.button
                  className="px-8 py-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Featured Flutes
                </motion.button>

                <motion.button
                  className="px-8 py-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Special Editions
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        className="py-24 bg-[#FFF5E6]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read genuine reviews from our valued customers about their
              shopping experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                rating: 5,
                comment:
                  "The flute I received was absolutely beautiful. The craftsmanship is exceptional and the sound quality is amazing.",
                image: "/images/reviews/review1.jpg",
                date: "2 weeks ago",
              },
              {
                name: "Rahul Mehra",
                rating: 5,
                comment:
                  "Fast delivery and the packaging was very secure. The flute came with a beautiful carrying case. Highly recommend!",
                image: "/images/reviews/review2.jpg",
                date: "1 month ago",
              },
              {
                name: "Anita Patel",
                rating: 5,
                comment:
                  "Perfect for my son who is learning classical music. The customer service was very helpful in selecting the right flute.",
                image: "/images/reviews/review3.jpg",
                date: "3 weeks ago",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                variants={slideIn}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-md relative"
              >
                <Quote className="absolute text-[#B8860B]/10 h-24 w-24 -top-4 -left-4" />
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      {" "}
                      {/* Add fixed dimensions */}
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill={true} // Use fill instead of width/height
                        className="rounded-full object-cover" // Add object-cover
                        style={{ objectFit: "cover" }} // Ensure consistent sizing
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-[#B8860B] fill-[#B8860B]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{review.comment}</p>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Rest of your sections with similar animation patterns */}
    </main>
  );
}
