# CUET Students Directory 📚

Welcome to the **CUET Students Directory** - a comprehensive Next.js application for browsing and searching CUET student information with a modern, responsive interface.

🔍 **Live Demo:** [https://cuet.sayed.app/](https://cuet.sayed.app/)

## 🚀 Features

- **🔍 Student Search**: Search students by name with intelligent filtering
- **📊 Batch Browser**: Browse students by department and batch (12-24)
- **👤 Student Profiles**: Detailed individual student pages with metadata
- **🏛️ Department Listings**: Organized by departments with student counts
- **📱 Responsive Design**: Modern UI with Tailwind CSS
- **⚡ Fast Performance**: Built with Next.js 14 and edge runtime
- **🔗 SEO Optimized**: Complete sitemap with 7k+ student profiles
- **🗃️ Database Integration**: Powered by Supabase

## 🏗️ Tech Stack

- **Framework**: Next.js 14.2.30 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Deployment**: Vercel (edge runtime)
- **Icons**: React Icons
- **Data**: 7,691+ student records

## 🔗 API Endpoints

### Student Information

#### `GET /api/student/[studentid]`

Retrieve detailed student information.

**Example Response:**

```json
{
  "name": "ASHIKUL ISLAM",
  "studentid": "2304001",
  "department": "Department of Computer Science & Engineering",
  "admission_roll": "112120",
  "admission_merit": "232",
  "batch": "23",
  "session": "2023-24"
}
```

#### `GET /api/student/search?query=[name]`

Search students by name.

**Example Response:**

```json
{
  "results": [
    {
      "name": "MD. ASHIKUL ISLAM",
      "studentid": "2304001",
      "department": "Department of Computer Science & Engineering",
      "batch": "23"
    }
  ],
  "total": 1
}
```

### Department & Batch Data

#### `GET /api/[department]/[batch]`

Get all students in a specific department and batch.

**Example Response:**

```json
{
  "department": "Department of Computer Science & Engineering",
  "departmentCode": "CSE",
  "batch": "23",
  "session": "2023-24",
  "totalStudents": 132,
  "students": [
    {
      "name": "ASHIKUL ISLAM",
      "studentid": "2304001",
      "department": "Department of Computer Science & Engineering",
      "admission_roll": "112120",
      "admission_merit": "232",
      "batch": "23",
      "session": "2023-24"
    }
  ]
}
```

**Supported Departments:**

- `cse` - Computer Science & Engineering
- `eee` - Electrical & Electronic Engineering
- `civil` - Civil Engineering
- `me` - Mechanical Engineering
- `arch` - Architecture
- `bme` - Biomedical Engineering
- And more...

## 🚀 Features

- **Student Information:** Access detailed profiles including student ID, name, department, and more.
- **Batch Listings:** Retrieve lists of students for specific departments and batches.

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abusayed0206/cuet.git
   cd cuet
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Run the development server:**

   ```bash
   bun dev
   # or npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The main database table `cuet` contains:

- `studentid` - Unique student identifier
- `name` - Student's full name
- `batch` - Academic batch (e.g., "19", "20", "21")
- `session` - Academic session (e.g., "2019-20")
- `department` - Full department name
- `hall` - Residential hall name
- `public_email` - Contact email
- `dplink` - Profile picture URL
- `currentstatus` - Current status/bio
- `linkedin` - LinkedIn profile URL

## 📜 Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `node generate-sitemap.js` - Generate sitemap from CSV data

## 🤝 Contribution

Your contributions are welcome! Here’s how you can help:

- **Beautify the Code:** Enhance the code's appearance and structure.
- **Maintain the Project:** Contact me at [sayed.page/contact](https://sayed.page/contact) from your academic email, and I'll grant you direct write permissions. Alternatively, you can open a pull request (PR).

When adding new features, please create a new branch and submit a PR. This helps keep the project organized and manageable.

## ⚠️ Disclaimer

The code in this repository might contain errors, typos, or logical issues. As I am not from a CS background and have utilized multiple AI assistants like GitHub Copilot, ClaudeAI, and ChatGPT for coding, please forgive any mistakes and contribute by submitting PRs to help improve the project.

## 📫 Contact

For any queries, reach out at [sayed.page](https://sayed.page).
