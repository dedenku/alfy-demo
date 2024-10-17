const questions = [
    {
        question: "Manakah yang termasuk isim (kata benda) dalam bahasa Arab?",
        options: ["كِتَابٌ (kitaabun)", "يَكْتُبُ (yaktubu)"],
        answer: 0
    },
    {
        question: "Identifikasi fi'il (kata kerja) dalam kalimat berikut: ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ",
        options: ["ذَهَبَ (dzahaba)", "الطَّالِبُ (ath-thaalibu)"],
        answer: 0
    },
    {
        question: "Manakah yang merupakan harf (huruf) dalam bahasa Arab?",
        options: ["فِي (fii)", "قَلَمٌ (qalamun)"],
        answer: 0
    },
    {
        question: "Tentukan jenis kata dari: مُحَمَّدٌ",
        options: ["Isim", "Fi'il"],
        answer: 0
    },
    {
        question: "Manakah yang bukan termasuk tanda isim?",
        options: ["Tanwin", "Huruf Jar", "Tashrif"],
        answer: 2
    },
    {
        question: "Identifikasi isim dalam kalimat: الْعِلْمُ نُورٌ",
        options: ["الْعِلْمُ (al-'ilmu)", "نُورٌ (nuurun)", "Keduanya"],
        answer: 2
    },
    {
        question: "Manakah yang merupakan fi'il mudhari' (kata kerja present tense)?",
        options: ["كَتَبَ (kataba)", "يَكْتُبُ (yaktubu)"],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let wrongQuestions = [];

function loadQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const question = questions[currentQuestionIndex];
    
    let questionHTML = `
        <div class="question">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <button onclick="checkAnswer(${index})">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    quizContainer.innerHTML = questionHTML;
    updateProgressBar();
}

function updateLives() {
    document.getElementById('lives').textContent = '❤️'.repeat(lives);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.options button');
    
    buttons.forEach(button => button.disabled = true);
    
    if (selectedIndex === question.answer) {
        score++;
        buttons[selectedIndex].classList.add('correct');
        document.getElementById('result').textContent = 'Benar!';
        if (wrongQuestions.includes(currentQuestionIndex)) {
            wrongQuestions = wrongQuestions.filter(q => q !== currentQuestionIndex);
        }
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.answer].classList.add('correct');
        document.getElementById('result').textContent = 'Salah. Jawaban yang benar adalah: ' + question.options[question.answer];
        lives--;
        updateLives();
        if (!wrongQuestions.includes(currentQuestionIndex)) {
            wrongQuestions.push(currentQuestionIndex);
        }
    }
    
    if (lives === 0) {
        endQuiz();
    } else {
        setTimeout(nextQuestion, 2000);
    }
}

function nextQuestion() {
    if (wrongQuestions.length > 0) {
        currentQuestionIndex = wrongQuestions[0];
    } else {
        currentQuestionIndex++;
    }

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// Fungsi untuk memutar efek suara
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reset audio ke awal
    sound.play();
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.options button');
    
    buttons.forEach(button => button.disabled = true);
    
    if (selectedIndex === question.answer) {
        score++;
        buttons[selectedIndex].classList.add('correct');
        document.getElementById('result').textContent = 'Benar!';
        playSound('correct-sound'); // Putar suara jawaban benar
        if (wrongQuestions.includes(currentQuestionIndex)) {
            wrongQuestions = wrongQuestions.filter(q => q !== currentQuestionIndex);
        }
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.answer].classList.add('correct');
        document.getElementById('result').textContent = 'Salah. Jawaban yang benar adalah: ' + question.options[question.answer];
        playSound('incorrect-sound'); // Putar suara jawaban salah
        lives--;
        updateLives();
        if (!wrongQuestions.includes(currentQuestionIndex)) {
            wrongQuestions.push(currentQuestionIndex);
        }
    }
    
    if (lives === 0) {
        endQuiz();
    } else {
        setTimeout(nextQuestion, 2000);
    }
}

function endQuiz() {
    document.getElementById('quiz-container').innerHTML = `
        <h2>Kuis Selesai!</h2>
        <p>Skor Anda: ${score} dari ${questions.length}</p>
    `;
    document.getElementById('result').textContent = '';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('lives').style.display = 'none';
    document.getElementById('exit-button').style.display = 'none';
    playSound('complete-sound'); // Putar suara pembelajaran selesai
}

// Exit functionality
const exitButton = document.getElementById('exit-button');
const exitModal = document.getElementById('exit-modal');
const cancelExit = document.getElementById('cancel-exit');
const confirmExit = document.getElementById('confirm-exit');

exitButton.addEventListener('click', () => {
    exitModal.style.display = 'block';
});

cancelExit.addEventListener('click', () => {
    exitModal.style.display = 'none';
});

confirmExit.addEventListener('click', () => {
    exitModal.style.display = 'none';
    endQuiz();
});

window.addEventListener('click', (event) => {
    if (event.target === exitModal) {
        exitModal.style.display = 'none';
    }
});

loadQuestion();
updateLives();