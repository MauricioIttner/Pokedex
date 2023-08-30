const pokeapi = {}

function convertoPokeApiDetailToPokemon(pokeDetail, evolutionChain) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    pokemon.abilities = abilities;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;


    pokemon.hp = pokeDetail.stats.find((stat) => stat.stat.name === 'hp').base_stat;
    pokemon.attack = pokeDetail.stats.find((stat) => stat.stat.name === 'attack').base_stat;
    pokemon.defense = pokeDetail.stats.find((stat) => stat.stat.name === 'defense').base_stat;
    pokemon.speed = pokeDetail.stats.find((stat) => stat.stat.name === 'speed').base_stat;

    pokemon.captureRate = pokeDetail.capture_rate;



    return pokemon;
}



pokeapi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url).then((response) => response.json())
        .then((pokeDetail) => {
            pokeDetail.capture_rate = Math.round((100 / 255) * pokeDetail.base_experience);
            return pokeDetail;
        })
        .then(convertoPokeApiDetailToPokemon)
}



pokeapi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeapi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)
}