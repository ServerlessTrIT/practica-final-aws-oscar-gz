var movies = [];
var movie_detail = [];

/***********************************
               API
************************************/

const API_KEY="7e7RBCFbof3ayxrTEI6Wd59Ev1uTuBVTabhgDjlJ"
const API_URL = "https://ii04dyu67k.execute-api.eu-central-1.amazonaws.com/dev/";
const API_LOGIN = API_URL+"login";
const API_SIGNUP = API_URL+"signup";
const API_CONFIRMSIGNUP = API_URL+"confirm_signup";
const API_MOVIES = API_URL+"movies";

/* USERS */
function signup(event){
  console.log("signup");
  event.preventDefault();
  $.ajax({
    url: API_SIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    //$("div[id='msg']").text(resp.message);
    goTo('/confirmsignup');
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return true;
}

function confirmSignup(){
  console.log("confirmsignup");
  event.preventDefault();
  $.ajax({
    url: API_CONFIRMSIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "code":$("input[id='code']").val()
    })
  }).done(function(resp){
    alert_message(resp.message);
    setTimeout(function(){
      goTo('/login');
    }, 3000);
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return false;
}

function login(event){
  console.log("login");
  event.preventDefault();
  
  $.ajax({
    url: API_LOGIN,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    localStorage.setItem('token', resp.token);
    alert_message('Bienvenid@ al videoclub online');
    goTo("/");
  }).fail(function(error){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Credenciales incorrectas");
  });
  
  return false;
}

/* MOVIES */

/* Listar */
function getMovies(){
  console.log("getMovies");
  //event.preventDefault();
  
  $.ajax({
    url: API_MOVIES,
    method: "GET",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    }
  }).done(function(resp){
    movies=resp.items;
    goTo("/movies");
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

/* Detalle película */
function getMovieId(){
  console.log("getMovieId");
  event.preventDefault();
  code = $(this).data('id');
  console.log(code);
  $.ajax({
    url: API_MOVIES + '/' + code,
    method: "GET",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    }
  }).done(function(resp){
    movie_detail=resp.item;
    goTo("/updatemovie");
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

/* Crear */
function putMovie(){
  console.log("putMovie");
  event.preventDefault();
  
  $.ajax({
    url: API_MOVIES,
    method: "PUT",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "code":$("input[id='code']").val(),
      "title":$("input[id='title']").val(),
      "genre":$("input[id='genre']").val()
    })
  }).done(function(resp){
    alert_message('Película creada con éxito');
    getMovies(); //actualizar listado de peliculas
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

/* Actualizar */
function postMovie(){
  console.log("postMovie");
  event.preventDefault();
  var code = $("input[id='code']").val();
  $.ajax({
    url: API_MOVIES + '/' + code,
    method: "POST",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "title":$("input[id='title']").val(),
      "genre":$("input[id='genre']").val()
    })
  }).done(function(resp){
    alert_message('Película actualizada con éxito');
    getMovies(); //actualizar listado de peliculas
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

/* Eliminar */
function deleteMovie(event){
  console.log("deleteMovie");
  event.preventDefault();
  code = $(this).attr('id').split("_")[1];
  console.log(code);
  $.ajax({
    url: API_MOVIES,
    method: "DELETE",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "code":code
    })
  }).done(function(resp){
    alert_message('Película eliminado correctamente');
    getMovies(); //actualizar listado de peliculas
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    alert_message('Se ha producido un error', true);
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

/***********************************
      VISTAS Y RENDERIZACIÓN
************************************/
function loginPage(){
  content ='<h1>Login</h1><br/><div id="msg"></div><br/><form id="formLogin"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button class="btn btn-primary" type="submit" value="Enviar" id="btnLogin">Enviar</button></form>';
  return content;
}

function signupPage(){
  content ='<h1>Registro</h1><br/><div id="msg"></div><br/><form id="formSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button class="btn btn-primary" type="submit" id="btnSignup">Enviar</button></form>';
  return content;
}
function confirmSignupPage(){
  content ='<h1>Confirmar e-mail</h1><br/><div id="msg"></div><br/><form id="formConfirmSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="text" name="code" id="code" placeholder="Código"><button class="btn btn-primary" type="submit"  id="btnConfirmSignup">Enviar</button></form>';
  return content;
}

function  newMoviePage(){
  content='<div class="col-12"><h1>Nueva película</h1></div>';
  content+='<div class="col-12"><form id="formMovie" class="form-inline"><input type="text" class="form-control" name="code" placeholder="Código" id="code"><input type="text" class="form-control" name="title" id="title" placeholder="Título"><input type="text" class="form-control" name="genre" id="genre" placeholder="Género"><button class="btn btn-primary" type="submit" value="Enviar" id="btnNewMovie">Enviar</button></form></div>';
  return content;
}

function  updateMoviePage(){
  console.log(movie_detail);
  content = '<div class="col-12"><h1>Editar película</h1></div>';
  content += '<div class="col-12"><form class="form-inline" id="formMovie"><div class="form-group"><input type="text" class="form-control" name="code" placeholder="Código" id="code" value="'+movie_detail.code+'" readonly></div><div class="form-group"><input type="text" class="form-control" name="title" id="title" placeholder="Título" value="'+movie_detail.title+'"></div><div class="form-group"><input type="text" class="form-control" name="genre" id="genre" placeholder="Género" value="'+movie_detail.genre+'"></div><button class="btn btn-primary" type="submit" value="Enviar" id="btnUpdateMovie">Actualizar</button></form></div>';
  return content;
}

function moviesPage(){
  content = '<div class="col-12"><h1>Películas</h1></div>';
  content += '<div class="col-12"><button class="btn btn-primary" id="linkNewMovie">Nueva película</button></div>';
  content += '<div class="col-12"><table class="table" border="1"><tr><th>Código</th><th>Título</th><th>Género</th><th>Acciones</th></tr>';
  for (i = 0; i< movies.length; i++){
    content+='<tr><td>'+movies[i].code+'</td><td>'+movies[i].title+'</td><td>'+movies[i].genre+'</td><td><button class="btn btn-primary btn-sm" id="code_'+movies[i].code+'">Eliminar</button><button class="btn btn-primary btn-sm" id="btnGetMovieId" data-id="'+movies[i].code+'">Editar</button></td></tr>';
  }
  content+='</table></div>'
  return content;
}

function renderApp() {
  /* MENÚ */
  var li_movies = document.getElementById('li_movies');
  var li_login = document.getElementById('li_login');
  var li_logout = document.getElementById('li_logout');
  var li_signup = document.getElementById('li_signup');
  if (localStorage.getItem('token')===null){
    li_movies.style.display = 'none';
    li_logout.style.display = 'none';
    li_login.style.display = 'block';
    li_signup.style.display = 'block';
  }else{
    li_movies.style.display = 'block';
    li_logout.style.display = 'block';
    li_login.style.display = 'none';
    li_signup.style.display = 'none';
  }

/* CARGAR VISTAS */
  var content;
  if (window.location.pathname === '/movies') {
    content = moviesPage();
  } else if (window.location.pathname === '/newmovie') {
    content = newMoviePage();
  } else if (window.location.pathname === '/updatemovie') {
    content = updateMoviePage();
  } else if (window.location.pathname === '/') {
    content = '<h1>¡Bienvenid@!</h1>';
  } else if(window.location.pathname === '/login'){
    content = loginPage();
  }else if(window.location.pathname === '/signup'){
    content = signupPage();
  }else if(window.location.pathname ==='/confirmsignup'){
    content=confirmSignupPage();
  }else if(window.location.pathname ==='/logout'){
    localStorage.removeItem('token');
    content = '<h1>¡Hasta pronto!</h1>';
    goTo("/");
  }
  var main = document.getElementsByTagName('main')[0];
  main.innerHTML = content;
}

/***********************************
             NAVEGACIÓN
************************************/
function navigate(evt) {
  evt.preventDefault();
  console.log(evt);
  var href = evt.target.getAttribute('href');
  if(href==='/movies'){
    getMovies();
  }
  window.history.pushState({}, undefined, href);
  renderApp();
}

function goTo(path) {
  window.history.pushState({}, undefined, path);
  renderApp();
}

function newMovie(event){
  goTo('/newmovie');
}

/* Mostrar mensaje en la pantalla */
function alert_message(message, is_error = false){
  var class_name = 'alert-success';
  if(is_error){
    class_name = 'alert-danger'
  }

  var content_alert = '<div class="alert '+class_name+' alert-dismissible fade show" role="alert">'+message+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'

  $('#alert_message').html(content_alert);

  setTimeout(function(){
    $('#alert_message').html('');
  }, 3000);
}


/***********************************
          INICIALIZACIÓN
************************************/
$(document).ready(init);

function init(){
  $("nav").click(navigate);
  $("body").on("click","form button[id='btnLogin']",login);
  $("body").on("click","form button[id='btnSignup']",signup);
  $("body").on("click","form button[id='btnConfirmSignup']",confirmSignup);
  $("body").on("click","button[id^='code']",deleteMovie);
  $("body").on("click","button[id='btnGetMovieId']",getMovieId);
  $("body").on("click","button[id='linkNewMovie']",newMovie);
  $("body").on("click","form button[id='btnNewMovie']",putMovie);
  $("body").on("click","form button[id='btnUpdateMovie']",postMovie);
  renderApp();
}