const OMDB_API_KEY = "1026992b";
const OMDB_API_URL = "https://www.omdbapi.com";

const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
let currentMovies = [];

function renderMovies(filteredMovies) {
  currentMovies = filteredMovies;
  moviesContainer.innerHTML = '';
  if (filteredMovies.length === 0) {
    moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">No movies found.</p>';
    return;
  }
  filteredMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.Title} poster" />
      <div class="movie-info">
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-year">${movie.Year}</div>
        <div class="movie-desc">${movie.Plot ? movie.Plot : ''}</div>
      </div>
    `;
    moviesContainer.appendChild(card);
  });
}

async function fetchMovies(query) {
  moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">Loading...</p>';
  try {
    const res = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "True") {
      
      const detailsPromises = data.Search.slice(0, 8).map(async (movie) => {
        const detailRes = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`);
        return await detailRes.json();
      });
      const moviesWithDetails = await Promise.all(detailsPromises);
      renderMovies(moviesWithDetails);
    } else {
      renderMovies([]);
    }
    
  const filterSelect = document.getElementById('filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', function () {
      let movies = [...currentMovies];
      const value = filterSelect.value;
      if (value === "Alphabetical A to Z") {
        movies.sort((a, b) => a.Title.localeCompare(b.Title));
      } else if (value === "Alphabetical Z to A") {
        movies.sort((a, b) => b.Title.localeCompare(a.Title));
      } else if (value === "Oldest to Newest") {
        movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      } else if (value === "Newest to Oldest") {
        movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      }
      renderMovies(movies);
    });
  }
  } catch (err) {
    moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#f66;">Error loading movies.</p>';
  }
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    fetchMovies(query);
  } else {
    moviesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">Start typing to search for movies.</p>';
  }
}

const searchButton = document.getElementById('searchButton');
if (searchButton) {
  searchButton.addEventListener('click', handleSearch);
}

