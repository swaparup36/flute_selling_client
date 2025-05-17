export type productType = {
    id?: string,
    name: string,
    category: string,
    price: number,
    discountedPrice: number,
    rating: number,
    images: string[],
    description: string,
    instock: boolean,
    reviews: productReviewType[],
}

export type productReviewType = {
    id?: string,
    author: string, 
    rating: number,
    date: string, 
    content: string,
    productId: string;
}

export type productCategoryType = {
    id?: string,
    title: string
}

export type Order = {
    id: string,
    userId: string,
    total_quantity: number,
    total_price: number,
    buyer_firstName: string,
    buyer_lastname: string,
    buyer_email: string,
    buyer_address: string,
    buyer_city: string,
    buyer_state: string
    buyer_pincode: number,
    buyer_phone: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    payment_method: string,
    razorpayPaymentId?: string
    razorpayOrderId?: string
    razorpaySignature?: string
    tracking_id?: string
}

export type orderItems = {
    id: string,
    name: string,
    price: number,
    image: string,
    quantity: number,
    thread_one: string
    thread_two: string
    name_on: string | null
    productId: string,
    orderId: string
}

export type OrdersWithItems = {
    order: Order,
    orderItems: orderItems[]
}