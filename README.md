# MultiLevelExams

A React-based web application for managing and taking multi-stage exams, designed for nursing and clinical education scenarios. The platform supports student and instructor roles, dynamic exam stages, real-time progress tracking, and review of answers after completion.

## Features

- **Multi-stage Exams:** Exams are divided into sequential stages, each with its own set of questions and passing criteria.
- **Question Types:** Supports multiple-choice, true/false, and short-answer questions.
- **Student Progress Tracking:** Tracks each student's progress, scores, and answers for every stage.
- **Review Mode:** After completing a stage, students can review their answers alongside the correct solutions.
- **Instructor Management:** Instructors can create, edit, and publish exams (mocked in demo).
- **Timer:** Each stage has a configurable time limit.
- **Dynamic Access:** Students can only access the next stage after passing the previous one.
- **SPA Routing:** Uses React Router for seamless navigation between exams and stages.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/m0humed/MultiLevelExams.git
    cd MultiLevelExams
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deployment

For deployment on Vercel, add a `vercel.json` file to the project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Project Structure

```
src/
  components/         # Reusable UI components
  context/            # Auth and global context
  data/               # Mock data for exams, users, progress
  pages/              # Main app pages (student, instructor, etc.)
  App.tsx             # Main app entry
  main.tsx            # React root
```

## Customization

- **Add/Edit Questions:** Modify `src/data/mockData.ts` to change exam content.
- **User Roles:** The mock authentication context supports both students and instructors.
- **Styling:** Uses Tailwind CSS for rapid UI development.

## Known Issues

- All data is in-memory (mocked); refreshing the page resets progress.
- No backend/API integration (demo only).
- Direct navigation to routes requires SPA fallback (handled in Vercel config).

## License

MIT

---

**Developed by Esraa and contributors.**
