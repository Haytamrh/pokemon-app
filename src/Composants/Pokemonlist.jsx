import React from 'react'

const PokemonList = ({ pokemons }) => (
    <div>
      {pokemons.map(pokemon => (
        <ul key={pokemon.id} style={{borderRadius: '10px', border: '1px solid', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <li>{pokemon.name}</li>
          <img src={pokemon.image} />
          <li>Height: {pokemon.height}</li>
          <li>Weight: {pokemon.weight}</li>
        </ul>
      ))}
    </div>
  );

export default PokemonList
