# CUET Student Information 📚

Welcome to the **CUET Student Information** repository! This project provides a comprehensive API for accessing basic information about CUET students.

🔍 **Note:** If you are looking for the profile editing repository, visit [CUET Profile Editing](https://github.com/abusayed0206/cuet).

## API Documentation 📜

**Base URL:** [https://cuet.sayed.page/](https://cuet.sayed.page/)

### Endpoints

#### 1. `/api/student/[studentid]` 🧑‍🎓

Retrieve basic details about a student.

**Example Response:**
```json
{
  "name": "লূৎফুর রশিদ সাঈদ",
  "studentid": "1901049",
  "batch": "19",
  "session": "2019-20",
  "department": "Department of Civil Engineering",
  "hall": "Shaheed Mohammad Shah Hall",
  "public_email": "hello@sayed.page",
  "dplink": "https://cdn.abusayed.dev/sayed.webp",
  "currentstatus": "A Loser | A Failure",
  "linkedin": "https://sayed.page/linkedin"
}
```

#### 2. `/api/department/[departmentcode]` 🏛️

Get the total number of students by batch for each department.

**Example Response:**
```json
{
  "name": "Department of Civil Engineering",
  "batchwiseStudents": {
    "17": 130,
    "18": 131,
    "19": 132,
    "20": 132,
    "21": 132,
    "22": 132
  }
}
```

#### 3. `/api/department/[departmentcode]/[batch]` 📅

List students in a specific department and batch.

**Example Response:**
```json
{
  "name": "Department of Materials Science & Engineering",
  "batch": "19",
  "students": 30,
  "studentList": [
    {
      "studentid": "1912001",
      "name": "SADIK SALEH",
      "dplink": "https://cdn.abusayed.dev/1912001.webp"
    },
    {
      "studentid": "1912002",
      "name": "TUFAYEL AHMED",
      "dplink": "https://cdn.abusayed.dev/1912002.webp"
    }
  ]
}
```

## 🚀 Features

- **Student Information:** Access detailed profiles including student ID, name, department, and more.
- **Department Statistics:** Get total student counts by batch for each department.
- **Batch Listings:** Retrieve lists of students for specific departments and batches.

## 🤝 Contribution

Your contributions are welcome! Here’s how you can help:

- **Beautify the Code:** Enhance the code's appearance and structure.
- **Maintain the Project:** Contact me at [sayed.page/contact](https://sayed.page/contact) from your academic email, and I'll grant you direct write permissions. Alternatively, you can open a pull request (PR).

When adding new features, please create a new branch and submit a PR. This helps keep the project organized and manageable.

## 💖 Support Us

If you appreciate this project and want to support its development, consider making a donation:

- **Donate:** [sayed.page/donate](https://sayed.page/donate)
- **Buy Me a Coffee:** [abusayed](https://www.buymeacoffee.com/abusayed)

## ⚠️ Disclaimer

The code in this repository might contain errors, typos, or logical issues. As I am not from a CS background and have utilized multiple AI assistants like GitHub Copilot, ClaudeAI, and ChatGPT for coding, please forgive any mistakes and contribute by submitting PRs to help improve the project.

## 📫 Contact

For any queries or issues, reach out at [sayed.page/contact](https://sayed.page/contact).