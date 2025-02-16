# **Interactive Articles Platform**

This project is an interactive article platform that allows users to create, edit, and answer multiple-choice questions (MCQs). The application is built with a **frontend (Next.js with TypeScript)** and a **backend (Node.js with TypeScript & Express)**, supporting AI-powered question analysis.

---


<p align="center">
  <a href="https://private-user-images.githubusercontent.com/118787783/413616931-98358b9c-0861-4103-b5d7-7a1659f41e57.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzk3MTE4NTMsIm5iZiI6MTczOTcxMTU1MywicGF0aCI6Ii8xMTg3ODc3ODMvNDEzNjE2OTMxLTk4MzU4YjljLTA4NjEtNDEwMy1iNWQ3LTdhMTY1OWY0MWU1Ny5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMjE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDIxNlQxMzEyMzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04MWJkYzgyYTIzYWU2NzkyMjJhNTRiNDQ0MzI3ZDRmYjFjNzJhMWMxZTgzODQ2MzNkZTYwMGY5MjA0ODRmZGNjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.FmrCob_DpgNK_LTgyDHyBwgOBwx1ARm0_J3KSTZXi2w">
    <img src="https://img.shields.io/badge/🎥 Watch Demo Video-red?style=for-the-badge&logo=video" alt="Watch Demo Video">
  </a>
</p>


## **🚀 How to Run the Project**

### **1️⃣ Install Dependencies**
Before running the project, navigate to the respective directories and install dependencies:

```sh
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

### **2️⃣ Start the Backend Server**
Run the backend server using `npx ts-node`:

```sh
cd backend
npx ts-node src/server
```
- The backend runs on **port 5000**.

### **3️⃣ Start the Frontend Application**
Run the frontend using:

```sh
cd frontend
npm run dev
```
- The frontend runs on **port 3000** (http://localhost:3000).

---

## **✨ Additional Features Implemented**
- **AI-powered question analysis:** Utilizes AI to analyze MCQs and provide insights.
- **MCQ Management System:**
  - Create, edit, and save multiple-choice questions.
  - Store questions in a structured format.
- **Answer Submission & Storage:**
  - Users can attempt quizzes and submit their answers.
  - Previous attempts are saved for review.
- **Seamless frontend-backend communication** using REST API.

---

## **📌 Design Decisions & Tradeoffs**
1. **Tiptap Editor for MCQ Integration:**  
   - The editor was chosen for flexibility in embedding interactive questions.
   - A tradeoff was handling custom question blocks, which required additional extensions.

2. **AI Analysis for MCQs:**  
   - Implemented basic AI analysis for evaluating MCQs.
   - Performance tradeoff: AI processing adds minor latency.

3. **Simplified Backend Storage:**  
   - Currently using a **JSON-based storage or in-memory database** for simplicity.
   - Tradeoff: Not fully scalable yet but easy to extend with a database like MongoDB or PostgreSQL.

---

## **🛠️ Future Improvements**
- Implement a database for persistent storage.
- Enhance AI-based MCQ analysis.
- Improve UI/UX for better question management.

---



