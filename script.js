function selectRole(role) {
    localStorage.setItem('role', role);
    window.location.href = 'login.html';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const role = localStorage.getItem('role');

    if (!username) {
        alert("Please enter username");
        return;
    }

    localStorage.setItem('username', username);

    if (role === 'teacher') {
        window.location.href = 'teacher.html';
    } else {
        window.location.href = 'student.html';
    }
}

// ================= Teacher Logic =================
function addLesson() {
    const title = document.getElementById('lessonTitle').value.trim();
    const content = document.getElementById('lessonContent').value.trim();
    const quiz = document.getElementById('lessonQuiz').value.trim();
    const correctAnswer = document.getElementById('lessonCorrectAnswer').value.trim();
    const difficulty = parseInt(document.getElementById('lessonDifficulty').value);

    if (!title || !content || !quiz || !correctAnswer) {
        return alert("Please fill all fields (title, content, quiz, correct answer)");
    }

    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    lessons.push({ title, content, quiz, correctAnswer, difficulty, id: Date.now() });
    localStorage.setItem('allLessons', JSON.stringify(lessons));

    // clear fields
    document.getElementById('lessonTitle').value = '';
    document.getElementById('lessonContent').value = '';
    document.getElementById('lessonQuiz').value = '';
    document.getElementById('lessonCorrectAnswer').value = '';
    document.getElementById('lessonDifficulty').value = '1';

    displayTeacherLessons();
}

function displayTeacherLessons() {
    const lessonList = document.getElementById('lessonList');
    if (!lessonList) return;

    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    lessonList.innerHTML = '';
    lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = `${lesson.title} (Q: ${lesson.quiz}, A: ${lesson.correctAnswer})`;
        lessonList.appendChild(li);
    });
}

// Initialize teacher dashboard
if (window.location.pathname.includes('teacher.html')) {
    displayTeacherLessons();
}

// ================= Student Logic =================
function displayStudentLessons() {
    const lessonList = document.getElementById('studentLessonList');
    if (!lessonList) return;

    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    lessonList.innerHTML = '';

    lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = lesson.title;
        li.className = "cursor-pointer text-blue-600 hover:underline";
        li.onclick = () => viewLesson(lesson.id);
        lessonList.appendChild(li);

    });
     updateProgress();
     updateBadge(); 
}

function viewLesson(id) {
    const lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;

    document.getElementById('lessonTitleView').textContent = lesson.title;
    document.getElementById('lessonContentView').textContent = lesson.content;

    if (lesson.quiz) {
        document.getElementById('quizQuestion').textContent = lesson.quiz;
        document.getElementById('quizSection').classList.remove('hidden');
    } else {
        document.getElementById('quizSection').classList.add('hidden');
    }

    // Show notes & bookmarks
    displayNotes(lesson.title);
    displayBookmarks();

    document.getElementById('studentLessonList').parentElement.classList.add('hidden');
    document.getElementById('lessonContentSection').classList.remove('hidden');
}

function backToLessons() {
    document.getElementById('lessonContentSection').classList.add('hidden');
    document.getElementById('studentLessonList').parentElement.classList.remove('hidden');
}

// ================= Adaptive Learning =================
function submitQuiz() {
    const answer = document.getElementById('quizAnswer').value.trim();
    if (!answer) return alert("Please enter an answer");

    const lessonTitle = document.getElementById('lessonTitleView').textContent;
    let performance = JSON.parse(localStorage.getItem('studentPerformance')) || {};

    const score = Math.min(100, answer.length * 10);
    performance[lessonTitle] = score;
    localStorage.setItem('studentPerformance', JSON.stringify(performance));

    // Save to leaderboard
    const username = localStorage.getItem('username') || "Student";
    saveToLeaderboard(username, performance);

    alert(`Answer submitted! Score: ${score}. Next recommended lesson will be highlighted.`);
    document.getElementById('quizAnswer').value = '';
    backToLessons();
    recommendLesson();
    updateProgress();
    updateBadge();
    updateLeaderboard(); 
    updateRecommendation();
}


function recommendLesson() {
    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    let performance = JSON.parse(localStorage.getItem('studentPerformance')) || {};

    let scores = Object.values(performance).map(v => parseInt(v)).filter(v => !isNaN(v));
    let avgScore = scores.length ? scores.reduce((a,b) => a+b, 0)/scores.length : 0;

    let targetDifficulty;
    if (avgScore < 50) targetDifficulty = 1;
    else if (avgScore < 80) targetDifficulty = 2;
    else targetDifficulty = 3;

    const nextLessons = lessons.filter(l => !performance[l.title] && l.difficulty === targetDifficulty);

    const lessonList = document.getElementById('studentLessonList');
    if (!lessonList) return;
    lessonList.innerHTML = '';

    nextLessons.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = lesson.title + " (Recommended)";
        li.className = "cursor-pointer text-green-600 font-bold hover:underline";
        li.onclick = () => viewLesson(lesson.id);
        lessonList.appendChild(li);
    });

    if (nextLessons.length === 0) alert("No more lessons at this difficulty! Check other levels.");
}

function updateRecommendation() {
    let performance = JSON.parse(localStorage.getItem('studentPerformance')) || {};
    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];

    let scores = Object.values(performance).map(v => parseInt(v)).filter(v => !isNaN(v));
    let avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    let message = "";
    let targetDifficulty = 1;

    if (avgScore === 0) {
        message = "Start your first quiz to get recommendations!";
    } else if (avgScore < 50) {
        message = "You might need to review some basics 📘. Here are some easy lessons:";
        targetDifficulty = 1;
    } else if (avgScore < 80) {
        message = "You're doing well 🚀. Try medium-level lessons to improve further:";
        targetDifficulty = 2;
    } else {
        message = "Excellent work 🌟! You're ready for advanced challenges:";
        targetDifficulty = 3;
    }

    document.getElementById("recommendationText").textContent = message;

    const recommendedLessons = lessons.filter(l => !performance[l.title] && l.difficulty === targetDifficulty);
    const recommendedList = document.getElementById("recommendedLessons");
    recommendedList.innerHTML = "";

    if (recommendedLessons.length > 0) {
        recommendedLessons.forEach(lesson => {
            const li = document.createElement("li");
            li.textContent = lesson.title;
            li.className = "cursor-pointer hover:underline";
            li.onclick = () => viewLesson(lesson.id);
            recommendedList.appendChild(li);
        });
    } else if (avgScore > 0) {
        recommendedList.innerHTML = "<li>No new lessons available at this level ✅</li>";
    }
}

// ================= Progress Tracking =================
function updateProgress() {
    let lessons = JSON.parse(localStorage.getItem('allLessons')) || [];
    let performance = JSON.parse(localStorage.getItem('studentPerformance')) || {};

    let completedCount = Object.keys(performance).length;
    let totalLessons = lessons.length;

    let percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    document.getElementById('progressBar').style.width = percent + "%";
    document.getElementById('progressText').textContent =
        `${completedCount} of ${totalLessons} lessons completed (${percent}%)`;
}

// ================= Badge System =================
function updateBadge() {
    let performance = JSON.parse(localStorage.getItem('studentPerformance')) || {};
    let scores = Object.values(performance).map(v => parseInt(v)).filter(v => !isNaN(v));

    let avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    let badgeText = "No badge yet 🐣";

    if (avgScore >= 80) {
        badgeText = "🥇 Master Learner (Avg Score: " + Math.round(avgScore) + "%)";
    } else if (avgScore >= 50) {
        badgeText = "🥈 Intermediate Learner (Avg Score: " + Math.round(avgScore) + "%)";
    } else if (scores.length > 0) {
        badgeText = "🥉 Beginner Learner (Avg Score: " + Math.round(avgScore) + "%)";
    }

    document.getElementById('badgeText').textContent = badgeText;
}

// ================= Leaderboard =================
function saveToLeaderboard(username, performance) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    let scores = Object.values(performance).map(v => parseInt(v)).filter(v => !isNaN(v));
    let avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const existing = leaderboard.find(p => p.username === username);
    if (existing) {
        existing.avgScore = avgScore;
    } else {
        leaderboard.push({ username, avgScore });
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;

    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.sort((a, b) => b.avgScore - a.avgScore);

    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.username} - ${Math.round(entry.avgScore)}%`;
        leaderboardList.appendChild(li);
    });
}

// ================= Notes Feature =================
function saveNote() {
    const noteInput = document.getElementById("noteInput").value.trim();
    const lessonTitle = document.getElementById("lessonTitleView").textContent;
    if (!noteInput) return alert("Please write something in your note!");

    let notes = JSON.parse(localStorage.getItem("notes")) || {};
    if (!notes[lessonTitle]) notes[lessonTitle] = [];
    notes[lessonTitle].push(noteInput);

    localStorage.setItem("notes", JSON.stringify(notes));
    document.getElementById("noteInput").value = "";
    displayNotes(lessonTitle);
}

function displayNotes(lessonTitle) {
    const notesList = document.getElementById("notesList");
    if (!notesList) return;

    let notes = JSON.parse(localStorage.getItem("notes")) || {};
    notesList.innerHTML = "";

    if (notes[lessonTitle]) {
        notes[lessonTitle].forEach(note => {
            const li = document.createElement("li");
            li.textContent = note;
            notesList.appendChild(li);
        });
    }
}

// ================= Bookmark Feature =================
function toggleBookmark() {
    const lessonTitle = document.getElementById("lessonTitleView").textContent;
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarks.includes(lessonTitle)) {
        bookmarks = bookmarks.filter(b => b !== lessonTitle);
    } else {
        bookmarks.push(lessonTitle);
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function displayBookmarks() {
    const bookmarksList = document.getElementById("bookmarksList");
    if (!bookmarksList) return;

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarksList.innerHTML = "";

    bookmarks.forEach(title => {
        const li = document.createElement("li");
        li.textContent = title;
        li.className = "cursor-pointer text-blue-600 hover:underline";
        li.onclick = () => {
            const lessons = JSON.parse(localStorage.getItem("allLessons")) || [];
            const lesson = lessons.find(l => l.title === title);
            if (lesson) viewLesson(lesson.id);
        };
        bookmarksList.appendChild(li);
    });
}

// ================= Discussion Forum with Replies =================
function postDiscussion() {
    const input = document.getElementById("discussionInput").value.trim();
    const lessonTitle = document.getElementById("lessonTitleView").textContent;
    const username = localStorage.getItem("username") || "Anonymous";

    if (!input) return alert("Please type something before posting.");

    let discussions = JSON.parse(localStorage.getItem("discussions")) || {};
    if (!discussions[lessonTitle]) discussions[lessonTitle] = [];

    discussions[lessonTitle].push({
        user: username,
        text: input,
        timestamp: new Date().toLocaleString(),
        replies: []
    });

    localStorage.setItem("discussions", JSON.stringify(discussions));

    document.getElementById("discussionInput").value = "";
    loadDiscussions(lessonTitle); // ✅ refresh immediately
}

function postReply(lessonTitle, index) {
    const replyInput = document.getElementById(`replyInput-${index}`);
    const replyText = replyInput.value.trim();
    const username = localStorage.getItem("username") || "Anonymous";

    if (!replyText) return alert("Please type something before replying.");

    // Load stored discussions
    let discussions = JSON.parse(localStorage.getItem("discussions")) || {};
    if (!discussions[lessonTitle]) discussions[lessonTitle] = [];

    // Make sure the discussion exists
    if (!discussions[lessonTitle][index]) {
        return alert("Discussion not found!");
    }

    // Push the reply
    discussions[lessonTitle][index].replies.push({
        user: username,
        text: replyText,
        timestamp: new Date().toLocaleString()
    });

    // Save back
    localStorage.setItem("discussions", JSON.stringify(discussions));

    // Clear input
    replyInput.value = "";

    // Reload updated discussions
    loadDiscussions(lessonTitle);
}


function loadDiscussions(lessonTitle) {
    const discussionList = document.getElementById("discussionList");
    if (!discussionList) return;

    let discussions = JSON.parse(localStorage.getItem("discussions")) || {};
    let lessonDiscussions = discussions[lessonTitle] || [];

    discussionList.innerHTML = "";
    lessonDiscussions.forEach((d, index) => {
        const li = document.createElement("li");
        li.classList.add("mb-4");

        li.innerHTML = `
            <div class="p-2 bg-white border rounded shadow-sm mb-2">
                <strong>${d.user}</strong>: ${d.text} 
                <br><span class="text-xs text-gray-500">${d.timestamp}</span>
            </div>

            <!-- Replies -->
            <ul id="replyList-${index}" class="ml-6 mb-2">
                ${d.replies.map(r => `
                    <li class="p-2 bg-gray-50 border rounded mb-1">
                        <strong>${r.user}</strong>: ${r.text}
                        <br><span class="text-xs text-gray-500">${r.timestamp}</span>
                    </li>
                `).join("")}
            </ul>

            <!-- Reply Box -->
            <textarea id="replyInput-${index}" class="w-full border p-2 rounded mb-2" rows="1" placeholder="Write a reply..."></textarea>
            <button onclick="postReply('${lessonTitle}', ${index})" class="bg-indigo-500 text-white px-3 py-1 rounded">Reply</button>
        `;

        discussionList.appendChild(li);
    });
}

// ================= Hook into lesson view =================
const originalViewLesson = viewLesson;
viewLesson = function(id) {
    originalViewLesson(id);
    const lessonTitle = document.getElementById("lessonTitleView").textContent;
    loadDiscussions(lessonTitle); // ✅ loads discussions when lesson opens
};


// ================= Init =================
if (window.location.pathname.includes('student.html')) {
    displayStudentLessons();
    updateProgress();
    updateLeaderboard();
    updateRecommendation();
    displayBookmarks();
}
