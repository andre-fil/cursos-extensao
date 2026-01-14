const WEBHOOK_URL = 'https://andrebarreto-77.app.n8n.cloud/webhook/chatbot-cursos';

let chatbotToggle;
let chatbotPanel;
let chatbotClose;
let chatbotInput;
let chatbotSend;
let chatbotMessages;

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
                chatInput: textoDigitado
            })
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erro desconhecido');
            console.error('Erro HTTP:', response.status, errorText);
            throw new Error(`Erro HTTP ${response.status}: ${errorText.substring(0, 100)}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        console.log('Content-Type:', contentType);
        
        let respostaTexto = '';
        
        try {
            if (contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Resposta JSON completa:', data);
                respostaTexto = data.resposta || data.response || data.message || data.text || data.answer || '';
                
                if (!respostaTexto && typeof data === 'object') {
                    const keys = Object.keys(data);
                    if (keys.length > 0) {
                        respostaTexto = data[keys[0]] || JSON.stringify(data);
                    }
                }
            } else {
                respostaTexto = await response.text();
                console.log('Resposta texto:', respostaTexto);
            }
        } catch (parseError) {
            console.error('Erro ao processar resposta:', parseError);
            throw new Error('Erro ao processar resposta do servidor');
        }
        
        if (!respostaTexto || respostaTexto.trim() === '') {
            console.warn('Resposta vazia recebida');
            throw new Error('Resposta vazia do servidor');
        }
        
        loadingMessage.remove();
        addMessage(respostaTexto, false);
        
    } catch (error) {
        console.error('Erro completo ao enviar mensagem:', error);
        console.error('Tipo do erro:', error.name);
        console.error('Mensagem:', error.message);
        loadingMessage.remove();
        
        let mensagemErro = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('HTTP')) {
            mensagemErro = `Erro ao comunicar com o servidor. Tente novamente em alguns instantes.`;
        } else if (error.message.includes('vazia')) {
            mensagemErro = 'O servidor não retornou uma resposta válida. Tente novamente.';
        }
        
        addMessage(mensagemErro, false);
    } finally {
        chatbotInput.disabled = false;
        chatbotSend.disabled = false;
        chatbotInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chatbotToggle = document.getElementById('chatbotToggle');
    chatbotPanel = document.getElementById('chatbotPanel');
    chatbotClose = document.getElementById('chatbotClose');
    chatbotInput = document.getElementById('chatbotInput');
    chatbotSend = document.getElementById('chatbotSend');
    chatbotMessages = document.getElementById('chatbotMessages');
    
    if (!chatbotToggle || !chatbotPanel || !chatbotClose || !chatbotInput || !chatbotSend || !chatbotMessages) {
        console.warn('Elementos do chatbot não encontrados. O chatbot não será inicializado.');
        return;
    }
    
    chatbotInput.disabled = false;
    chatbotSend.disabled = false;
    
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
        if (chatbotPanel && chatbotPanel.classList.contains('active')) {
            const isClickInside = chatbotPanel.contains(e.target) || chatbotToggle.contains(e.target);
            if (!isClickInside) {
                closeChatbot();
            }
        }
    });
});
