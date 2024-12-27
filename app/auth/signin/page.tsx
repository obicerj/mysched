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
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 shadow-md rounded-md">
                <h1 className="text-2xl font-bold mb-4">
                    Sign in to Your Account
                </h1>
                <div>
                    {Object.values(providers).map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => signIn(provider.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 block w-full text-center hover:bg-blue-600"
                        >
                            Sign in with {provider.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
