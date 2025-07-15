/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NameSearch from "@/components/NameSearch";

interface Student {
    name: string;
    studentid: string;
    department: string;
    batch: string;
    dplink: string;
}

// Separate component to use useSearchParams within Suspense
const SearchComponent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const nameQuery = searchParams.get("name") || ""; // Get the "name" query from URL
    const [inputValue, setInputValue] = useState<string>(nameQuery); // Use nameQuery to prefill input if present
    const [results, setResults] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch search results when the page loads or when the name query changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!nameQuery) return; // If there's no name query, do nothing

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/student/search?name=${nameQuery}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [nameQuery]);

    // Handle form submission and update the query parameter in the URL
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            router.push(`/search?name=${inputValue.trim()}`); // Update URL with the new name query
        }
    };

    return (
        <>
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="flex justify-center mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter student name"
                    className="border border-gray-300 rounded-md p-2 text-black w-64 mr-4"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Search
                </button>
            </form>

            {loading && <div className="text-center text-white">Loading...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {!loading && !error && results.length > 0 ? (
                <NameSearch results={results} />
            ) : !loading && !error && results.length === 0 && nameQuery ? (
                <div className="text-center text-white">No results found for "{nameQuery}".</div>
            ) : null}
        </>
    );
};

const SearchPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">Search for Students by Name</h1>

            <Suspense fallback={<div className="text-center text-white">Loading search data...</div>}>
                <SearchComponent />
            </Suspense>
        </div>
    );
};

export default SearchPage;
