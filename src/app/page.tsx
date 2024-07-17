'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaPhoneAlt, FaTint } from 'react-icons/fa'

interface StudentData {
  name: string
  studentid: string
  uniqueid: string
  batch: string
  session: string
  department: string
  admissionroll: string
  admissionmerit: string
  hall: string
  email: string
  phonenumber: string
  bloodgroup: string
  linkedin: string
}

export default function Home() {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setStudentData(null)
    try {
      const response = await fetch(`/api/student/${studentId}`)
      if (!response.ok) {
        throw new Error('Student not found')
      }
      const data = await response.json()
      setStudentData(data)
    } catch (err) {
      setError('Failed to fetch student data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Student Information</h1>
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative">
                <input 
                  id="studentId" 
                  name="studentId" 
                  type="text" 
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600" 
                  placeholder="Student ID" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <label htmlFor="studentId" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Student ID</label>
              </div>
              <button className="mt-8 w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300">
                Search
              </button>
            </form>
            {isLoading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {studentData && (
              <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">{studentData.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Student ID" value={studentData.studentid} />
                  <InfoItem label="Unique ID" value={studentData.uniqueid} />
                  <InfoItem label="Batch" value={studentData.batch} />
                  <InfoItem label="Session" value={studentData.session} />
                  <InfoItem label="Department" value={studentData.department} />
                  <InfoItem label="Admission Roll" value={studentData.admissionroll} />
                  <InfoItem label="Admission Merit" value={studentData.admissionmerit} />
                  <InfoItem label="Hall" value={studentData.hall} />
                  <InfoItem
                    label="Email"
                    value={studentData.email}
                    icon={<FaEnvelope className="text-gray-600" />}
                    link={`mailto:${studentData.email}`}
                  />
                  <InfoItem
                    label="Phone"
                    value={studentData.phonenumber}
                    icon={<FaPhoneAlt className="text-gray-600" />}
                    link={`tel:${studentData.phonenumber}`}
                  />
                  <InfoItem
                    label="Blood Group"
                    value={studentData.bloodgroup}
                    icon={<FaTint className="text-red-500" />}
                  />
                  <InfoItem
                    label="LinkedIn"
                    value="Profile"
                    icon={<FaLinkedin className="text-gray-600" />}
                    link={studentData.linkedin}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  icon?: React.ReactNode
  link?: string
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon, link }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span className="font-medium">{label}:</span>
    {link ? (
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {value}
      </a>
    ) : (
      <span>{value}</span>
    )}
  </div>
)
