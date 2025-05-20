"use client";


import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as dotenv from "dotenv";
import axios from 'axios';
import Link from 'next/link';
import { forgotPassSchema, signinSchema } from '@/lib/schemas';

dotenv.config({});

interface ForgotPassFormData {
    email: string;
    password: string;
    otp?: string;
}

const ForgotPassword = () => {
    const [formData, setFormData] = useState<ForgotPassFormData>({
        email: '',
        password: '',
        otp: ''
    });
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState('');
    const [formValidationErrors, setFormValidationErrors] =useState<Record<string, string> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value
        }));
    }

    const handleSendOtp = async () => {
        setError('');
        setFormValidationErrors(null);
        setIsLoading(true);
    
        const emailValidation = forgotPassSchema.shape.email.safeParse(formData.email);
        if (!emailValidation.success) {
          setFormValidationErrors({
            email: emailValidation.error.errors[0].message
          });
          setIsLoading(false);
          return;
        }
    
        try {
          const response = await axios.post('/api/auth/sendotp', {
            email: formData.email,
            type: 'forgot-password'
          });
    
          if (!response.data.success) {
            setError(response.data.message);
            return console.log(response.data.message);
          }
    
          setOtp(response.data.otp);
        } catch (err) {
          setError('An error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFormValidationErrors(null);
        setIsLoading(true);

        const validationResult = forgotPassSchema.safeParse(formData);
        if(!validationResult.success) {
            const fieldErrors = validationResult.error.flatten().fieldErrors;
            setFormValidationErrors(
                Object.fromEntries(
                    Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] || "Invalid field"])
                )
            );
            setIsLoading(false);
            return console.log("zod error");
        }

        if (otp && formData.otp !== otp) {
            setFormValidationErrors({ otp: 'Invalid OTP' });
            setIsLoading(false);
            return;
        }

        try {
        const response = await axios.post('/api/auth/change-password', {
            email: formData.email,
            password: formData.password
        });

        if (!response.data.success) {
            setError(response.data.message);
            return;
        }

        router.push('/auth/login');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        const token = localStorage.getItem('usertoken');
        if (token) {
            router.push('/');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
                <div className="rounded-full bg-[#C17777] p-3">
                    <Lock className="h-6 w-6 text-white" />
                </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Change Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Enter your details to change your password
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={onChangeFormData}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#C17777] focus:border-[#C17777]"
                            />
                        </div>
                        {(formValidationErrors && formValidationErrors.email) &&
                            <p>
                                {formValidationErrors.email}
                            </p>
                        }
                    </div>

                    {
                        otp && (
                            <>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        OTP
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            autoComplete="otp"
                                            required
                                            value={formData.otp}
                                            onChange={onChangeFormData}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#C17777] focus:border-[#C17777]"
                                        />
                                    </div>
                                    {(formValidationErrors && formValidationErrors.otp) &&
                                        <p className="my-1 text-red-500">
                                            {formValidationErrors.otp}
                                        </p>
                                    }
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={onChangeFormData}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#C17777] focus:border-[#C17777]"
                                        />
                                    </div>
                                    {(formValidationErrors && formValidationErrors.password) &&
                                        <p className="text-red-500 my-1">
                                            {formValidationErrors.password}
                                        </p>
                                    }
                                </div>
                            </>
                        )
                    }

                    <div>
                    {
                        !otp ? (
                            <button
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C17777] hover:bg-[#a66565] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C17777] disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSendOtp}
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C17777] hover:bg-[#a66565] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C17777] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Changing Password...' : 'Change Password'}
                            </button>
                        )
                    }
                    <div className='flex justify-center items-center mt-3'>
                        <Link href={'/auth/login'} className='text-sm underline cursor-pointer w-full text-center'>Login</Link>
                    </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default ForgotPassword;