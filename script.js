const container = document.getElementById('pokemonList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumber = document.getElementById('pageNumber');

let allPokemonList = [];
let currentPage = 1;
const itemsPerPage = 28; 

async function fetchAllPokemon() {
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
  const response = await fetch(url);
  const data = await response.json();
  allPokemonList = data.results;
  loadPage(currentPage);
}

async function fetchPokemonDetails(pokemonList) {
  const promises = pokemonList.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return res.json();
  });

  return Promise.all(promises);
}

function updatePageNumber() {
  pageNumber.textContent = `Page ${currentPage}`;
}

function toggleButtons() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * itemsPerPage >= allPokemonList.length;
}

async function loadPage(page) {
  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  const pagePokemonList = allPokemonList.slice(start, end);
  const detailedData = await fetchPokemonDetails(pagePokemonList);
  displayPokemon(detailedData);
  updatePageNumber();
  toggleButtons();
}

function displayPokemon(pokemonArray) {
  container.innerHTML = '';

  pokemonArray.forEach(pokemon => {
    const name = pokemon.name;
    const types = pokemon.types.map(t => t.type.name);
    const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
    const sprite = pokemon.sprites.front_default;

    const mainType = types[0]; // should be a string like 'fire', 'water', etc.
    const card = document.createElement('div');
    card.className = `pokemon-card type-${mainType}`;
    card.innerHTML = `
      <img src="${sprite}" alt="${name}" />
      <h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <p><strong>Type:</strong> ${types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join(' ')}</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
    `;

    container.appendChild(card);
  });
}


// Event listeners for buttons
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage * itemsPerPage < allPokemonList.length) {
    currentPage++;
    loadPage(currentPage);
  }
});

fetchAllPokemon();
