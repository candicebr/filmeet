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

let keywordsList = [];
//Récupère les keywords similaires à la recherche
async function GetKeywordsLike(string) {
    const response = await fetch("https://api.themoviedb.org/3/search/keyword?api_key=9818ffc42e4d1dce5ea069594a161d22&query="+string+"&page=1");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    keywordsList = body["results"];
    console.log(keywordsList)
}

let movies = GetMovie(); //variable qui contient le résultat de la recherche
const btnManagementOk = document.querySelector(".management-ok");
//Récupération des données de l'API 
async function GetMovie() {

    //Récupération des info du formulaire
    const genre_id = document.querySelector('#management-genres').value;
    const runtime = document.querySelector('#management-time').value;
    const keyword = document.querySelector('#management-keywords').value;
    const director_id = document.querySelector('#management-director').value;

    //test si le formulaire est vide
    if (runtime == "null" && genre_id == "null" && keyword == "" || director_id != "null")
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
        genre_url = "";
    else
        genre_url = "&with_genres=" + genre_id;

    //Gestion si le genre est saisi ou non
    if (director_id == "null")
        director_url = "";
    else
        director_url = "&with_crew=" + director_id;

    //Gestion de la recherche avec des keywords
    if (keyword == "")
        keyword_url = "";
    else
    {
        keyword_url = "&with_keywords=";
        GetKeywordsLike(keyword);
        keywordsList.forEach(function(id) {
            keyword_url += id["id"] + ",";
            console.log("test")
        });
        //console.log(keyword_url)
    }
    
    const response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=9818ffc42e4d1dce5ea069594a161d22&sort-by=popularity.desc&page="+page+genre_url+runtime_url+director_url+keyword_url);
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

let numero = 1; //pour identifier les 3 films de l'accueil
const btnOtherMovie = document.querySelector(".btnOtherMovie");
//Selection de 3 films aléatoire
const SelectMovie = () => {

    let nbAleatoire = []; //Tableau de nombres aléatoires différents

    while(nbAleatoire.length != 3)//Tant qu'il n'y a pas 3 identifiants de films
    {
        nb = Math.floor(Math.random() * 20);//Nombre aléatoire entre 1 et 20

        if (nbAleatoire.indexOf(nb) < 0)//Si l'identifiant ne fait pas déjà partie du tableau
        {
            nbAleatoire.push(nb);
        }
    }

    numero = 1;//remise à 1 à chaque nouvelle sélection

    //appel de l'affichage
    nbAleatoire.forEach(function(i){
        ShowMovie(movies[i]);
        numero++;
    });
}
btnOtherMovie.addEventListener('click', GetMovie); //genère d'autres films

//Info générale de la liste de film affichée sur la page principale
const ShowMovie = (movie) => {

    currentMovie = document.querySelector("#movie-"+numero);
    currentMovie.querySelector(".title").innerHTML = movie["title"];
    currentMovie.querySelector(".date").innerHTML = movie["release_date"];
    currentMovie.querySelector(".poster-movie").src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];
    currentMovie.querySelector(".poster-movie").id = movie["id"];
    currentMovie.querySelector(".runtime").innerHTML = movie["runtime"] + ' min';
    
    //Permet de cliquer sur chacun des films affichés
    const btnMovies = document.querySelectorAll('.poster-movie');
    btnMovies.forEach(function(i){
        i.addEventListener('click', GetInfoMovie);
        i.style.cursor = "pointer";
    });
}

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
    document.querySelector(".home-page").classList.add("hide");
    document.querySelector(".info-movie").classList.remove("hide");
}
document.querySelector(".btnBack").addEventListener('click', function(){
    document.querySelector(".home-page").classList.remove("hide");
    document.querySelector(".info-movie").classList.add("hide");
});


const infoHTML = document.querySelector(".info-movie");
const backdropHTML = document.querySelector(".backdrop");
const backdropInsideHTML = document.querySelector(".backdrop-inside");
const listActor = document.querySelector(".listActor");
//Affichage des informations précises sur le film passée en paramètre
const ShowInfoMovie = (movie) => {

    //titre
    title = infoHTML.querySelector(".title");
    title.innerHTML = movie["title"];

    //date
    date = infoHTML.querySelector(".date");
    date.innerHTML = movie["release_date"];

    //durée en minutes
    runtime = infoHTML.querySelector(".runtime");
    runtime.innerHTML = movie["runtime"] + ' min';

    //poster
    poster = infoHTML.querySelector(".poster");
    poster.src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];

    //phrase d'accroche
    description = infoHTML.querySelector(".tagline");
    description.innerHTML = movie["tagline"];
   
    //liste de genres
    genre = infoHTML.querySelector(".genres");
    genre.innerHTML = null; //évite d'ajouter les genres à une liste de genre déjà présente
    movie["genres"].forEach(function(i){
        li_genre = document.createElement("li");//a chaque genre on ajoute un li
        li_genre.innerHTML = i["name"];
        genre.appendChild(li_genre);
    });

    //description
    description = infoHTML.querySelector(".description");
    description.innerHTML = movie["overwiew"];
    
    //vote moyenne en pourcentage
    vote_average = document.querySelector(".vote_average");
    vote_average.innerHTML = movie["vote_average"]*10 + '%';

    //Sociétés de Production
    companie = document.querySelector(".companies");
    companie.innerHTML = null; //évite d'ajouter les sociétés à une liste de sociétés déjà présente
    movie["production_companies"].forEach(function(i){
        li_companie = document.createElement("li");//a chaque société on ajoute un li
        li_companie.innerHTML = i["name"];
        if (i["logo_path"] != null)//si il n'y a pas de lien pour le logo on ne demande pas d'afficher
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

//Récupère la liste des acteurs du film passé en paramètre (+les réalisateurs)
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

    //liste de keywords
    li = document.createElement("li");//a chaque keyword on ajoute un li
    li.innerHTML = keyword["name"];
    listKeyword.appendChild(li);
}

