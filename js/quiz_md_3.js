// ============================================
// QUIZ INTERATIVO - Vulnerabilidades TCP/UDP
// ============================================

let currentQuestion = 1;
let answers = {
  q1: 'synflood',  // CORRETA
  q2: 'reset',     // CORRETA
  q3: 'hijack',    // CORRETA
  q4: 'udpflood',  // CORRETA
  q5: 'udp'        // CORRETA (desativar ICMP NÃO é mitigação)
};
let score = 0;
let answered = [false, false, false, false, false];

function selectOption(question, option) {
  // Marca a opção selecionada
  document.querySelectorAll(`input[name="${question}"]`).forEach(el => {
    el.checked = false;
  });
  document.getElementById(`${question}${option}`).checked = true;

  // Atualiza o estilo visual
  document.querySelectorAll(`#questao${currentQuestion} .form-check`).forEach(el => {
    el.style.border = 'none';
  });
  event.currentTarget.style.border = '1px solid var(--cisco-green)';
}

function verificarResposta() {
  const question = `q${currentQuestion}`;
  const selected = document.querySelector(`input[name="${question}"]:checked`);

  if (!selected) {
    alert('Por favor, selecione uma resposta!');
    return;
  }

  if (answered[currentQuestion-1]) {
    alert('Você já respondeu esta questão!');
    return;
  }

  const isCorrect = (selected.value === answers[question]);
  if (isCorrect) score++;

  answered[currentQuestion-1] = true;

  // Mostra feedback
  document.getElementById(`feedback-q${currentQuestion}`).style.display = 'block';
  document.getElementById('btnVerificar').style.display = 'none';
  document.getElementById('btnProximo').style.display = 'inline-block';

  // Atualiza pontuação
  document.getElementById('quizScore').innerHTML = `Acertos: ${score}/5`;

  // Atualiza barra de progresso
  const progress = (currentQuestion / 5) * 100;
  document.getElementById('quizProgressBar').style.width = progress + '%';
}

function nextQuestion(num) {
  if (currentQuestion < 5) {
    // Esconde questão atual
    document.getElementById(`questao${currentQuestion}`).style.display = 'none';

    // Avança
    currentQuestion++;

    // Mostra próxima questão
    document.getElementById(`questao${currentQuestion}`).style.display = 'block';
    document.getElementById(`questao${currentQuestion}`).style.borderLeftColor = 'var(--cisco-green)';

    // Atualiza contador
    document.getElementById('quizCounter').innerHTML = `Questão ${currentQuestion} de 5`;

    // Gerencia botões
    document.getElementById('btnVerificar').style.display = 'inline-block';
    document.getElementById('btnProximo').style.display = 'none';
    document.getElementById('btnAnterior').disabled = false;

    // Se já respondeu, mostra feedback automaticamente
    if (answered[currentQuestion-1]) {
      document.getElementById(`feedback-q${currentQuestion}`).style.display = 'block';
      document.getElementById('btnVerificar').style.display = 'none';
      document.getElementById('btnProximo').style.display = 'inline-block';
    }
  } else {
    finalizarQuiz();
  }
}

function questionAnterior() {
  if (currentQuestion > 1) {
    // Esconde atual
    document.getElementById(`questao${currentQuestion}`).style.display = 'none';

    // Volta
    currentQuestion--;

    // Mostra anterior
    document.getElementById(`questao${currentQuestion}`).style.display = 'block';

    // Atualiza contador
    document.getElementById('quizCounter').innerHTML = `Questão ${currentQuestion} de 5`;

    // Gerencia botões
    document.getElementById('btnVerificar').style.display = answered[currentQuestion-1] ? 'none' : 'inline-block';
    document.getElementById('btnProximo').style.display = answered[currentQuestion-1] ? 'inline-block' : 'none';
    document.getElementById('btnAnterior').disabled = (currentQuestion === 1);
  }
}

function finalizarQuiz() {
  // Esconde todas as questões
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`questao${i}`).style.display = 'none';
  }

  // Esconde botões de navegação
  document.getElementById('btnAnterior').style.display = 'none';
  document.getElementById('btnVerificar').style.display = 'none';
  document.getElementById('btnProximo').style.display = 'none';

  // Mostra resultado
  document.getElementById('resultadoQuiz').style.display = 'block';
  document.getElementById('resultadoPontuacao').innerHTML = `${score}/5`;

  const percentual = (score / 5) * 100;
  document.getElementById('resultadoProgresso').style.width = percentual + '%';

  let mensagem = '';
  if (score === 5) mensagem = 'Excelente! Você domina as vulnerabilidades TCP/UDP! 🏆';
  else if (score >= 3) mensagem = 'Bom trabalho! Revise os conceitos para aperfeiçoar. 📚';
  else mensagem = 'Continue estudando! Reveja a seção 3.3 para consolidar o conhecimento. 💪';

  document.getElementById('resultadoMensagem').innerHTML = mensagem;
}

function reiniciarQuiz() {
  currentQuestion = 1;
  score = 0;
  answered = [false, false, false, false, false];

  // Reseta visual
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`questao${i}`).style.display = i === 1 ? 'block' : 'none';
    document.getElementById(`feedback-q${i}`).style.display = 'none';

    // Desmarca todas as opções
    document.querySelectorAll(`input[name="q${i}"]`).forEach(el => {
      el.checked = false;
    });
  }

  // Re-marca as respostas corretas (visual)
  document.getElementById('q1e').checked = true;
  document.getElementById('q2b').checked = true;
  document.getElementById('q3c').checked = true;
  document.getElementById('q4b').checked = true;
  document.getElementById('q5c').checked = true;

  // Reseta UI
  document.getElementById('quizCounter').innerHTML = 'Questão 1 de 5';
  document.getElementById('quizScore').innerHTML = 'Acertos: 0/5';
  document.getElementById('quizProgressBar').style.width = '20%';

  document.getElementById('resultadoQuiz').style.display = 'none';
  document.getElementById('btnAnterior').style.display = 'inline-block';
  document.getElementById('btnVerificar').style.display = 'inline-block';
  document.getElementById('btnProximo').style.display = 'none';
  document.getElementById('btnAnterior').disabled = true;
}

// Inicializa
document.addEventListener('DOMContentLoaded', function() {
  // Pré-marca as respostas corretas (para visual)
  document.getElementById('q1e').checked = true;
  document.getElementById('q2b').checked = true;
  document.getElementById('q3c').checked = true;
  document.getElementById('q4b').checked = true;
  document.getElementById('q5c').checked = true;
});
