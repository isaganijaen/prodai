import { FilesetResolver, LlmInference } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai';

new Vue({
    el: '#app',
    data: {
        userInput: '',
        output: '',
        loading: false,
        chatHistory: JSON.parse(localStorage.getItem('chatHistory')) || [],
        activeConversation: { title: '', messages: [] },
        selectedModel: localStorage.getItem('selectedModel') || '',
        llmInference: null,
        modelFileName: 'gemma-1.1-2b-it-gpu-int4.bin',
        currentAIMessage: null
    },
    methods: {
        getResponse() {
            this.output = '';
            this.loading = true;
            const userMessage = { sender: 'user', text: this.userInput, id: Date.now() };
            this.activeConversation.messages.push(userMessage);
            this.saveChatHistory();

            // Initialize a new AI message
            this.currentAIMessage = { sender: 'ai', text: '', id: Date.now() };
            this.activeConversation.messages.push(this.currentAIMessage);

            this.llmInference.generateResponse(this.userInput, this.displayPartialResults);
            this.userInput = '';
        },
        displayPartialResults(partialResults, complete) {
            if (this.currentAIMessage) {
                this.currentAIMessage.text += partialResults;
            }

            if (complete) {
                this.loading = false;
                this.saveChatHistory();
                this.currentAIMessage = null;  // Reset the current AI message
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    // Handle the content to update the knowledge base for RAG
                    console.log(content); // Implement knowledge base update logic here
                };
                reader.readAsText(file);
            }
        },
        loadConversation(index) {
            this.activeConversation = this.chatHistory[index];
        },
        saveChatHistory() {
            if (!this.chatHistory.includes(this.activeConversation)) {
                this.activeConversation.title = this.activeConversation.messages[0].text.slice(0, 50);
                this.chatHistory.push(this.activeConversation);
            }
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        },
        editTitle(index) {
            const newTitle = prompt("Edit conversation title", this.chatHistory[index].title);
            if (newTitle !== null) {
                this.chatHistory[index].title = newTitle;
                this.saveChatHistory();
            }
        },
        saveModel() {
            localStorage.setItem('selectedModel', this.selectedModel);
        },
        loadModel() {
            this.loading = true;
            localStorage.setItem('selectedModel', this.selectedModel);
            this.initializeModel();
        },
        formatMessage(text) {
            const codeBlockRegex = /```([\s\S]*?)```/g;
            let formattedText = text.replace(codeBlockRegex, (match, code) => {
                const lines = code.split('\n').map((line, index) => `<pre data-prefix="${index + 1}"><code>${line}</code></pre>`).join('');
                return `<div class="mockup-code max-w-[900px]">${lines}</div>`;
            });
            return formattedText.replace(/\n/g, '<br>'); // Convert new lines to <br> tags for non-code text
        },
        async initializeModel() {
            const genaiFileset = await FilesetResolver.forGenAiTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm');
            LlmInference.createFromOptions(genaiFileset, {
                baseOptions: { modelAssetPath: this.selectedModel || this.modelFileName },
            }).then(llm => {
                this.llmInference = llm;
                this.loading = false;
            }).catch(() => {
                alert('Failed to initialize the task.');
                this.loading = false;
            });
        }
    },
    mounted() {
        if (this.selectedModel) {
            this.loadModel();
        }
    },
    watch: {
        selectedModel() {
            this.loadModel();
        }
    }
});
