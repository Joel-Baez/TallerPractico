const tablero = document.getElementById('tablero');
const iniciarBtn = document.getElementById('iniciar');
const nivelSelect = document.getElementById('nivel');
const intentosSpan = document.getElementById('intentos');
const tiempoSpan = document.getElementById('tiempo');
const mejorTiempoSpan = document.getElementById('mejorTiempo');
const mejorIntentosSpan = document.getElementById('mejorIntentos');

let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let intentos = 0;
let aciertos = 0;
let timer = null;
let tiempo = 0;

const guardarRecord = () => {
  const mejorTiempo = localStorage.getItem('mejorTiempo');
  const mejorIntentos = localStorage.getItem('mejorIntentos');

  if (!mejorTiempo || tiempo < mejorTiempo) {
    localStorage.setItem('mejorTiempo', tiempo);
  }
  if (!mejorIntentos || intentos < mejorIntentos) {
    localStorage.setItem('mejorIntentos', intentos);
  }
};

const mostrarRecord = () => {
  mejorTiempoSpan.textContent = localStorage.getItem('mejorTiempo') || '--';
  mejorIntentosSpan.textContent = localStorage.getItem('mejorIntentos') || '--';
};
const iniciarJuego = () => {
  tablero.innerHTML = '';
  intentos = 0;
  aciertos = 0;
  tiempo = 0;
  intentosSpan.textContent = intentos;
  tiempoSpan.textContent = tiempo;

  clearInterval(timer);
  timer = setInterval(() => {
    tiempo++;
    tiempoSpan.textContent = tiempo;
  }, 1000);

  const nivel = parseInt(nivelSelect.value);
  tablero.style.gridTemplateColumns = `repeat(${nivel}, 1fr)`;
  const totalCartas = nivel * nivel;
  const simbolos = [];
  for (let i = 0; i < totalCartas / 2; i++) {
    simbolos.push(i, i);
  }}

