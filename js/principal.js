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

    if (!mejorTiempo || tiempo < parseInt(mejorTiempo)) {
        localStorage.setItem('mejorTiempo', tiempo);
    }
    if (!mejorIntentos || intentos < parseInt(mejorIntentos)) {
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
    const totalCartas = (nivel * nivel % 2 === 0) ? nivel * nivel : nivel * nivel - 1;
    const simbolos = [];
    for (let i = 0; i < totalCartas / 2; i++) {
        simbolos.push(i, i);
    }
    cartas = simbolos
        .sort(() => Math.random() - 0.5)
        .map((simbolo, index) => {
            const div = document.createElement('div');
            div.className = 'carta';
            div.dataset.simbolo = simbolo;
            div.dataset.index = index;
            div.textContent = '';
            div.addEventListener('click', () => voltearCarta(div));
            tablero.appendChild(div);
            return div;
        });
};

const voltearCarta = (carta) => {
    if (carta.classList.contains('volteada') || carta.classList.contains('encontrada')) {
        return;
    }
    if (primeraCarta && segundaCarta) return;

    carta.classList.add('volteada');
    carta.textContent = carta.dataset.simbolo;

    if (!primeraCarta) {
        primeraCarta = carta;
    } else {
        segundaCarta = carta;
        intentos++;
        intentosSpan.textContent = intentos;

        if (primeraCarta.dataset.simbolo === segundaCarta.dataset.simbolo) {
            primeraCarta.classList.add('encontrada');
            segundaCarta.classList.add('encontrada');
            primeraCarta = null;
            segundaCarta = null;
            aciertos++;
            if (aciertos === cartas.length / 2) {
                clearInterval(timer);
                guardarRecord();
                mostrarRecord();
                alert(`¡Ganaste! Intentos: ${intentos}, Tiempo: ${tiempo} segundos`);
            }
        } else {
            setTimeout(() => {
                primeraCarta.classList.remove('volteada');
                segundaCarta.classList.remove('volteada');
                primeraCarta.textContent = '';
                segundaCarta.textContent = '';
                primeraCarta = null;
                segundaCarta = null;
            }, 800);
        }
    }
};
iniciarBtn.addEventListener('click', iniciarJuego);
mostrarRecord();
