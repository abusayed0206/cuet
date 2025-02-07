"use client";
import React, { useState } from "react";
import BatchwiseDepartment from "@/components/BatchwiseDepartment";

interface Student {
    studentid: string;
    name: string;
    dplink: string;
}

interface DepartmentData {
    name: string;
    batch: string;
    totalStudents: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    studentList: Student[];
}

const departments = [
    { value: "ce", label: "CE" },
    { value: "me", label: "ME" },
    { value: "cse", label: "CSE" },
    { value: "eee", label: "EEE" },
    { value: "ete", label: "ETE" },
    { value: "bme", label: "BME" },
    { value: "arch", label: "ARCH" },
    { value: "pme", label: "PME" },
    { value: "urp", label: "URP" },
    { value: "mse", label: "MSE" },
    { value: "mie", label: "MIE" },
    { value: "wre", label: "WRE" },
    { value: "mme", label: "MME" },
    
];

const batches = [
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
];

const BatchPage: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string>("ce");
    const [selectedBatch, setSelectedBatch] = useState<string>("17");
    const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchStudents = async (department: string, batch: string, page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/department/${department}/${batch}?page=${page}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error fetching students");
            }

            setDepartmentData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setDepartmentData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setCurrentPage(1);
        fetchStudents(selectedDepartment, selectedBatch, 1);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4 text-white">
                Batch Wise Student Directory
            </h1>

            <div className="flex flex-wrap justify-center space-x-4 mb-4">
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border rounded-md text-black p-2"
                >
                    {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                            {dept.label}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="border text-black rounded-md p-2"
                >
                    {batches.map((batch) => (
                        <option key={batch.value} value={batch.value}>
                            {batch.label}
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
            ) : departmentData ? (
                <>
                    <BatchwiseDepartment
                        departmentName={departmentData.name}
                        batch={departmentData.batch}
                        students={departmentData.totalStudents}
                        studentList={departmentData.studentList}
                    />
                    <div className="flex text-white justify-center mt-6">
                        <button
                            onClick={() => fetchStudents(selectedDepartment, selectedBatch, currentPage - 1)}
                            className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center  text-white">
                            {`Page ${departmentData.currentPage} of ${departmentData.totalPages}`}
                        </span>
                        <button
                            onClick={() => fetchStudents(selectedDepartment, selectedBatch, currentPage + 1)}
                            className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                            disabled={currentPage >= departmentData.totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center text-white">
                    Select a department and batch, then click View Batch to see the student list.
                </div>
            )}
        </div>
    );
};

export default BatchPage;
