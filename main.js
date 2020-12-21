GetGenre();//remplir les options de genre du formulaire

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

    body["genres"].forEach(genre => AddGenreToManagement(genre)); //Appel de la fonction pour afficher
}

const management_genre = document.querySelector("#management-genres");
//Ajout des différents genre dans le formulaire
const AddGenreToManagement = (genre) => {
    genreOption = document.createElement("option");
    genreOption.innerHTML = genre['name'];
    genreOption.value = genre['id'];
    management_genre.appendChild(genreOption);
}

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
    const director_id = document.querySelector('#management-director').value;

    //test si le formulaire est vide
    if (runtime == "null" && genre_id == "null" || director_id != "null")
        page = 1;//les plus populaires en ce moment
    else
        page = Math.floor(Math.random() * 20 + 1);//numero de page aléatoire

    //Gestion de la durée du film
    if (runtime == "null")
        runtime_url = "";
    else if (runtime == 181)
        runtime_url = "&with_runtime.gte=180";
    else
        runtime_url = "&with_runtime.lte=" + runtime;

    //Gestion si le genre est saisi ou non
    if (genre_id == "null")
        genre_url = ""
    else
        genre_url = "&with_genres=" + genre_id;

    //Gestion si le genre est saisi ou non
    if (director_id == "null")
        director_url = ""
    else
        director_url = "&with_crew=" + director_id;

 
    const response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=9818ffc42e4d1dce5ea069594a161d22&sort-by=popularity.desc&page="+page+genre_url+runtime_url+director_url+"&with_keywords="+keywords);
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
    let nbAleatoire = []; //Tableau de nombres aléatoires différents

    while(nbAleatoire.length != 3)//Tant qu'il n'y a pas 3 identifiants de films
    {
        nb = Math.floor(Math.random() * 20);//Nombre aléatoire entre 1 et 20

        if (nbAleatoire.indexOf(nb) < 0)//Si l'identifiant ne fait pas déjà partie du tableau
        {
            nbAleatoire.push(nb);
        }
    }

    //appel de l'affichage
    nbAleatoire.forEach(function(i){
        ShowMovie(movies[i]);
    });
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
    movie["genres"].forEach(function(i){
        li_genre = document.createElement("li");//a chaque genre on ajoute un li
        li_genre.innerHTML = i["name"];
        genre.appendChild(li_genre);
    });

    //description
    description = document.querySelector(".description");
    description.innerHTML = movie["overwiew"];
    
    //vote moyenne en pourcentage
    vote_average = document.querySelector(".vote_average");
    vote_average.innerHTML = movie["vote_average"]*10 + '%';

    //Companies de Production
    companie = document.querySelector(".companies");
    companie.innerHTML = null; //évite d'ajouter les companies à une liste de companie déjà présente
    movie["production_companies"].forEach(function(i){
        li_companie = document.createElement("li");//a chaque companie on ajoute un li
        li_companie.innerHTML = i["name"];
        if (i["logo_path"] != null)
        {
            img_companie = document.createElement("img");
            img_companie.src = "https://image.tmdb.org/t/p/w92" + i["logo_path"];
            li_companie.appendChild(img_companie);
        }
        companie.appendChild(li_companie);
    });

    //background avec la banderole 
    const urlBackdrop = "https://image.tmdb.org/t/p/w1280" + movie["backdrop_path"];
    backdropHTML.style.backgroundImage = `url(${urlBackdrop})`;
    backdropInsideHTML.style.backgroundImage = "linear-gradient(to top, #560018e0, #000000e0)";
    backdropHTML.style.backgroundRepeat = "no-repeat";
    backdropHTML.style.backgroundSize = "cover";
    backdropHTML.style.backgroundPosition = "top";

    //évite d'ajouter les acteurs et réalisateurs à une liste déjà présente
    listActor.innerHTML = null;
    directors.innerHTML = null;
    writers.innerHTML = null;

    //liste d'acteur avec réalisateurs
    GetCast(movie["id"]);

    //liste de mots clés
    GetKeywords(movie["id"]);
}

//Récupère la liste des acteurs du film passé en paramètre (+le directeur)
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
    body["crew"].forEach(crew => FindDirectors(crew)); //Retrouver les réalisateurs
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

const directors = document.querySelector(".director");
const writers = document.querySelector(".writer");
//Récupère les réalisateurs et ecrivains
const FindDirectors = (crew) => {
    if (crew["job"] == "Director")
    {
        directing = document.createElement("li");
        directing.innerHTML = crew["job"] + ": " + crew["name"];
        directors.appendChild(directing);
    }
    if (crew["department"] == "Writing")
    {
        writing = document.createElement("li");
        writing.innerHTML = crew["job"] + ": " + crew["name"];
        writers.appendChild(writing);
    }
}

listKeyword = document.querySelector(".keywords");
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

    listKeyword.innerHTML = null; //évite d'ajouter les keywords à une liste de keyword déjà présente
    body["keywords"].forEach(keyword => ShowKeywords(keyword)); //Appel de la fonction pour afficher
}

//Affiche les keywords du film passé en paramètre
const ShowKeywords = (keyword) => {

    //liste de genres
    li = document.createElement("li");//a chaque keyword on ajoute un li
    li.innerHTML = keyword["name"];
    listKeyword.appendChild(li);
}

