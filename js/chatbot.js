const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

function toggleChatbot() {
    chatbotPanel.classList.toggle('active');
    
    if (chatbotPanel.classList.contains('active')) {
        chatbotInput.focus();
    }
}

function closeChatbot() {
    chatbotPanel.classList.remove('active');
}

chatbotToggle.addEventListener('click', toggleChatbot);
chatbotClose.addEventListener('click', closeChatbot);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !chatbotInput.disabled) {
        e.preventDefault();
    }
});

document.addEventListener('click', (e) => {
    if (chatbotPanel.classList.contains('active')) {
        const isClickInside = chatbotPanel.contains(e.target) || chatbotToggle.contains(e.target);
        if (!isClickInside) {
            closeChatbot();
        }
    }
});

