"use client";
import React, { useState } from "react";
import BatchwiseDepartment from "@/components/HallwiseStudents";
import HallwiseStudents from "@/components/HallwiseStudents";

interface Student {
    studentid: string;
    name: string;
    dplink: string;
    batch: string;
    department: string;
}

interface HallData {
    hall: string;
    totalStudents: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    studentList: Student[];
}

const hallMap: { [key: string]: string } = {
    bbh: "Bangabandhu Hall",
    smsh: "Shaheed Mohammad Shah Hall",
    sthh: "Shaheed Tareq Huda Hall",
    qkh: "Dr. Qudrat-E-Khuda Hall",
    ash: "Abu Sayed Hall",
    skh: "Sufia Kamal Hall",
    snkh: "Shamsunnahar Khan Hall",
    trh: "Tapashi Rabeya Hall",
};

const BatchPage: React.FC = () => {
    const [selectedHall, setSelectedHall] = useState<string>("smsh");
    const [hallData, setHallData] = useState<HallData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchStudents = async (hallShortForm: string, page: number) => {
        setLoading(true);
        const selectedHallFull = hallMap[hallShortForm] || "";

        try {
            const response = await fetch(`/api/hall/${hallShortForm}?page=${page}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error fetching students");
            }

            setHallData({
                ...data,
                hall: selectedHallFull, // Map the hall full name here
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setHallData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setCurrentPage(1);
        fetchStudents(selectedHall, 1);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-white">
                Hall Wise Student Directory
            </h1>

            <div className="flex flex-wrap justify-center space-x-4 mb-4">
                <select
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                    className="border rounded-md text-black p-2"
                >
                    {Object.entries(hallMap).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>

            {loading ? (
                <div className="text-center text-white">Loading...</div>
            ) : hallData ? (
                <>
                    <HallwiseStudents
                        hallName={hallData.hall}
                        students={hallData.totalStudents}
                        studentList={hallData.studentList}
                    />
                    <div className="flex text-white justify-center mt-6">
                        <button
                            onClick={() => fetchStudents(selectedHall, currentPage - 1)}
                            className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-white">
                            {`Page ${hallData.currentPage} of ${hallData.totalPages}`}
                        </span>
                        <button
                            onClick={() => fetchStudents(selectedHall, currentPage + 1)}
                            className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                            disabled={currentPage >= hallData.totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center text-white">
                    Select a hall, then click Submit to see the student list.
                </div>
            )}
        </div>
    );
};

export default BatchPage;
