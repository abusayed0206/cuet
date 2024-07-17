'use client'
import { useState } from 'react'
import StudentDetails from './components/StudentDetails'

export default function Home() {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState(null)
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
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Student Information</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input 
                    id="studentId" 
                    name="studentId" 
                    type="text" 
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" 
                    placeholder="Student ID" 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  <label htmlFor="studentId" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Student ID</label>
                </div>
                <div className="relative">
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md px-4 py-2 hover:from-pink-500 hover:to-yellow-500 transition-all">Submit</button>
                </div>
              </form>
            </div>
            {isLoading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {studentData && <StudentDetails data={studentData} />}
          </div>
        </div>
      </div>
    </div>
  )
}
