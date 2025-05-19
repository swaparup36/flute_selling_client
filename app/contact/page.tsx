"use client";
import { ContactFormSchema } from "@/lib/schemas";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { ToastContainer, toast } from "react-toastify";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formValidationErrors, setFormValidationErrors] = React.useState<Record<
    string,
    string
  > | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validationResult = ContactFormSchema.safeParse(formData);
      if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        setFormValidationErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0] || "Invalid field",
            ])
          )
        );
        setIsLoading(false);
        return console.log("zod error");
      }

      const response = await axios.post("/api/contact-us", formData);
      if (response.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: ""});
      } else {
        toast.error("Unable to send message. Please try again.");
      }
    } catch (error) {
      console.log("Error occured: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#FFF5E6] min-h-screen py-16">
      <ToastContainer />
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
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
                alt="Contact Bakale's Flute"
                width={400}
                height={400}
                className="rounded-2xl object-cover shadow-xl border-4 border-[#B8860B]/10"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#B8860B] mb-6 drop-shadow-sm">
                Contact Us
              </h1>
              <p className="text-gray-700 text-lg mb-6">
                Have questions, need guidance, or want to place a custom order?
                Reach out to us! We’re here to help you on your musical journey.
              </p>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-[#B8860B] font-semibold mb-1"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-[#B8860B] outline-none"
                    placeholder="Your Name"
                    required
                  />
                  {formValidationErrors && formValidationErrors.name && (
                    <p className="text-red-500 my-1">{formValidationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-[#B8860B] font-semibold mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-[#B8860B] outline-none"
                    placeholder="you@email.com"
                    required
                  />
                  {formValidationErrors && formValidationErrors.email && (
                    <p className="text-red-500 my-1">{formValidationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-[#B8860B] font-semibold mb-1"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    name="message"
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-[#B8860B]/30 focus:border-[#B8860B] focus:ring-[#B8860B] outline-none"
                    placeholder="How can we help you?"
                    required
                  />
                  {formValidationErrors && formValidationErrors.message && (
                    <p className="text-red-500 my-1">{formValidationErrors.message}</p>
                  )}
                </div>
                <button
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#B8860B] hover:bg-[#a0760b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a0760b] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                >
                    {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              <div className="mt-8 text-gray-700 text-base">
                <div className="mb-2">
                  <span className="font-semibold text-[#B8860B]">Email:</span>{" "}
                  <a
                    href="mailto:demo@email.com"
                    className="underline hover:text-[#a0760b]"
                  >
                    demo@email.com
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-[#B8860B]">Phone:</span>{" "}
                  <a
                    href="tel:+918892217365"
                    className="underline hover:text-[#a0760b]"
                  >
                    +91 8892217365
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
