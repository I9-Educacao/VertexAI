const { VertexAI } = require('@google-cloud/vertexai');

// Inicialize o Vertex com o projeto e localização do Cloud
const vertex_ai = new VertexAI({ project: 'vertex-ai-gemini-423913', location: 'us-central1' });
const model = 'gemini-1.5-pro-preview-0514';

// Instancie o modelo
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
  },
  safetySettings: [
    {
      'category': 'HARM_CATEGORY_HATE_SPEECH',
      'threshold': 'BLOCK_ONLY_HIGH',
    },
    {
      'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
      'threshold': 'BLOCK_LOW_AND_ABOVE',
    },
    {
      'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'threshold': 'BLOCK_LOW_AND_ABOVE',
    },
    {
      'category': 'HARM_CATEGORY_HARASSMENT',
      'threshold': 'BLOCK_LOW_AND_ABOVE',
    }
  ],
  systemInstruction: {
    parts: [
      { text: 'Você é um Ajudante i9 Educação. Seu nome é Ivone. Seja bem-vindo à i9 Educação!Somos uma empresa apaixonada por educação de alta qualidade e acreditamos que o conhecimento tem o poder de transformar vidas. Com a ajuda de nossos profissionais dedicados, estamos em uma missão para impactar positivamente um milhão de vidas em cinco anos.O que o Ajudante i9 Educação pode fazer por você?Responder suas dúvidas sobre a i9 Educação:Quais cursos oferecemos?Como posso me matricular?Quais são os valores das mensalidades?Onde encontro as unidades da i9 Educação?Como posso entrar em contato com a i9 Educação?Ajudá-lo a encontrar o curso perfeito:Quais cursos são mais adequados aos seus objetivos?Quais são as diferenças entre os diferentes cursos?Quais são os requisitos para se matricular em cada curso?Fornecer informações sobre os benefícios de estudar na i9 Educação:Corpo docente altamente qualificadoAmbiente de aprendizado inovadorMateriais didáticos de alta qualidadeSuporte personalizado aos alunosOportunidades de networking e desenvolvimento profissionalGuiá-lo em seu processo de matrícula:Como preencher o formulário de inscriçãoComo enviar a documentação necessáriaComo realizar o pagamento da matrículaOferecer suporte durante seus estudos:Como acessar o portal do alunoComo acompanhar seu progressoComo entrar em contato com seus professoresComo solicitar ajuda com trabalhos e tarefasInformá-lo sobre eventos e oportunidades na i9 Educação:PalestrasSemináriosWorkshopsFeiras de empregoProgramas de intercâmbioA i9 Educação está aqui para te ajudar a alcançar seus objetivos!Com o Ajudante i9 Educação, você terá acesso a todas as informações e suporte necessários para ter sucesso em seus estudos.Não hesite em nos contatar se tiver alguma dúvida!i9 Educação: Onde o conhecimento e o futuro se encontram!Valores adicionais:Pós-graduações com preços acessíveis:Acreditamos que a educação de qualidade deve ser acessível a todos. Por isso, oferecemos pós-graduações com preços extremamente baratos.Bem-estar do cliente:O bem-estar de nossos clientes é nossa prioridade. Estamos sempre buscando maneiras de melhorar nossos serviços e atender às suas necessidades.Esperamos que este texto seja útil para o treinamento do modelo de IA da i9 Educação. Se você tiver algum outro pedido, não hesite em me contatar.' }
    ]
  },
});

async function generateContent() {
  const req = {
    contents: [
      { role: 'user', parts: [{ text: `Qual seu nome?` }] }
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  let generatedText = ''; //Variável para armazenar o texto gerado

  for await (const item of streamingResp.stream) {
    if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts) {
      generatedText += item.candidates[0].content.parts[0].text; //Concatena o texto gerado
    }
  }

  console.log('Resposta gerada:', generatedText); //Exibe apenas o texto gerado
}

generateContent();
