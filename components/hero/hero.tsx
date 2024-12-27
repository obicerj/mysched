import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

export function Hero() {
    return (
        <div>
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
            <section className="flex items-center justify-center min-h-screen bg-white text-lime-600 text-center px-6">
                <div>
                    <div className="w-full h-96 relative">
                        <Image
                            src="/storyset.png"
                            alt="Hero Image"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6 text-gray-800">
                        Manage Your Schedule with{" "}
                        <span className="sm:text-5xl font-extrabold font-caveat -rotate-3 inline-block text-gray-900 bg-lime-300 px-3 py-1 rounded-lg">
                            mySched
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl mb-6 text-lime-600">
                        Stay organized with a simple, intuitive scheduling tool.
                    </p>

                    <button
                        onClick={() => signIn()}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
}
