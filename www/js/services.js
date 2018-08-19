angular.module('photosFlickrApp')

.service('photosSvc', function($q, $http) {

	this.getUser = function(username) {
		var baseUrlGetUser = 'https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=e6a5895de708ab50982aa06a52d7e3ef&username='+ username +'&format=json&nojsoncallback=1'
		return $http.get(baseUrlGetUser).then(function(respuesta) {
			return _.cloneDeep(respuesta.data);
		});
	};

	this.getDirectorios = function(id) {
		var baseUrlGetList = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=e6a5895de708ab50982aa06a52d7e3ef&user_id='+ id +'&format=json&nojsoncallback=1';
		return $http.get(baseUrlGetList).then(function(respuesta) {
			if(respuesta.data.stat == 'ok'){
				return _.cloneDeep(respuesta.data.photosets.photoset);	
			}
		});
	};
	
	this.getDirectorio = function(id,userId) {
		var baseUrlGetPhotos = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=e6a5895de708ab50982aa06a52d7e3ef&photoset_id='+ id +'&user_id='+ userId +'&format=json&nojsoncallback=1';
		return $http.get(baseUrlGetPhotos).then(function(respuesta) {
			return _.cloneDeep(respuesta.data.photoset.photo);
		});
	};

	this.getPhoto = function(id) {
		var baseUrlGetPhoto = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=e6a5895de708ab50982aa06a52d7e3ef&photo_id='+ id + '&format=json&nojsoncallback=1';
		return $http.get(baseUrlGetPhoto).then(function(respuesta) {
			return _.cloneDeep(respuesta.data.photo);
		});
	};

	this.getComentarios = function(id){
		var baseUrlGetComments = 'https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=e6a5895de708ab50982aa06a52d7e3ef&photo_id='+ id + '&format=json&nojsoncallback=1'
		return $http.get(baseUrlGetComments).then(function(respuesta){
			return _.cloneDeep(respuesta.data.comments.comment);
		});
	};
})

.service('conexion', function($rootScope) {
	 
	    function cambiarEstado(online) {
		      $rootScope.$apply(function() {
			        $rootScope.online = online;
		      });
	    }
	
	    this.online = function() {
		      return $rootScope.online;
	    };
	 
	    $rootScope.online = navigator.onLine?navigator.onLine:navigator.connection.type != "none";
	    document.addEventListener("online", function() { cambiarEstado(true); }, false);
	    document.addEventListener("offline", function() { cambiarEstado(false); }, false);
 });
