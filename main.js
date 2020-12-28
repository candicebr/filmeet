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

    /*
    genreOption = document.createElement("input");
    genreLabel = document.createElement("label");
    genreLabel.innerHTML = genre['name'];
    genreOption.name = genre['name'];
    genreOption.value = genre['id'];
    genreOption.type = "checkbox";
    management_genre.appendChild(genreOption);
    management_genre.appendChild(genreLabel);
*/

}

let keyword_id;
//Récupère les keywords similaires à la recherche
async function GetKeywordId(string) {
    const response = await fetch("https://api.themoviedb.org/3/search/keyword?api_key=9818ffc42e4d1dce5ea069594a161d22&query="+string+"&page=1");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    //si l'un des keywords correspond à la recherche, on récupère l'id
    body["results"].forEach(function(word) {
        if(word["name"] == string)
            keyword_id = word["id"];
    })
}

let urlList = {page: null,genre: null,director: null, runtime: null, keyword: null}; //Liste des différents champs de recherches
//Récupère les élements de recherche
const SearchMovie = () => {
    //Récupération des info du formulaire
    const genre_id = document.querySelector('#management-genres').value;
    const runtime = document.querySelector('#management-time').value;
    const keywordSearch = document.querySelector('#management-keywords').value;
    const director_id = document.querySelector('#management-director').value;

    //test si le formulaire est vide
    if (runtime == "null" && genre_id == "null" && keywordSearch == "" || director_id != "null")
        urlList["page"] = 1;//les plus populaires en ce moment
    else
        urlList["page"] = Math.floor(Math.random() * 10 + 1);//numero de page aléatoire

    //Gestion de la durée du film
    if (runtime == "null")
        urlList["runtime"] = "";
    else if (runtime == 181)
        urlList["runtime"] = "&with_runtime.gte=180";
    else
        urlList["runtime"] = "&with_runtime.lte=" + runtime;

    //Gestion si le genre est saisi ou non
    if (genre_id == "null")
        urlList["genre"] = "";
    else
        urlList["genre"] = "&with_genres=" + genre_id;

    //Gestion si le realisateur est saisi ou non
    if (director_id == "null")
        urlList["director"] = "";
    else
        urlList["director"] = "&with_crew=" + director_id;

    //Gestion de la recherche avec un mot-clé
    if (keywordSearch == "")
    {
        urlList["keyword"] = "";
        GetMovie(urlList);
    }
    else
    {
        GetKeywordId(keywordSearch).then(function(){
            urlList["keyword"] = "&with_keywords="+keyword_id;
            GetMovie(urlList);
        });
    }
}

//Evenement des boutons
document.querySelector(".management-ok").addEventListener('click', function(){movies = SearchMovie()}); //recherche
document.querySelector(".btnOtherMovie").addEventListener('click', function(){movies = SearchMovie()}); //genère d'autres films

let TaglineHover = document.querySelector(".tagline-hover");
let movies = SearchMovie(); //variable qui contient le résultat de la recherche
//Récupération des données de l'API 
async function GetMovie(urlList) {
    
    const response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=9818ffc42e4d1dce5ea069594a161d22&sort-by=popularity.desc&page="+urlList["page"]+urlList["genre"]+urlList["runtime"]+urlList["director"]+urlList["keyword"]);
    // above line fetches the response from the given API endpoint.
    const body = await response.json();

    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    if (body["total_pages"] != 0)
    {
        TaglineHover.innerHTML="...";
        movies = body["results"];
        SelectMovie();
    }
    else
    {
        TaglineHover.innerHTML="You are very picky, unfortunately we have nothing for you";
    }
    
}

let numero = 1; //pour identifier les 3 films de l'accueil
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

let index = 2;
//Recupère quelques info en plus des 3 films (runtime, genre, tagline)
async function GetALittleMoreInfo (id,currentMovieHTML) {
    const response = await fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=9818ffc42e4d1dce5ea069594a161d22&language=en-US");
    // above line fetches the response from the given API endpoint.
    const body = await response.json();
    
    try {
        console.log('success!', body);
    }
    catch(e) {
        console.log('some error happened' , e);
    }

    //tagline sur le hover
    currentMovieHTML.addEventListener('mouseover',function(){
        if ( body["tagline"] == "")
            TaglineHover.innerHTML = "...";
        else
            TaglineHover.innerHTML = body["tagline"];

        currentMovieHTML.style.zIndex = index;
        index++;
    });

    currentMovieHTML.querySelector(".runtime").innerHTML = body["runtime"] + ' min';
    //liste de genres
    currentMovieHTML.querySelector(".genres").innerHTML = null; //évite d'ajouter les genres à une liste de genre déjà présente
    body["genres"].forEach(function(i){
        li_genre = document.createElement("li");//a chaque genre on ajoute un li
        li_genre.innerHTML = i["name"];
        currentMovieHTML.querySelector(".genres").appendChild(li_genre);
    });
}

//Info générale de la liste de film affichée sur la page principale
const ShowMovie = (movie) => {

    currentMovieHTML = document.querySelector("#movie-"+numero);
    currentMovieHTML.querySelector(".title").innerHTML = movie["title"];
    currentMovieHTML.querySelector(".date").innerHTML = movie["release_date"];
    if(movie["poster_path"] != null)
        currentMovieHTML.querySelector(".poster-movie").src = "https://image.tmdb.org/t/p/w300" + movie["poster_path"];
    else
        currentMovieHTML.querySelector(".poster-movie").src = "icono/poster.png";
    currentMovieHTML.querySelector(".btnInfo").id = movie["id"];
    
    GetALittleMoreInfo(movie["id"],currentMovieHTML);

    //Permet de cliquer sur chacun des films affichés pour plus d'information
    const btnMovies = document.querySelectorAll('.btnInfo');
    btnMovies.forEach(function(i){
        i.addEventListener('click', GetInfoMovie);
        i.style.cursor = "pointer";
    });
}



/**************************Page du film avec toutes ses informations**************************/

vote_average = document.querySelector(".myBar");

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
    description.innerHTML = movie["overview"];
    
    //vote moyenne en pourcentage

    vote_average.style.width = `${movie['vote_average']*10}%`;
    vote_average.innerHTML = movie["vote_average"]*10 + '%';

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
        directing_name = document.createElement("p");
        directing.innerHTML = crew["job"];
        directing_name.innerHTML = crew["name"];
        directing.appendChild(directing_name);
        directors.appendChild(directing);
    }
    if (crew["department"] == "Writing")
    {
        writing = document.createElement("li");
        writing_name = document.createElement("p");
        writing.innerHTML = crew["job"];
        writing_name.innerHTML = crew["name"];
        writing.appendChild(writing_name);
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

