"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/utils/useUser";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUser(); // Use the custom hook to get user status

    const closeMenu = () => setIsOpen(false);

    return (
        <div className="w-full px-4 py-6">
            <nav className="max-w-6xl mx-auto backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative p-1 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 hover:from-violet-500/20 hover:to-cyan-500/20 transition-all duration-300">
                            <Image
                                src="/CUET_Vector_ogo.svg"
                                alt="CUET Logo"
                                width={28}
                                height={28}
                                className="transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink href="/extended">Extended Info</NavLink>
                        <NavLink href={user ? "/profile" : "/login"}>
                            {user ? "Profile" : "Login"}
                        </NavLink>
                        <NavLink href="/bg">Blood Group</NavLink>
                        <NavLink href="/privacy">Privacy Policy</NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-md">
                    <div className="absolute inset-0" onClick={closeMenu}></div>

                    <div className="relative z-10 w-11/12 max-w-sm p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <button
                            onClick={closeMenu}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col space-y-4">
                            <MobileNavLink href="/extended" onClick={closeMenu}>Extended Info</MobileNavLink>
                            <MobileNavLink href={user ? "/profile" : "/login"} onClick={closeMenu}>
                                {user ? "Profile" : "Login"}
                            </MobileNavLink>
                            <MobileNavLink href="/bg" onClick={closeMenu}>Blood Group</MobileNavLink>
                            <MobileNavLink href="/privacy" onClick={closeMenu}>Privacy Policy</MobileNavLink>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Desktop NavLink Component
const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <Link
        href={href}
        className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
    >
        {children}
    </Link>
);

// Mobile NavLink Component
const MobileNavLink: React.FC<{ href: string; onClick?: () => void; children: React.ReactNode }> = ({
    href,
    onClick,
    children,
}) => (
    <Link
        href={href}
        onClick={onClick}
        className="block px-4 py-3 text-center text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
    >
        {children}
    </Link>
);

export default Navbar;
