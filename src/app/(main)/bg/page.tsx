"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons

interface Student {
    name: string;
    studentid: string;
    phonenumber: string;
    lastdonated: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const BloodGroupPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [currentBloodGroup, setCurrentBloodGroup] = useState('B-');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;

    const fetchStudents = async (bloodGroup: string, page: number) => {
        // Encode the blood group to handle special characters
        const encodedBloodGroup = encodeURIComponent(bloodGroup);
        const response = await fetch(`/api/bg/${encodedBloodGroup}?page=${page}`);
        const data = await response.json();

        if (response.ok) {
            setStudents(data.data);
            setTotalCount(data.count);
        } else {
            console.error(data.error);
            setStudents([]);
            setTotalCount(0);
        }
    };

    useEffect(() => {
        fetchStudents(currentBloodGroup, page);
    }, [currentBloodGroup, page]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-white">Blood Group Directory</h1>

            {/* Blood Group Buttons */}
            <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-4">
                {bloodGroups.map((bg) => (
                    <button
                        key={bg}
                        onClick={() => {
                            setCurrentBloodGroup(bg);
                            setPage(1); // Reset to first page
                        }}
                        className={`px-4 py-2 rounded-md text-white ${currentBloodGroup === bg ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {bg}
                    </button>
                ))}
            </div>

            {/* Student List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
                {students.map((student: Student) => (
                    <div
                        key={student.studentid}
                        className="bg-white p-6 rounded-xl shadow-md w-full max-w-xs text-center border border-gray-200 transition-transform transform hover:scale-10 hover:shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            <Link
                                href={`/extended/${student.studentid}`}
                                className="hover:text-blue-500 transition-colors"
                            >
                                {student.name}
                            </Link>
                        </h2>
                        <p className="text-gray-600">ID: {student.studentid}</p>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            Phone:
                            <a
                                href={`tel:${student.phonenumber}`}
                                className="text-blue-500 hover:underline"
                            >
                                {student.phonenumber}
                            </a>
                            <a
                                href={`https://wa.me/${student.phonenumber.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-500 hover:text-green-600"
                                title="Send WhatsApp Message"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                            </a>
                        </p>

                        <p className="text-gray-600">Last Donated: {student.lastdonated}</p>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
                    className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="flex items-center text-white">{`Page ${page} of ${Math.ceil(totalCount / pageSize)}`}</span>
                <button
                    onClick={() => setPage((prev: number) => Math.min(prev + 1, Math.ceil(totalCount / pageSize)))}
                    className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    disabled={page >= Math.ceil(totalCount / pageSize)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BloodGroupPage;
