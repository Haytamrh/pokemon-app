import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Pokemonlist from './Composants/Pokemonlist';
import Pagination from './Composants/Pagination'; 

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); 
  const [paginationMode, setPaginationMode] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPokemonDetails = async (pokemon) => {
    try {
      const response = await axios.get(pokemon.url);
      return {
        name: pokemon.name,
        image: response.data.sprites.front_default,
        height: response.data.height,
        weight: response.data.weight
      };
    } catch (error) {
      console.error("Error", error);
    }
  };

  const fetchData = async () => {
    try {
      let url = `https://pokeapi.co/api/v2/pokemon`;

      if (paginationMode) {
        url += `?offset=${(currentPage - 1) * 30}&limit=30`;
      } else {
        url += `?offset=${offset}&limit=15`;
      }

      const response = await axios.get(url);
      const newPokemons = await Promise.all(response.data.results.map(fetchPokemonDetails));
      
      setPokemons(paginationMode ? newPokemons : [...pokemons, ...newPokemons]);
      if (!paginationMode) {
        setOffset(offset + 15);
      }
      
    
      const totalResults = response.data.count;
      const totalPages = Math.ceil(totalResults / (paginationMode ? 30 : 15));
      setTotalPages(totalPages);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleLoadMore = () => {
    fetchData();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPokemons([]); 
    setPaginationMode(true);
  };

  const handleModeChange = () => {
    setPaginationMode(!paginationMode);
    setPokemons([]);
    setCurrentPage(1);
    setOffset(0);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, paginationMode]);

  return (
    <div>
      <h1>Pokemons</h1>
      <button onClick={handleModeChange}>
        {paginationMode ? "Switch to Infinite Scroll" : "Switch to Pagination"}
      </button>
      {!paginationMode ? (
        <InfiniteScroll
          dataLength={pokemons.length}
          next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <Pokemonlist pokemons={pokemons} />
        </InfiniteScroll>
      ) : (
        <div>
          <Pokemonlist pokemons={pokemons} />
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages} 
          />
        </div>
      )}
      {!paginationMode && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
};

export default App;
