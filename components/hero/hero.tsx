import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

export function Hero() {
    return (
        <div data-testid="hero-component">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-lime-600 text-center px-6">
                <div>
                    <div className="w-full h-96 relative">
                        <Image
                            src="/storyset.png"
                            alt="Hero Image"
                            fill
                            style={{ objectFit: "contain" }}

                            // layout="fill"
                            // objectFit="contain"
                        />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6 text-gray-800">
                        Manage Your Schedule with{" "}
                        <span className="sm:text-5xl font-extrabold font-caveat -rotate-3 inline-block text-amber-500 px-3 py-2 rounded-lg bg-white shadow-lg">
                            mySched
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl mb-6 text-gray-600">
                        Stay organized with a simple, intuitive scheduling tool.
                    </p>

                    <button
                        onClick={() => signIn()}
                        data-testid="login-button"
                        // className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
                        className="bg-amber-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 focus:outline-none text-lg font-semibold"
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
}
