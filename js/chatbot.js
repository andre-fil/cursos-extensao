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

async function enviarMensagem() {
    const textoDigitado = chatbotInput.value.trim();
    
    if (!textoDigitado) {
        return;
    }
    
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    addMessage(textoDigitado, true);
    
    const loadingMessage = addLoadingMessage();
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: textoDigitado
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro HTTP ${response.status}:`, errorText);
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        let respostaTexto;
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            respostaTexto = data.resposta || data.response || data.message || JSON.stringify(data);
        } else {
            respostaTexto = await response.text();
        }
        
        if (!respostaTexto || respostaTexto.trim() === '') {
            throw new Error('Resposta vazia do servidor');
        }
        
        loadingMessage.remove();
        addMessage(respostaTexto, false);
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        loadingMessage.remove();
        
        let mensagemErro = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('CORS')) {
            mensagemErro = 'Erro de configuração do servidor. Por favor, tente mais tarde.';
        }
        
        addMessage(mensagemErro, false);
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
        enviarMensagem();
    }
});

chatbotSend.addEventListener('click', () => {
    if (!chatbotInput.disabled && chatbotInput.value.trim()) {
        enviarMensagem();
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
