const moviesListEl = document.querySelector(".movie-list");

async function main() {
    const movies = await fetch ("https://omdbapi.com/?s=fast&apikey=1026992b");
    const moviesData = await movies.json();
    moviesListEl.innerHTML = moviesData.Search.map((movie) => movieHTML(movie)).join('');
}

main();

function movieHTML(movie) {
    return `div class="movie-card">
    <figure>
        <img src="${movie.Poster}" alt="${movie.Title}" class="movie-card__image">
    </figure>
    <h3 class="movie-card__title">${movie.Title}</h3>
    <p class="movie-card__year">Release Year: ${movie.Year}</p>
</div>`;
}

