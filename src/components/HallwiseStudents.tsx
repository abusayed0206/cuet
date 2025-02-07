import React from "react";
import Link from "next/link";

interface Student {
    studentid: string;
    name: string;
    dplink: string;
    batch: string;
    department: string;
}

interface HallwiseStudentsProps {
    hallName: string;
    students: number;
    studentList: Student[];
}

const HallwiseStudents: React.FC<HallwiseStudentsProps> = ({
    hallName,
    students,
    studentList,
}) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://cdn.abusayed.dev/demo.png";
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-2 text-black">{hallName}</h1>
                <p className="text-lg mb-4 text-black">Total Students: {students}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mx-auto max-w-7xl">
                    {studentList.map((student) => (
                        <div
                            key={student.studentid}
                            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                <img
                                    src={student.dplink}
                                    alt={student.name}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="text-center">
                                <Link href={`/${student.studentid}`} className="text-xl font-semibold text-blue-600 hover:underline">
                                    {student.studentid}
                                </Link>
                                <Link href={`/${student.studentid}`} className="text-lg font-semibold text-black">
                                    <p className="text-lg text-black">{student.name}</p>
                                </Link>
                                <p className="text-sm text-gray-600">{student.batch} Batch</p>
                                <p className="text-sm text-gray-600">{student.department}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HallwiseStudents;
