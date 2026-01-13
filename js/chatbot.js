const WEBHOOK_URL = 'https://andrebarreto-77.app.n8n.cloud/webhook/chatbot-cursos';

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

chatbotInput.disabled = false;
chatbotSend.disabled = false;

function toggleChatbot() {
    chatbotPanel.classList.toggle('active');
    
    if (chatbotPanel.classList.contains('active')) {
        chatbotInput.focus();
    }
}

function closeChatbot() {
    chatbotPanel.classList.remove('active');
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'chatbot-message chatbot-message-user' : 'chatbot-message chatbot-message-bot';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'chatbot-message-content';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    
    const welcomeMessage = chatbotMessages.querySelector('.chatbot-welcome');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
}

function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message chatbot-message-bot chatbot-loading';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'chatbot-message-content';
    messageContent.innerHTML = '<span class="chatbot-typing-indicator"><span></span><span></span><span></span></span>';
    
    messageDiv.appendChild(messageContent);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return messageDiv;
}

async function sendMessage() {
    const message = chatbotInput.value.trim();
    
    if (!message) {
        return;
    }
    
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    addMessage(message, true);
    
    const loadingMessage = addLoadingMessage();
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
        }
        
        const data = await response.json();
        const botResponse = data.response || data.message || 'Desculpe, não consegui processar sua mensagem.';
        
        loadingMessage.remove();
        addMessage(botResponse, false);
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        loadingMessage.remove();
        addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', false);
    } finally {
        chatbotInput.disabled = false;
        chatbotSend.disabled = false;
        chatbotInput.focus();
    }
}

chatbotToggle.addEventListener('click', toggleChatbot);
chatbotClose.addEventListener('click', closeChatbot);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !chatbotInput.disabled && chatbotInput.value.trim()) {
        e.preventDefault();
        sendMessage();
    }
});

chatbotSend.addEventListener('click', () => {
    if (!chatbotInput.disabled && chatbotInput.value.trim()) {
        sendMessage();
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
