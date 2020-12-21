//Info générale de la liste de film affichée sur la page principale
const list = document.querySelector(".listMovie");
const ShowMovie = (movie) => {

    title = document.createElement("h4");
    title.innerHTML = movie["title"];

    date = document.createElement("h5");
    date.innerHTML = movie["release_date"];

    poster = document.createElement("img");
    poster.src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];
    poster.classList.add("movie");
    poster.id = movie["id"];

    //division avec les infos minimales du film
    movieHTML = document.createElement("div");
    movieHTML.appendChild(title);
    movieHTML.appendChild(date);
    movieHTML.appendChild(poster);
    list.appendChild(movieHTML);

    //Permet de cliquer sur chacun des films affichés
    const btnMovies = document.querySelectorAll('.movie');
    btnMovies.forEach(function(i){
        i.addEventListener('click', GetInfoMovie);
        i.style.cursor = "pointer";
    });
}

let movies = GetMovie(); //variable qui contient le résultat de la recherche
const btnManagementOk = document.querySelector(".management-ok");
//Récupération des données de l'API 
async function GetMovie() {

    //Récupération des info du formulaire
    const genre_id = document.querySelector('#management-genres').value;
    const runtime = document.querySelector('#management-time').value;
    const keywords = document.querySelector('#management-keywords').value;

    if (runtime == null)
        runtime_url = "";
    else if (runtime == 181)
        runtime_url = "&with_runtime.gte=180";
    else
        runtime_url = "&with_runtime.lte="+runtime;


    //numero de page aléatoire
    page = Math.floor(Math.random() * 50);


    const response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=9818ffc42e4d1dce5ea069594a161d22&sort-by=popularity.desc&page="+page+"&with_genres="+genre_id+runtime_url+"&with_keywords="+keywords);
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    movies = body["results"];
    SelectMovie();
}
btnManagementOk.addEventListener('click', function(){movies = GetMovie()});

const btnOtherMovie = document.querySelector(".btnOtherMovie");
//Selection de 3 films aléatoire
const SelectMovie = () => {
    list.innerHTML = null; //Remise à zéro de la liste
    /*const nbAleatoire = [];
    while(nbAleatoire.length != 2)
    {
        nb = movies[Math.floor(Math.random() * 20)];
        if (nbAleatoire.indexOf(nb) > -1)
        {
            nbAleatoire.push(nb);
        }
    }*/

    ShowMovie(movies[Math.floor(Math.random() * 20)]);
    ShowMovie(movies[Math.floor(Math.random() * 20)]);
    ShowMovie(movies[Math.floor(Math.random() * 20)]);

    //nbAleatoire.forEach(nb, ShowMovie(nb));
}
btnOtherMovie.addEventListener('click', GetMovie); //genère d'autres films


//Récupère les informations précises après clic sur affiche
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

/*
//Récuperer les différents genres
async function GetGenre() {
    const response = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    body["Genres"].forEach(genre => ShowGenre(genre)); //Appel de la fonction pour afficher
}
*/

const infoHTML = document.querySelector(".info-movie");
const backdropHTML = document.querySelector(".backdrop");
const backdropInsideHTML = document.querySelector(".backdrop-inside");
const listActor = document.querySelector(".listActor");
//Affichage des informations précises sur le film passée en paramètre
const ShowInfoMovie = (movie) => {

    //titre
    title = document.querySelector(".title");
    title.innerHTML = movie["title"];

    //date
    date = document.querySelector(".date");
    date.innerHTML = movie["release_date"];

    //durée en minutes
    runtime = document.querySelector(".runtime");
    runtime.innerHTML = movie["runtime"] + ' min';

    //poster
    poster = document.querySelector(".poster");
    poster.src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];

    //phrase d'accroche
    description = document.querySelector(".tagline");
    description.innerHTML = movie["tagline"];
   
    //liste de genres
    genre = document.querySelector(".genres");
    genre.innerHTML = null; //évite d'ajouter les genres à une liste de genre déjà présente
    ul = document.createElement("ul"); //contenant de la liste
    movie["genres"].forEach(function(i){
        li = document.createElement("li");//a chaque genre on ajoute un li
        li.innerHTML = i["name"];
        ul.appendChild(li);
    });
    genre.appendChild(ul);

    //description
    description = document.querySelector(".description");
    description.innerHTML = movie["overwiew"];
    
    //vote moyenne en pourcentage
    vote_average = document.querySelector(".vote_average");
    vote_average.innerHTML = movie["vote_average"]*10 + '%';

    //background avec la banderole 
    const urlBackdrop = "https://image.tmdb.org/t/p/w1280" + movie["backdrop_path"];
    backdropHTML.style.backgroundImage = `url(${urlBackdrop})`;
    backdropInsideHTML.style.backgroundImage = "linear-gradient(to top, #560018e0, #000000e0)";
    backdropHTML.style.backgroundRepeat = "no-repeat";
    backdropHTML.style.backgroundSize = "cover";
    backdropHTML.style.backgroundPosition = "top";

    //liste d'acteur
    listActor.innerHTML = null;//évite d'ajouter les acteurs à une liste d'acteur déjà présente
    GetCast(movie["id"]);
}

//Récupère la liste des acteurs du film passé en paramètre
async function GetCast(id) {
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
    //body["crew"].forEach(crew => ShowCrew(crew)); //ewwayer de récuperer directeur
}

//Affiche les acteurs du film passé en paramètre
const ShowCast = (cast) => {

    if (cast["profile_path"] != null)
    {
        //nom de l'acteur
        actor = document.createElement("h4");
        actor.innerHTML = cast["name"];
    
        //personnage dasn le film
        character = document.createElement("h5");
        character.innerHTML = cast["character"];

        //photo de l'acteur
        profil = document.createElement("img");
        profil.src = "https://image.tmdb.org/t/p/w185" + cast["profile_path"];

        castHTML = document.createElement("div");
        castHTML.appendChild(actor);
        castHTML.appendChild(character);
        castHTML.appendChild(profil);
        listActor.appendChild(castHTML);
    }
}

/*
//Récupère la liste des keywords du film passé en paramètre
async function GetKeywords(id) {
    const response = await fetch("https://api.themoviedb.org/3/movie/"+ id +"/keywords?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    body["keywords"].forEach(keyword => ShowKeywords(keyword)); //Appel de la fonction pour afficher
}

//Affiche les keywords du film passé en paramètre
const ShowKeywords = (keyword) => {

    //liste de genres
    keywordHTML = document.querySelector(".keywords");
    genre.innerHTML = null; //évite d'ajouter les keywords à une liste de kayword déjà présente
    ul = document.createElement("ul"); //contenant de la liste
    keyword.forEach(function(i){
        li = document.createElement("li");//a chaque kayword on ajoute un li
        li.innerHTML = i["name"];
        ul.appendChild(li);
    });
    genre.appendChild(ul);
}
*/
