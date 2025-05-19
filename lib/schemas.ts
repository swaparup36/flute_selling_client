import { z } from 'zod';

export const signupSchema = z.object({
    fullname: z
        .string()
        .min(3, 'Full name must be at least 3 characters')
        .max(50, 'Full name must be less than 50 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    email: z
        .string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters'),
    otp: z
        .string()
        .length(6, 'OTP must be exactly 6 characters')
        .regex(/^\d+$/, 'OTP must be a number')
});

export const signinSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters'),
    email: z
        .string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters')
});

export const forgotPassSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters'),
    email: z
        .string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters')
});

export const ContactFormSchema = z.object({
    name: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters'),
    email: z
        .string()
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters'),
    message: z
        .string()
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters')
});

export const shippingDetailsSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    email: z
        .string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters'),
    address: z
        .string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address must be less than 200 characters'),
    city: z
        .string()
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must be less than 50 characters'),
    state: z
        .string()
        .min(2, 'State must be at least 2 characters')
        .max(50, 'State must be less than 50 characters'),
    pincode: z
        .number({
            required_error: "Pincode is required",
            invalid_type_error: "Pincode must be a number"
        })
        .min(100000, 'Invalid pincode')
        .max(999999, 'Invalid pincode')
        .nullable(),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    paymentMethod: z
        .enum(['online', 'cod'], {
          required_error: "Please select a payment method",
          invalid_type_error: "Invalid payment method"
        })
});