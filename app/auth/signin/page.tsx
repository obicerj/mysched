"use client";

import { getProviders, signIn, LiteralUnion } from "next-auth/react";
import { useState, useEffect } from "react";
import type { ClientSafeProvider } from "next-auth/react";

const SignInPage: React.FC = () => {
    const [providers, setProviders] = useState<Record<
        LiteralUnion<string, string>,
        ClientSafeProvider
    > | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };

        fetchProviders();
    }, []);

    if (!providers) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600 animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white px-8 py-12 shadow-lg rounded-2xl max-w-sm w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign in
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    to continue to your mySched account.
                </p>
                <div className="space-y-4">
                    {Object.values(providers).map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="flex items-center justify-center bg-amber-500 text-white px-5 py-3 rounded-full shadow-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 focus:outline-none w-full"
                            aria-label={`Sign in with ${provider.name}`}
                        >
                            <span className="text-lg font-medium">
                                Sign in with {provider.name}
                            </span>
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-6 text-center">
                    By signing in, you agree to our{" "}
                    <a
                        href="/terms"
                        className="text-blue-500 underline hover:text-blue-600"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="/privacy"
                        className="text-blue-500 underline hover:text-blue-600"
                    >
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
