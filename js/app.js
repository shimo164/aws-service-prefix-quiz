class AWSQuiz {
    constructor() {
        // Configuration - automatically detects URL
        this.config = {
            siteUrl: this.getSiteUrl()
        };

        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.timerInterval = null;
        this.currentMode = 'basic'; // Default mode

        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
    }

    getSiteUrl() {
        // Auto-detect site URL for GitHub Pages and localhost
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname;

        // For GitHub Pages: https://username.github.io/repository-name/
        // For localhost: http://localhost:8000/
        if (pathname === '/' || pathname === '') {
            return `${protocol}//${host}`;
        } else {
            // Remove trailing slash and file name if present
            const basePath = pathname.replace(/\/[^\/]*$/, '') || pathname;
            return `${protocol}//${host}${basePath}`;
        }
    }

    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultScreen = document.getElementById('result-screen');

        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.awsBtn = document.getElementById('aws-btn');
        this.amazonBtn = document.getElementById('amazon-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.twitterBtn = document.getElementById('twitter-btn');
        this.restartBtn2 = document.getElementById('restart-btn-2');
        this.twitterBtn2 = document.getElementById('twitter-btn-2');
        this.quitBtn = document.getElementById('quit-btn');
        this.basicModeBtn = document.getElementById('basic-mode');
        this.advancedModeBtn = document.getElementById('advanced-mode');

        // Display elements
        this.timerDisplay = document.getElementById('timer-display');
        this.questionCounter = document.getElementById('question-counter');
        this.questionText = document.getElementById('question-text');
        this.correctCount = document.getElementById('correct-count');
        this.totalCount = document.getElementById('total-count');
        this.finalTime = document.getElementById('final-time');
        this.answerReview = document.getElementById('answer-review');
    }

    async loadQuestions() {
        try {
            const fileName = `questions/${this.currentMode}.txt`;
            const response = await fetch(fileName);
            const text = await response.text();
            const services = text.trim().split('\n').filter(line => line.trim());

            this.questions = services.map(service => {
                const trimmedService = service.trim();
                const correctAnswer = trimmedService.startsWith('AWS') ? 'AWS' : 'Amazon';
                return {
                    service: trimmedService,
                    correctAnswer: correctAnswer
                };
            });

            // Shuffle questions for random order
            this.shuffleArray(this.questions);

        } catch (error) {
            console.error('Failed to load questions:', error);
            // Fallback questions if file loading fails
            this.questions = [
                { service: 'AWS Amplify', correctAnswer: 'AWS' },
                { service: 'AWS App Runner', correctAnswer: 'AWS' },
                { service: 'Amazon AppFlow', correctAnswer: 'Amazon' },
                { service: 'AWS AppSync', correctAnswer: 'AWS' },
                { service: 'AWS Audit Manager', correctAnswer: 'AWS' },
                { service: 'Amazon Augmented AI', correctAnswer: 'Amazon' }
            ];
            this.shuffleArray(this.questions);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.awsBtn.addEventListener('click', () => this.selectAnswer('AWS'));
        this.amazonBtn.addEventListener('click', () => this.selectAnswer('Amazon'));
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.twitterBtn.addEventListener('click', () => this.shareToTwitter());
        this.restartBtn2.addEventListener('click', () => this.restartQuiz());
        this.twitterBtn2.addEventListener('click', () => this.shareToTwitter());
        this.quitBtn.addEventListener('click', () => this.quitQuiz());
        this.basicModeBtn.addEventListener('click', () => this.selectMode('basic'));
        this.advancedModeBtn.addEventListener('click', () => this.selectMode('advanced'));
    }

    selectMode(mode) {
        this.currentMode = mode;

        // Update button states
        this.basicModeBtn.classList.toggle('active', mode === 'basic');
        this.advancedModeBtn.classList.toggle('active', mode === 'advanced');

        // Reload questions for the selected mode
        this.loadQuestions();
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        this.showScreen('quiz');
        this.startTimer();
        this.displayQuestion();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.timerDisplay.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        // Remove prefix from service name for display
        const serviceNameWithoutPrefix = question.service.replace(/^(AWS |Amazon )/, '');
        this.questionText.textContent = serviceNameWithoutPrefix;
        this.questionCounter.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;

        // Reset button states
        this.awsBtn.disabled = false;
        this.amazonBtn.disabled = false;
        this.awsBtn.style.opacity = '1';
        this.amazonBtn.style.opacity = '1';
    }

    selectAnswer(answer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = answer === question.correctAnswer;

        // Store user answer
        this.userAnswers.push({
            service: question.service,
            userAnswer: answer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect
        });

        // Move to next question immediately
        this.nextQuestion();
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            // Reset button styles
            this.resetButtonStyles();
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    resetButtonStyles() {
        [this.awsBtn, this.amazonBtn].forEach(btn => {
            btn.style.background = 'white';
            btn.style.color = '#333';
            btn.disabled = false;
        });
    }

    endQuiz() {
        this.stopTimer();
        this.showResults();
        this.showScreen('result');
    }

    showResults() {
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.userAnswers.length;
        const finalTime = Date.now() - this.startTime;
        const minutes = Math.floor(finalTime / 60000);
        const seconds = Math.floor((finalTime % 60000) / 1000);

        this.correctCount.textContent = correctAnswers;
        this.totalCount.textContent = totalQuestions;
        this.finalTime.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Display answer review
        this.answerReview.innerHTML = '';
        this.userAnswers.forEach(answer => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

            reviewItem.innerHTML = `
                <div class="service-name">${answer.service}</div>
                <div class="answer-info">
                    <span class="user-answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        あなたの回答: ${answer.userAnswer}
                    </span>
                </div>
            `;

            this.answerReview.appendChild(reviewItem);
        });
    }

    restartQuiz() {
        // Shuffle questions again for variety
        this.shuffleArray(this.questions);
        this.resetButtonStyles();
        this.showScreen('start');
    }

    shareToTwitter() {
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.userAnswers.length;
        const modeText = this.currentMode === 'basic' ? 'Basic' : 'Advanced';
        const tweetText = `「このAWSサービスのプレフィックスはAWS？Amazon？」クイズ(${modeText}モード)で${totalQuestions}問中${correctAnswers}問正解しました！ ${this.config.siteUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
    }

    quitQuiz() {
        // Show confirmation dialog
        const confirmQuit = confirm('終了しますか？');
        
        if (!confirmQuit) {
            // User clicked Cancel, do nothing
            return;
        }
        
        if (this.userAnswers.length === 0) {
            // No answers yet, just go back to start
            this.restartQuiz();
            return;
        }

        // Stop timer and show results for answered questions
        this.stopTimer();
        this.showResults();
        this.showScreen('result');
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AWSQuiz();
});
