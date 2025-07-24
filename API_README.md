# CUET Student Database API

This API provides access to CUET student data with the following simplified database schema:

## Database Schema
- `name`: Student name
- `studentid`: Student ID 
- `department`: Department name
- `admission_roll`: Admission roll number
- `admission_merit`: Admission merit position
- `batch`: Batch number
- `session`: Academic session

## API Endpoints

### 1. Individual Student
- **GET** `/api/student/[studentid]`
- Returns complete student information by student ID
- **Example**: `/api/student/12345`

### 2. Search Students by Name
- **GET** `/api/student/search?name={searchQuery}`
- Search students by name (minimum 2 characters)
- Returns up to 50 results ordered by batch and merit
- **Example**: `/api/student/search?name=john`

### 3. Department and Batch Students
- **GET** `/api/[department]/[batch]`
- Returns all students in a specific department and batch
- **Example**: `/api/cse/18`

## Department Codes
- `ce`: Civil Engineering
- `eee`: Electrical & Electronic Engineering
- `me`: Mechanical Engineering
- `cse`: Computer Science & Engineering
- `urp`: Urban & Regional Planning
- `arch`: Architecture
- `pme`: Petroleum & Mining Engineering
- `ete`: Electronics & Telecommunication Engineering
- `bme`: Biomedical Engineering
- `mie`: Mechatronics & Industrial Engineering
- `wrp`: Water Resources Engineering
- `mse`: Materials Science & Engineering
- `mme`: Materials and Metallurgical Engineering

## Response Format
All endpoints return JSON responses with consistent error handling:

```json
{
  "data": "...",
  "error": "Error message if any"
}
```

## Features
- Edge runtime for better performance
- Proper error handling and logging
- Consistent response format
- Input validation
- Search functionality
- Ordered by admission merit

## Example Responses

### Individual Student (`/api/student/1234567`)
```json
{
  "name": "John Doe",
  "studentid": "1234567",
  "department": "Department of Computer Science & Engineering",
  "admission_roll": "12345",
  "admission_merit": "150",
  "batch": "18",
  "session": "2018-19"
}
```

### Department/Batch Students (`/api/cse/18`)
```json
{
  "department": "Department of Computer Science & Engineering",
  "departmentCode": "CSE",
  "batch": "18",
  "session": "2018-19",
  "totalStudents": 120,
  "students": [
    {
      "name": "John Doe",
      "studentid": "1234567",
      "department": "Department of Computer Science & Engineering",
      "admission_roll": "12345",
      "admission_merit": "150",
      "batch": "18",
      "session": "2018-19"
    }
    // ... more students
  ]
}
```

### Search Results (`/api/student/search?name=john`)
```json
{
  "results": [
    {
      "name": "John Doe",
      "studentid": "1234567",
      "department": "Department of Computer Science & Engineering",
      "admission_roll": "12345",
      "admission_merit": "150",
      "batch": "18",
      "session": "2018-19"
    }
    // ... more results
  ]
}
```
