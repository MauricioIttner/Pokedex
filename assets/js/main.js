const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const maxRecords = 151;
const limit = 10;
let offset = 0;

async function loadPokemonItens(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    const pokemons = data.results;
    pokeapi.getPokemons(offset, limit).then((pokemons = []) => {

                const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img class="bulb" src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>`).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, limit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

pokemonList.addEventListener('click', async (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    let pokemonNumber = clickedPokemon.querySelector('.number').textContent;
    pokemonNumber = pokemonNumber.replace('#', '');

    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
    try {
        const pokemonDetail = await pokeapi.getPokemonDetail({ url: pokemonUrl });
        const { name, number, types, photo, abilities,hp, attack, defense, speed, captureRate} = pokemonDetail;
        const typeList = types.map(type => `<li class="modalType"> ${type}</li>`).join('');


        modalContent.innerHTML = `
        <li class="modalPokemon ${types[0]}">
        <span class="modalNumber">#${number}</span>
        <span class="modalName">${name}</span>
        <div class="modalDetail">
        <ol class="modalTypes">
        ${typeList}
        </ol>
        <img src="${photo}" alt="${name}">
        <div class="modalAbilities">
        <span class="Abilities">${abilities.join(', ')}</span>
        </div>
        <div class="modalStats">
        <span class="modalHP">HP: ${hp}</span>
        <span class="modalAttack">Attack: ${attack}</span>
        <span class="modalDefense">Defense: ${defense}</span>
        <span class="modalSpeed">Speed: ${speed}</span>
        <span class="modalCaptureRate">Capture Rate: ${captureRate}</span>
        
                </div>
                </div>
            </div>
        </li>`;

        modal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao obter detalhes do Pokémon', error);
    }
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});