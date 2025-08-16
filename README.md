# Adaptive-AI-learning
Adaptive AI Learning Platform

Description:
Adaptive AI Learning is a web-based platform that allows teachers to create lessons with quizzes and students to access personalized learning experiences. The platform tracks progress, awards badges, provides recommendations, supports notes and bookmarks, and includes a discussion forum for each lesson.

Features
1. Role-Based Access

Users choose between Teacher or Student roles.

Teachers can add lessons, quizzes, and correct answers.

Students can view lessons, attempt quizzes, and track their learning.

2. Teacher Dashboard

Add new lessons with:

Title

Content

Quiz question & correct answer

Difficulty (Easy, Medium, Hard)

View all lessons in a list.

Modern UI with cards, shadows, rounded corners, and interactive buttons.

3. Student Dashboard

View Available Lessons with icons and hover effects.

Click a lesson to view its content, quiz, and discussion forum.

Quiz section allows students to submit answers and get scored.

Adaptive recommendations based on quiz performance:

Suggests lessons at the difficulty level suitable for the student.

Track learning progress with a progress bar.

Badges based on performance:

Beginner, Intermediate, Master Learner.

Notes: Students can write and save notes for each lesson.

Bookmarks: Students can save lessons for quick access.

Discussion Forum: Post questions and replies under each lesson.

Leaderboard: Displays top-performing students.

4. Interactive UI

Gradient background for dashboards.

Section-specific cards with colors and icons.

Buttons and inputs with hover/focus effects.

Responsive design for desktops and mobile.

Technologies Used

HTML5, CSS3, JavaScript

Tailwind CSS for styling

LocalStorage for persistent data storage (lessons, performance, notes, bookmarks, discussions)

How It Works

Select Role: User chooses Teacher or Student.

Login: Enter a username to continue.

Teacher Actions:

Add lessons, quizzes, and answers.

View all lessons.

Student Actions:

Browse available lessons.

Click a lesson to view content and take quizzes.

Track progress, earn badges, and view recommended lessons.

Write notes and toggle bookmarks.

Participate in discussion forum with posts and replies.

Leaderboard shows top students.

Project Structure
adaptive-ai-learning/
│
├─ index.html          # Role selection page
├─ login.html          # Login page
├─ teacher.html        # Teacher dashboard
├─ student.html        # Student dashboard
├─ script.js           # JavaScript logic
└─ README.md           # Project documentation

How to Run

Clone the repository:

git clone https://github.com/<your-username>/adaptive-ai-learning.git


Open index.html in a web browser.

Select role, login, and start using the platform.

Future Enhancements

Move data storage from LocalStorage to a database (e.g., Firebase or MySQL).

Implement authentication and multi-user login.

Add file uploads for lesson content (images, videos).

Enhance discussion forum with threaded replies and notifications.

Implement AI-based recommendations for personalized learning paths.
