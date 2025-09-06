const form = document.getElementById('tareaForm');
const tareasUl = document.getElementById('tareas');
const buscarInput = document.getElementById('buscar');
const completadasSpan = document.getElementById('completadas');
const pendientesSpan = document.getElementById('pendientes');

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

const guardarTareas = () => {
  localStorage.setItem('tareas', JSON.stringify(tareas));
};

const actualizarContador = () => {
  const completadas = tareas.filter(t => t.estado === 'completada').length;
  const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
  completadasSpan.textContent = completadas;
  pendientesSpan.textContent = pendientes;
};

const mostrarTareas = (filtro = '') => {
  tareasUl.innerHTML = '';

  const tareasFiltradas = tareas
    .filter(t => t.descripcion.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  tareasFiltradas.forEach(tarea => {
    const li = document.createElement('li');
    li.className = tarea.estado;

    const texto = document.createElement('span');
    texto.textContent = `${tarea.fecha} - ${tarea.descripcion}`;
    li.appendChild(texto);

    const btnCompletar = document.createElement('button');
    btnCompletar.textContent = "✔";
    btnCompletar.className = "completar";
    btnCompletar.addEventListener('click', () => {
      tarea.estado = (tarea.estado === 'pendiente') ? 'completada' : 'pendiente';
      guardarTareas();
      mostrarTareas(buscarInput.value);
    });
    li.appendChild(btnCompletar);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = "🗑"; 
    btnEliminar.className = "eliminar";
    btnEliminar.addEventListener('click', () => {
      tareas = tareas.filter(t => t !== tarea);
      guardarTareas();
      mostrarTareas(buscarInput.value);
    });
    li.appendChild(btnEliminar);

    tareasUl.appendChild(li);
  });

  actualizarContador();
};

form.addEventListener('submit', ev => {
  ev.preventDefault();
  const fecha = document.getElementById('fecha').value;
  const descripcion = document.getElementById('descripcion').value;

  if (fecha && descripcion.trim() !== '') {
    const nuevaTarea = { fecha, descripcion, estado: 'pendiente' };
    tareas.push(nuevaTarea);
    guardarTareas();
    mostrarTareas(buscarInput.value);
    form.reset();
  }
});

buscarInput.addEventListener('input', () => {
  mostrarTareas(buscarInput.value);
});

mostrarTareas();
