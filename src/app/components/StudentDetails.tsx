// StudentDetails.tsx
import React from 'react'

interface StudentDetailsProps {
  data: {
    name: string,
    studentid: string,
    uniqueid: string,
    batch: string,
    session: string,
    department: string,
    admissionroll: string,
    admissionmerit: string,
    hall: string,
    email: string,
    phonenumber: string,
    bloodgroup: string,
    linkedin: string
  }
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ data }) => {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 gap-4 text-lg">
        <p><span className="font-bold text-gray-700">Name:</span> {data.name}</p>
        <p><span className="font-bold text-gray-700">Student ID:</span> {data.studentid}</p>
        <p><span className="font-bold text-gray-700">Unique ID:</span> {data.uniqueid}</p>
        <p><span className="font-bold text-gray-700">Batch:</span> {data.batch}</p>
        <p><span className="font-bold text-gray-700">Session:</span> {data.session}</p>
        <p><span className="font-bold text-gray-700">Department:</span> {data.department}</p>
        <p><span className="font-bold text-gray-700">Admission Roll:</span> {data.admissionroll}</p>
        <p><span className="font-bold text-gray-700">Admission Merit:</span> {data.admissionmerit}</p>
        <p><span className="font-bold text-gray-700">Hall:</span> {data.hall}</p>
        <p><span className="font-bold text-gray-700">Email:</span> {data.email ? <a href={`mailto:${data.email}`} className="text-blue-500">{data.email}</a> : "Not Added Yet"}</p>
        <p><span className="font-bold text-gray-700">Phone Number:</span> {data.phonenumber}</p>
        <p><span className="font-bold text-gray-700">Blood Group:</span> {data.bloodgroup}</p>
        <p><span className="font-bold text-gray-700">LinkedIn:</span> {data.linkedin ? <a href={data.linkedin} className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a> : "Not Added Yet"}</p>
      </div>
    </div>
  )
}

export default StudentDetails
