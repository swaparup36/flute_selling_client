import { productType } from "./types";

export const allProducts: productType[] = [
    {
      id: "1",
      name: "Hallmark Stuffed Snoopy",
      category: "Home & Living",
      discountedPrice: 499,
      price: 899,
      rating: 3,
      image: "/images/products/product1.jpg",
      description: `
        An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.

        Ea erant impetus consequuntur eos, velit congue vidisse eos ne. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      `,
      reviews: [
        {
          id: "1",
          author: "Sarah Johnson",
          rating: 5,
          content: "This home decor piece is absolutely beautiful! The quality is exceptional, and it adds such a lovely touch to my living room. The encouraging message brings positivity to my space every day.",
          date: "March 15, 2024",
          productId: "1"
        },
        {
          id: "2",
          author: "Michael Chen",
          rating: 4,
          content: "Great product overall. The design is elegant and the materials feel premium. Shipping was quick and the packaging protected the item well. Would recommend!",
          date: "March 10, 2024",
          productId: "1"
        },
        {
          id: "3",
          author: "Emily Williams",
          rating: 5,
          content: "Perfect gift for my friend's housewarming! The craftsmanship is impressive and the message is meaningful. Love supporting businesses that create such thoughtful products.",
          date: "March 5, 2024",
          productId: "1"
        }
      ]
    },
    {
      id: "2",
      name: "Throated Hummingbird Statue Figurine",
      category: "Jewelry & Accessories",
      discountedPrice: 399,
      price: 599,
      rating: 4.5,
      image: "/images/products/product2.jpg",
      description: `
        An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.

        Ea erant impetus consequuntur eos, velit congue vidisse eos ne. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      `,
      reviews: [
        {
          id: "1",
          author: "Sarah Johnson",
          rating: 5,
          content: "This home decor piece is absolutely beautiful! The quality is exceptional, and it adds such a lovely touch to my living room. The encouraging message brings positivity to my space every day.",
          date: "March 15, 2024",
          productId: "2"
        },
        {
          id: "2",
          author: "Emily Williams",
          rating: 5,
          content: "Perfect gift for my friend's housewarming! The craftsmanship is impressive and the message is meaningful. Love supporting businesses that create such thoughtful products.",
          date: "March 5, 2024",
          productId: "2"
        }
      ]
    },
    {
      id: "3",
      name: "The Golden Girls Perpetual Calendar",
      category: "Home & Living",
      discountedPrice: 92,
      price: 117,
      rating: 5,
      image: "/images/products/product3.jpg",
      description: `
        An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.

        Ea erant impetus consequuntur eos, velit congue vidisse eos ne. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      `,
      reviews: [
        {
          id: "1",
          author: "Sarah Johnson",
          rating: 5,
          content: "This home decor piece is absolutely beautiful! The quality is exceptional, and it adds such a lovely touch to my living room. The encouraging message brings positivity to my space every day.",
          date: "March 15, 2024",
          productId: "3"
        },
        {
          id: "2",
          author: "Michael Chen",
          rating: 4,
          content: "Great product overall. The design is elegant and the materials feel premium. Shipping was quick and the packaging protected the item well. Would recommend!",
          date: "March 10, 2024",
          productId: "3"
        },
        {
          id: "3",
          author: "Emily Williams",
          rating: 5,
          content: "Perfect gift for my friend's housewarming! The craftsmanship is impressive and the message is meaningful. Love supporting businesses that create such thoughtful products.",
          date: "March 5, 2024",
          productId: "3"
        }
      ]
    },
    {
      id: "4",
      name: "Musical Kissing Couple",
      category: "Occasion Gifts",
      discountedPrice: 148,
      price: 187,
      rating: 4,
      image: "/images/products/product4.jpg",
      description: `
        An dico accommodare ius, porro mnesarchum pro in. Cetero fierent urbanitas eam id, sed movet voluptua ut. Eu agam malorum nec. Eu has vide putent, dico option nominati no eam.

        Ea erant impetus consequuntur eos, velit congue vidisse eos ne. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      `,
      reviews: [
        {
          id: "1",
          author: "Sarah Johnson",
          rating: 5,
          content: "This home decor piece is absolutely beautiful! The quality is exceptional, and it adds such a lovely touch to my living room. The encouraging message brings positivity to my space every day.",
          date: "March 15, 2024",
          productId: "4"
        },
        {
          id: "2",
          author: "Michael Chen",
          rating: 4,
          content: "Great product overall. The design is elegant and the materials feel premium. Shipping was quick and the packaging protected the item well. Would recommend!",
          date: "March 10, 2024",
          productId: "4"
        }
      ]
    }
];