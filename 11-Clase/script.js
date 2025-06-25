const getAllBtn = document.getElementById("getAllBtn");
const filterForm = document.getElementById("filterForm");
const resultsContainer = document.getElementById("results");
const errorContainer = document.getElementById("error");

// Función para renderizar personajes en pantalla
function renderCharacters(characters) {
  resultsContainer.innerHTML = "";
  errorContainer.textContent = ""; 

  characters.forEach(character => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <h3>${character.name}</h3>
      <p><strong>Status:</strong> ${character.status}</p>
      <p><strong>Species:</strong> ${character.species}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
    `;

    resultsContainer.appendChild(card);
  });
}

// Función para mostrar errores
function showError(message) {
  errorContainer.textContent = message;
  resultsContainer.innerHTML = "";
}

// Función para obtener todos los personajes
async function getAllCharacters() {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    if (!response.ok) throw new Error("Error al obtener personajes.");

    const data = await response.json();
    renderCharacters(data.results);
  } catch (error) {
    showError(error.message);
  }
}

// Función para obtener personajes filtrados
async function getFilteredCharacters(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const status = document.getElementById("status").value;
  const species = document.getElementById("species").value;
  const type = document.getElementById("type").value;
  const gender = document.getElementById("gender").value;

  const queryParams = new URLSearchParams();

  if (name) queryParams.append("name", name);
  if (status) queryParams.append("status", status);
  if (species) queryParams.append("species", species);
  if (type) queryParams.append("type", type);
  if (gender) queryParams.append("gender", gender);

  const url = `https://rickandmortyapi.com/api/character/?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontraron personajes con esos filtros.");

    const data = await response.json();
    renderCharacters(data.results);
  } catch (error) {
    showError(error.message);
  }
}

getAllBtn.addEventListener("click", getAllCharacters);
filterForm.addEventListener("submit", getFilteredCharacters);
