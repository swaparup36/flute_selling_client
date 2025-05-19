"use client";


import React, { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as dotenv from "dotenv";
import axios from 'axios';
import Link from 'next/link';
import { signinSchema } from '@/lib/schemas';

dotenv.config({});

interface SigninFormData {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<SigninFormData>({
        email: '',
        password: ''
    });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFormValidationErrors(null);
        setIsLoading(true);

        const validationResult = signinSchema.safeParse(formData);
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

        try {
        const response = await axios.post('/api/auth/login', {
            email: formData.email,
            password: formData.password
        });

        if (!response.data.success) {
            setError(response.data.message);
            return;
        }

        const { token } = response.data;
        localStorage.setItem('usertoken', token);
        router.push('/');
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
                User Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Enter your details to sign in to the platform
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
                            <p>
                                {formValidationErrors.password}
                            </p>
                        }
                        <p className='text-sm underline mt-2 cursor-pointer' onClick={() => router.push('/auth/forgot-password')}>forgot password?</p>
                    </div>

                    <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C17777] hover:bg-[#a66565] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C17777] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Signin'}
                    </button>
                    <div className='flex justify-center items-center mt-3'>
                        <Link href={'/auth/signup'} className='text-sm underline cursor-pointer w-full text-center'>Create Account</Link>
                    </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Login;