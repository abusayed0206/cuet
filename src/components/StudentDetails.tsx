interface StudentData {
  [key: string]: any;
}

interface StudentDetailsProps {
  data: StudentData;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ data }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Student Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-2">
            <span className="font-medium">{key}: </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentDetails
