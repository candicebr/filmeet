GetMovie(); //récupère l'API

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

//Info générale de la liste afficher sur la page principale
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


    //GetCast(movie["id"]);

    movieHTML = document.createElement("div");
    movieHTML.classList.add("movie");
    movieHTML.id = movie["id"];
    movieHTML.appendChild(title);
    movieHTML.appendChild(date);
    movieHTML.appendChild(poster);
    movieHTML.appendChild(backdrop);
    list.appendChild(movieHTML);

    const btnMovies = document.querySelectorAll('.movie');

    btnMovies.forEach(function(i){
        i.addEventListener('click', GetInfoMovie);
    });
}

//Info précises après clic sur affiche

async function GetInfoMovie (e) {


    const response = await fetch("https://api.themoviedb.org/3/movie/" + e.currentTarget.id + "?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    ShowInfoMovie(body);
}

const infoHTML = document.querySelector(".info-movie");
const infoInsideHTML = document.querySelector(".info-movie-inside");
const ShowInfoMovie = (movie) => {

   
    title = document.querySelector(".title");
    title.innerHTML = movie["title"];

    date = document.querySelector(".date");
    date.innerHTML = movie["release_date"];

    runtime = document.querySelector(".runtime");
    runtime.innerHTML = movie["runtime"] + ' min';

    poster = document.querySelector(".poster");
    poster.src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];

    description = document.querySelector(".tagline");
    description.innerHTML = movie["tagline"];
   
    genre = document.querySelector(".genres");
    genre.innerHTML = null;
    ul = document.createElement("ul");

    description = document.querySelector(".description");
    description.innerHTML = movie["overwiew"];

    movie["genres"].forEach(function(i){
        li = document.createElement("li");
        li.innerHTML = i["name"];
        ul.appendChild(li);
    });
    genre.appendChild(ul);

    vote_average = document.querySelector(".vote_average");
    vote_average.innerHTML = movie["vote_average"]*10 + '%';

    const urlBackdrop = "https://image.tmdb.org/t/p/w1280" + movie["backdrop_path"];
    infoHTML.style.backgroundImage = `url(${urlBackdrop})`;
    infoInsideHTML.style.backgroundImage = "linear-gradient(to right, rgba(13.73%, 3.53%, 4.71%, 1), rgba(13.73%, 3.53%, 4.71%, 0.85))";
    infoHTML.style.backgroundRepeat = "no-repeat";
    infoHTML.style.backgroundSize = "cover";
    infoHTML.style.backgroundPosition = "top";
}


/*
const ShowCast = (cast) => {

    if (cast["profile_path"] != null)
    {
        name = document.createElement("h4");
        name.innerHTML = cast["name"];
    
        character = document.createElement("h5");
        character.innerHTML = cast["character"];
        profil = document.createElement("img");
        profil.src = "https://image.tmdb.org/t/p/w185" + cast["profile_path"];

        castHTML = document.createElement("div");
        //castHTML.appendChild(name);
        castHTML.appendChild(character);
        castHTML.appendChild(profil);

        list.appendChild(castHTML);
    }
}*/

/*async function GetCast(id) {
    const response = await fetch("https://api.themoviedb.org/3/movie/"+ id +"/credits?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    body["cast"].forEach(cast => ShowCast(cast)); //Appel de la fonction pour afficher
}*/