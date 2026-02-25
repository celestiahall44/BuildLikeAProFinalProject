const OMDB_API_KEY = "1026992b";
const OMDB_API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=1026992b";

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');

function renderMovies(filteredMovies) {
  moviesGrid.innerHTML = '';
  if (filteredMovies.length === 0) {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">No movies found.</p>';
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
    moviesGrid.appendChild(card);
  });
}

async function fetchMovies(query) {
  moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">Loading...</p>';
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
  } catch (err) {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#f66;">Error loading movies.</p>';
  }
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    fetchMovies(query);
  } else {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#aaa;">Start typing to search for movies.</p>';
  }
}

searchInput.addEventListener('input', handleSearch);

