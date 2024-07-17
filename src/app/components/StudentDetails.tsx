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
    <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
      <p><span className="font-bold">Name:</span> {data.name}</p>
      <p><span className="font-bold">Student ID:</span> {data.studentid}</p>
      <p><span className="font-bold">Unique ID:</span> {data.uniqueid}</p>
      <p><span className="font-bold">Batch:</span> {data.batch}</p>
      <p><span className="font-bold">Session:</span> {data.session}</p>
      <p><span className="font-bold">Department:</span> {data.department}</p>
      <p><span className="font-bold">Admission Roll:</span> {data.admissionroll}</p>
      <p><span className="font-bold">Admission Merit:</span> {data.admissionmerit}</p>
      <p><span className="font-bold">Hall:</span> {data.hall}</p>
      <p><span className="font-bold">Email:</span> {data.email ? <a href={`mailto:${data.email}`} className="text-blue-500">{data.email}</a> : "Not Added Yet"}</p>
      <p><span className="font-bold">Phone Number:</span> {data.phonenumber}</p>
      <p><span className="font-bold">Blood Group:</span> {data.bloodgroup}</p>
      <p><span className="font-bold">LinkedIn:</span> {data.linkedin ? <a href={data.linkedin} className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a> : "Not Added Yet"}</p>
    </div>
  )
}

export default StudentDetails
