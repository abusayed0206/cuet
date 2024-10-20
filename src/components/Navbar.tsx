"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
    // State to toggle mobile menu
    const [isOpen, setIsOpen] = useState(false);

    // Function to close the menu
    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or Branding */}
                <div className="text-white text-lg font-semibold">

                    <Link href="/" className="text-white hover:text-white">
                        <Image src="/CUET_Vector_ogo.svg" alt="CUET Logo" width={32} height={32} />
                    </Link>
                </div>

                {/* Hamburger button for mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white md:hidden focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white">
                        Home
                    </Link>
                    <Link href="/extended" className="text-gray-300 hover:text-white">
                        Extended Info
                    </Link>
                    <Link href="/profile" className="text-gray-300 hover:text-white">
                        Profile
                    </Link>
                    <Link href="/bg" className="text-gray-300 hover:text-white">
                        Blood Group
                    </Link>
                    <Link href="/privacy" className="text-gray-300 hover:text-white">
                        Privacy Policy
                    </Link>
                </div>
            </div>

            {/* Full-screen Mobile Menu Popup */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90">
                    {/* Close the menu when clicking on the backdrop */}
                    <div className="absolute inset-0" onClick={closeMenu}></div>

                    <div className="relative z-10 p-8 bg-gray-700 rounded-lg shadow-lg">
                        <button
                            onClick={closeMenu}
                            className="absolute top-2 right-2 text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <div className="flex flex-col space-y-6 items-center">
                            <Link href="/" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                Home
                            </Link>
                            <Link href="/extended" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                Extended Info
                            </Link>
                            <Link href="/profile" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                Profile
                            </Link>
                            <Link href="/bg" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                Blood Group
                            </Link>
                            <Link href="/privacy" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                Privacy Policy
                            </Link>
                            <Link href="https://github.com/abusayed0206/cuet" className="text-gray-300 hover:text-white text-lg" onClick={closeMenu}>
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
