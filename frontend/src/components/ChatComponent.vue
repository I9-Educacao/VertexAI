<template>
  <div class="chat">
    <h1>chatbot</h1>
    <div class="chat-card">
      <div class="chat-box" id="chat-box">
        <div class="chat-output">
          <ul>
            <li v-for="(message, index) in chatMessages" :key="index" class="mensagens">
              <div class="msg-user" v-if="index % 2 === 0">
                <div class="contato"><img src="@/assets/images/user.png" width="40px"
                    height="auto"><strong>Você:</strong></div>
                <div>
                  <p>{{ message }}</p>
                </div>
              </div>
              <div v-else class="msg-ivone">
                <div class="contato"> <img src="@/assets/images/ivone.svg" width="40px"
                    height="auto"><strong>Ivone:</strong></div>
                <div v-html="marked(message)"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chat-inputs">
        <input type="text" v-model="message" placeholder="Digite sua mensagem..." @keyup.enter="sendMessage"/>
        <button @click="sendMessage">Enviar</button>
      </div>
      <div class="chat-inputs-2">
        <button @click="clearHistory" class="clearHistory">Limpar Histórico</button>
        <input type="file" @change="handleImageUpload" accept="image/*" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';

export default {
  mounted() {
    this.chatOutput = this.$el.querySelector('.chat-output ul');

    //Carregar as mensagens do localStorage (se tiver)
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      this.chatMessages = JSON.parse(savedMessages);
    }
  },
  data() {
    return {
      message: '',
      chatMessages: [],
      apiUrl: 'http://localhost:3000/api/generate',
    };
  },
  methods: {
    sendMessage() {
      if (this.message) {
        // Envie a mensagem para o Node.js usando Axios
        axios.post(this.apiUrl, { message: this.message })
          .then(response => {
            // Receba a resposta da IA
            const aiResponse = response.data.response;
            const formattedResponse = aiResponse.replace(/<[^>]+>/g, '');

            // Adicione a mensagem do usuário e a resposta da IA ao chat
            this.chatMessages.push(this.message);
            this.chatMessages.push(formattedResponse);

            //Salvando no localStorage
            localStorage.setItem('chatMessages', JSON.stringify(this.chatMessages));

            // Limpe o campo de entrada e atualize a interface
            this.message = '';
            this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
          })
          .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
          });

      }
      // Atualize a rolagem da área de chat
      this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
    },
    clearHistory() {
      localStorage.removeItem('chatMessages');

      // Limpe o array de mensagens
      this.chatMessages = [];

      // Role a área de chat para o topo
      this.chatOutput.scrollTop = 0;
    },
    marked(markdownString) {
      return marked(markdownString);
    }
  }
};
</script>

<style>
body {
  background: #e0efff;
  font-family: 'Nunito', sans-serif !important;
}
</style>

<style scoped>
.chat {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.chat h1 {
  font-size: 25px;
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  color: #42afff;
}

.chat-card {
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

#chat-box {
  width: 100%;
  height: 400px;
  padding: 10px;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
}

.chat-output ul {
  list-style: none;
  padding-inline-start: 0;
  font-family: 'Nunito', sans-serif !important;
}

.contato {
  display: flex;
  align-items: center;
}

.contato strong {
  margin-left: 5px;
}

.mensagens {
  display: flex;
  align-items: center;
  font-size: 17px;
  padding: 10px;
}

.mensagens span {
  margin-left: 5px;
  width: 100%;
  padding: 10px;
}

.mensagens strong {
  display: flex;
  align-items: center;
}

.msg-user {
  width: 100%;
  padding: 10px;
}

.msg-ivone {
  background: #f0f0f0;
  width: 100%;
  padding: 10px;
}

.chat-inputs {
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-inputs input {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  margin: 5px;
}

.chat-inputs button {
  padding: 10px;
  width: 100px;
  background: #42afff;
  border: 1px solid #dedede;
  color: #fff;
  font-weight: bold;
  border-radius: 10px;
  font-size: 17px;
  cursor: pointer;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.chat-inputs button:hover {
  background: #378ecd;
}

.chat-inputs-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
}

.chat-inputs-2 button {
  margin-bottom: 15px;
  background: #dedede;
  border-radius: 10px;
  border: 1px solid #dedede;
  padding: 10px;
  font-size: 16px;
}

.chat-inputs-2 button:hover{
  background: #e0efff;
}

#user-input {
  width: 300px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #dedede;
  font-size: 17px;
}

.user-resp {
  color: #393939;
  font-size: 17px;
  padding: 10px;
  margin: auto;
  display: flex;
  align-items: center;
}

.user-resp img {
  margin-right: 10px;
}

.bot-resp {
  background: #f9f9f9;
  font-size: 17px;
  color: #393939;
  padding: 10px;
  margin: auto;
  display: flex;
  align-items: center;
}

.bot-resp img {
  margin-right: 10px;
}

.input-area {
  display: flex;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 50%;
}

button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>