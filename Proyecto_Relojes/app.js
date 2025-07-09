const API_URL = 'https://685b40cc89952852c2d8fcd3.mockapi.io/api_clock/TiendaDeRelojes';

const watchList = document.getElementById('watchList');
const mensaje = document.getElementById('mensaje');
let editingWatchId = null;

const nameInput = document.getElementById('watchName');
const priceInput = document.getElementById('watchPrice');
const descInput = document.getElementById('watchDescription');
const imgUrlInput = document.getElementById('watchImageUrl');
const submitButton = document.getElementById('submitButton');
const formTitle = document.getElementById('formTitle');

// Cargar relojes al inicio
cargarRelojes();

async function cargarRelojes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar relojes');

    const relojes = await res.json();
    watchList.innerHTML = '';

    relojes.forEach(r => {
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100">
          <img src="${r.imagen}" class="card-img-top" alt="${r.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
          <div class="card-body">
            <h5 class="card-title">${r.nombre}</h5>
            <p class="card-text">
              <strong>Precio:</strong> $${r.precio}<br>
              ${r.descripcion}
            </p>
          </div>
          <div class="card-footer text-end">
            <button class="btn btn-sm btn-outline-primary me-2" onclick="prepararEdicion('${r.id}', '${r.nombre}', ${r.precio}, \`${r.descripcion}\`, '${r.imagen}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarReloj('${r.id}')">Eliminar</button>
          </div>
        </div>
      `;
      watchList.appendChild(col);
    });

  } catch (err) {
    mostrarMensaje(err.message, 'danger');
  }
}

function prepararEdicion(id, nombre, precio, descripcion, imagen) {
  editingWatchId = id;
  nameInput.value = nombre;
  priceInput.value = precio;
  descInput.value = descripcion;
  imgUrlInput.value = imagen;
  submitButton.textContent = 'Actualizar Reloj';
  formTitle.textContent = 'Editar Reloj';
}

async function crearOActualizarReloj() {
  const nombre = nameInput.value.trim();
  const precio = parseFloat(priceInput.value);
  const descripcion = descInput.value.trim();
  const imagen = imgUrlInput.value.trim();

  if (!nombre || isNaN(precio) || precio <= 0) {
    mostrarMensaje('Datos inválidos. Verifica todos los campos.', 'danger');
    return;
  }

  const watchData = { nombre, precio, descripcion, imagen };
  const url = editingWatchId ? `${API_URL}/${editingWatchId}` : API_URL;
  const method = editingWatchId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchData)
    });

    if (!res.ok) throw new Error(`Error al ${editingWatchId ? 'actualizar' : 'crear'} reloj`);

    limpiarFormulario();
    mostrarMensaje(`Reloj ${editingWatchId ? 'actualizado' : 'creado'} con éxito`, 'success');
    cargarRelojes();
  } catch (err) {
    mostrarMensaje(err.message, 'danger');
  }
}

async function eliminarReloj(id) {
  if (confirm('¿Eliminar este reloj?')) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar reloj');
      mostrarMensaje('Reloj eliminado con éxito', 'success');
      cargarRelojes();
    } catch (err) {
      mostrarMensaje(err.message, 'danger');
    }
  }
}

function mostrarMensaje(texto, tipo) {
  mensaje.innerHTML = `<div class="alert alert-${tipo}" role="alert">${texto}</div>`;
}

function limpiarFormulario() {
  nameInput.value = '';
  priceInput.value = '';
  descInput.value = '';
  imgUrlInput.value = '';
  editingWatchId = null;
  submitButton.textContent = 'Crear Reloj';
  formTitle.textContent = 'Agregar Reloj';
}
