//Récupération des données de l'API 
async function GetMovie() {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US&page=1");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    body["results"].forEach(movie => ShowMovie(movie)); //Appel de la fonction pour afficher
}
GetMovie(); //récupère l'API

const list = document.querySelector(".list");
const ShowMovie = (movie) => {

    title = document.createElement("h4");
    title.innerHTML = movie["title"];

    date = document.createElement("h5");
    date.innerHTML = movie["release_date"];

    backdrop = document.createElement("img");
    backdrop.src = "https://image.tmdb.org/t/p/w300" + movie["backdrop_path"];

    poster = document.createElement("img");
    poster.src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];

    movie = document.createElement("div");
    movie.appendChild(title);
    movie.appendChild(date);
    movie.appendChild(poster);
    movie.appendChild(backdrop);
    list.appendChild(movie);
}