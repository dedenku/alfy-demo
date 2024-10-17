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
let remainingQuestions = [...Array(questions.length).keys()];
let wrongQuestions = [];

function loadQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const question = questions[currentQuestionIndex];

    let questionHTML = `
        <div class="question slide-in-right">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <button onclick="checkAnswer(${index})">${option}</button>
                `).join('')}
            </div>
        </div>
    `;

    quizContainer.innerHTML = questionHTML;
    document.getElementById('result').textContent = ''; // Menghapus keterangan jawaban
    updateProgressBar();
}

function updateLives() {
    document.getElementById('lives').textContent = '❤️'.repeat(lives);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = (score / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function checkAnswer(selectedIndex) {
    
    const myTimeout = setTimeout(myGreeting, 1000); //animasi slide-out
    function myGreeting() {
        document.querySelector(".question").classList.add("slide-out-left")
    }
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.options button');

    buttons.forEach(button => button.disabled = true);

    if (selectedIndex === question.answer) {
        score++;
        buttons[selectedIndex].classList.add('correct');
        document.getElementById('result').textContent = 'Benar!';
        playSound('correct-sound');
        wrongQuestions = wrongQuestions.filter(q => q !== currentQuestionIndex);
        updateProgressBar();
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.answer].classList.add('correct');
        document.getElementById('result').textContent = 'Salah. Jawaban yang benar adalah: ' + question.options[question.answer];
        playSound('incorrect-sound');
        lives--;
        updateLives();
        if (!wrongQuestions.includes(currentQuestionIndex)) {
            wrongQuestions.push(currentQuestionIndex);
        }
    }

    if (lives === 0) {
        setTimeout(() => {
            // playSound('fail-sound');
            showFullProgressAndEnd(true);
        }, 2000);
    } else {
        setTimeout(nextQuestion, 2000);
    }
}

function nextQuestion() {
    remainingQuestions = remainingQuestions.filter(q => q !== currentQuestionIndex);

    if (remainingQuestions.length > 0) {
        currentQuestionIndex = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
        loadQuestion();
    } else if (wrongQuestions.length > 0) {
        remainingQuestions = [...wrongQuestions];
        wrongQuestions = [];
        currentQuestionIndex = remainingQuestions.shift();
        loadQuestion();
    } else {
        setTimeout(() => showFullProgressAndEnd(false), 1000);
    }
    const myTimeout = setTimeout(myGreeting, 500);

    function myGreeting() {
        document.querySelector(".question").classList.remove("slide-out-left")
    }

}

function showFullProgressAndEnd(failed) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.transition = 'width 1s ease-in-out';
    progressBar.style.width = '100%';

    setTimeout(() => {
        endQuiz(failed);
    }, 500);
}

function endQuiz(failed) {
    let message = failed ? 'Kuis Berakhir - Nyawa Habis!' : 'Kuis Selesai!';
    let sound = failed ? 'fail-sound' : 'complete-sound';

    document.getElementById('quiz-container').innerHTML = `
        <h2>${message}</h2>
        <p>Skor Anda: ${score} dari ${questions.length}</p>
                        <a href="../index"><button class="cta-button" id="startLearning">Kembali ke Beranda</button></a>
    `;
    document.getElementById('result').textContent = '';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('lives').style.display = 'none';
    document.getElementById('exit-button').style.display = 'none';
    playSound(sound);
}

// Fungsi untuk memutar efek suara
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset audio ke awal
        sound.play();
    }
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
