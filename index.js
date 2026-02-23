const movieTitle = document.querySelector('.movie-card__title');

async function main() {
    const response = await fetch('http://www.omdbapi.com/?i=tt3896198&apikey=1026992b');
    const data = await response.json();
    console.log(data);
}

main();

function createMovieCard(movie) {
    return `<div class="movie-card">
    <div class="movie-card">
        <figure>
            <img src="movie1.jpg" alt="Movie 1" class="movie-card__image">
        </figure>
        <h3 class="movie-card__title">${movie.Title}</h3>
        <p class="movie-card__year">Release Year: ${movie.Year}</p>
    </div>`;

}