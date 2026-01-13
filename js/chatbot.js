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
        
        console.log('Status da resposta:', response.status);
        console.log('OK?', response.ok);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        const contentType = response.headers.get('content-type') || '';
        let respostaTexto;
        
        try {
            if (contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Resposta JSON recebida:', data);
                respostaTexto = data.resposta || data.response || data.message || data.text || (typeof data === 'string' ? data : JSON.stringify(data));
            } else {
                respostaTexto = await response.text();
                console.log('Resposta texto recebida:', respostaTexto);
            }
        } catch (parseError) {
            console.error('Erro ao ler resposta:', parseError);
            throw new Error('Erro ao processar resposta do servidor');
        }
        
        if (!response.ok) {
            console.error(`Erro HTTP ${response.status}:`, respostaTexto);
            throw new Error(`Erro HTTP ${response.status}: ${respostaTexto ? respostaTexto.substring(0, 100) : 'Sem detalhes'}`);
        }
        
        if (!respostaTexto || respostaTexto.trim() === '') {
            throw new Error('Resposta vazia do servidor');
        }
        
        loadingMessage.remove();
        addMessage(respostaTexto, false);
        
    } catch (error) {
        console.error('Erro completo:', error);
        console.error('Tipo do erro:', error.constructor.name);
        console.error('Mensagem do erro:', error.message);
        console.error('Stack:', error.stack);
        
        loadingMessage.remove();
        
        let mensagemErro = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('HTTP')) {
            mensagemErro = `Erro ${error.message}. Tente novamente.`;
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
