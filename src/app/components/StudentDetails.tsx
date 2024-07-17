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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
        <div>
          <p className="font-bold text-gray-700">Name:</p>
          <p className="font-bold text-gray-700">Student ID:</p>
          <p className="font-bold text-gray-700">Unique ID:</p>
          <p className="font-bold text-gray-700">Batch:</p>
          <p className="font-bold text-gray-700">Session:</p>
          <p className="font-bold text-gray-700">Department:</p>
          <p className="font-bold text-gray-700">Admission Roll:</p>
          <p className="font-bold text-gray-700">Admission Merit:</p>
          <p className="font-bold text-gray-700">Hall:</p>
          <p className="font-bold text-gray-700">Email:</p>
          <p className="font-bold text-gray-700">Phone Number:</p>
          <p className="font-bold text-gray-700">Blood Group:</p>
          <p className="font-bold text-gray-700">LinkedIn:</p>
        </div>
        <div>
          <p>{data.name}</p>
          <p>{data.studentid}</p>
          <p>{data.uniqueid}</p>
          <p>{data.batch}</p>
          <p>{data.session}</p>
          <p>{data.department}</p>
          <p>{data.admissionroll}</p>
          <p>{data.admissionmerit}</p>
          <p>{data.hall}</p>
          <p>{data.email ? <a href={`mailto:${data.email}`} className="text-blue-500">{data.email}</a> : "Not Added Yet"}</p>
          <p>{data.phonenumber}</p>
          <p>{data.bloodgroup}</p>
          <p>{data.linkedin ? <a href={data.linkedin} className="text-blue-500" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a> : "Not Added Yet"}</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDetails
