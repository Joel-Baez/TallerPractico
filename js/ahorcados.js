const PALABRAS_BASE = [
  { palabra: 'PROGRAMAR',  pista: 'Acción' },
  { palabra: 'MULTIMEDIA', pista: 'Carrera' },
  { palabra: 'ORDENADOR',  pista: 'Objeto' },
  { palabra: 'ALGORITMO',  pista: 'Concepto' },
  { palabra: 'COLOMBIA',   pista: 'País' },
  { palabra: 'GUITARRA',   pista: 'Instrumento' },
  { palabra: 'TORMENTA',   pista: 'Clima' },
  { palabra: 'BIBLIOTECA', pista: 'Lugar' },
  { palabra: 'MARIPOSA',   pista: 'Animal' },
  { palabra: 'VOLCAN',     pista: 'Naturaleza' },
  { palabra: 'ASTRONOMIA', pista: 'Ciencia' },
  { palabra: 'ESMERALDA',  pista: 'Piedra preciosa' },
  { palabra: 'CAFETAL',    pista: 'Cultivo' },
  { palabra: 'PINGÜINO',   pista: 'Animal' },
  { palabra: 'FERROCARRIL',pista: 'Transporte' },
  { palabra: 'CAMARON',    pista: 'Animal marino' },
  { palabra: 'QUIMICA',    pista: 'Ciencia' },
  { palabra: 'PLANETA',    pista: 'Espacio' },
  { palabra: 'ZAPATILLA',  pista: 'Prenda' },
  { palabra: 'FOTOGRAFIA', pista: 'Arte' },
  { palabra: 'MONTAÑA',    pista: 'Geografía' },
  { palabra: 'CARAMELO',   pista: 'Dulce' },
  { palabra: 'ELEFANTE',   pista: 'Animal' },
  { palabra: 'BOSQUE',     pista: 'Naturaleza' },
  { palabra: 'ARCOIRIS',   pista: 'Fenómeno' },
  { palabra: 'ESTRELLA',   pista: 'Espacio' },
  { palabra: 'RELOJ',      pista: 'Objeto' },
  { palabra: 'AVENTURA',   pista: 'Actividad' },
  { palabra: 'DRAGON',     pista: 'Mitología' },
  { palabra: 'CIENCIA',    pista: 'Conocimiento' }
];

let listaPalabras = cargar() || PALABRAS_BASE.slice();
let secreta, letrasElegidas, errores;
const maxErrores = 6;

const palabraMostrar = document.getElementById('palabra-mostrar');
const intentos      = document.getElementById('intentos');
const letrasUsadas  = document.getElementById('letras-usadas');
const teclado       = document.getElementById('teclado');
const mensaje       = document.getElementById('mensaje');
const pista         = document.getElementById('pista');
const entrada       = document.getElementById('entrada-palabras');

function construirTeclado() {
  teclado.innerHTML = '';
  'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(l => {
    const b = document.createElement('button');
    b.textContent = l;
    b.className = 'letra';
    b.addEventListener('click', () => probarLetra(l));
    teclado.appendChild(b);
  });
}

function nuevaPalabra() {
  return listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
}

function actualizarPantalla() {
  palabraMostrar.textContent = secreta.palabra
    .split('')
    .map(c => c === ' ' ? ' ' : letrasElegidas.has(c) ? c : '_')
    .join(' ');
  
  intentos.textContent = maxErrores - errores;
  letrasUsadas.textContent = [...letrasElegidas]
    .filter(l => !secreta.palabra.includes(l))
    .join(', ') || '—';

  const partes = ['cabeza','cuerpo','brazo1','brazo2','pierna1','pierna2'];
  partes.forEach((p, i) => {
    document.getElementById(p).style.opacity = errores > i ? 1 : 0;
  });
}

function mostrarMensaje(txt, tipo) {
  mensaje.style.display = 'block';
  mensaje.textContent = txt;
  mensaje.className = 'mensaje ' + (tipo === 'ganar' ? 'ganar' : 'perder');
}

function probarLetra(l) {
  if (finJuego() || letrasElegidas.has(l)) return;
  letrasElegidas.add(l);

  const btn = [...teclado.querySelectorAll('button')].find(b => b.textContent === l);
  if (btn) btn.classList.add('deshabilitada');

  if (secreta.palabra.includes(l)) {
    actualizarPantalla();
    if (ganaste()) mostrarMensaje('¡Ganaste! La palabra era: ' + secreta.palabra, 'ganar');
  } else {
    errores++;
    actualizarPantalla();
    if (errores >= maxErrores) mostrarMensaje('Perdiste. Era: ' + secreta.palabra, 'perder');
  }
}

function ganaste() {
  return secreta.palabra.split('').every(c => c === ' ' || letrasElegidas.has(c));
}
function finJuego() {
  return errores >= maxErrores || ganaste();
}

function nuevoJuego() {
  letrasElegidas = new Set();
  errores = 0;
  secreta = nuevaPalabra();
  pista.textContent = secreta.pista || '—';
  mensaje.style.display = 'none';
  construirTeclado();
  actualizarPantalla();
}

function guardar() {
  localStorage.setItem('palabras_ahorcado', JSON.stringify(listaPalabras));
}
function cargar() {
  try {
    return JSON.parse(localStorage.getItem('palabras_ahorcado'));
  } catch {
    return null;
  }
}

document.getElementById('btn-nuevo').addEventListener('click', nuevoJuego);
document.getElementById('btn-guardar').addEventListener('click', () => {
  const raw = entrada.value.trim();
  if (!raw) return alert('Agrega palabras.');
  listaPalabras = raw.split(',').map(s => {
    const [p, cat] = s.split('|').map(x => x.trim());
    return { palabra: p.toUpperCase(), pista: cat || '' };
  });
  guardar();
  alert('Lista guardada. Pulsa Nuevo Juego.');
});
document.getElementById('btn-restablecer').addEventListener('click', () => {
  if (confirm('¿Restablecer lista por defecto?')) {
    listaPalabras = PALABRAS_BASE.slice();
    guardar();
    alert('Lista restablecida.');
  }
});
document.getElementById('btn-editar').addEventListener('click', () => {
  entrada.value = listaPalabras
    .map(w => w.pista ? `${w.palabra}|${w.pista}` : w.palabra)
    .join(', ');
  entrada.focus();
});

window.addEventListener('keydown', e => {
  if (/^[a-zA-ZñÑ]$/.test(e.key)) {
    probarLetra(e.key.toUpperCase());
  }
});

nuevoJuego();
