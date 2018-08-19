angular.module('photosFlickrApp')

.controller('AppCtrl', function($scope) {
  $scope.titulo='Flickr Api';
})

.controller('PreferenciasCtrl', function($rootScope, $scope, $translate) {
  $scope.cambiarFecha = function (){
    $rootScope.preferencias.dirDate = false; 
  };
  $scope.cambiarNombre =  function (){
    $rootScope.preferencias.dirName = false; 
  };
  $scope.cambiarIdiomaEs = function (){
    $rootScope.preferencias.en = false;
    $translate.use('es'); 
  };
  $scope.cambiarIdiomaEn =  function (){
    $rootScope.preferencias.es= false;
    $translate.use('en'); 
  };
})

.controller('DirectoriosCtrl', function($scope,$ionicLoading, $rootScope, $ionicPopup, photosSvc, conexion) {
  $scope.userNameSearch= '';

  function showAlertUserNotFound() {
    var alertPopup = $ionicPopup.alert({
      title: 'Usuario No Encontrado',
      template: 'Intente con otro nombre'
    });
    alertPopup.then(function(res) {
    });
  };


  function showAlertUserNotHaveDirectories() {
    var alertPopup = $ionicPopup.alert({
      title: 'Usuario Sin Directorios',
      template: 'No hay nada para mostrar'
    });
    alertPopup.then(function(res) {
    });
  };
  
  
  $scope.startList= function(){
    showIonicLoading()
    .then($scope.cargarDirectorios)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  }
  
  $scope.search = function(userNameSearch){
    $scope.userNameSearch=userNameSearch;
    showIonicLoading()
    .then(buscarUsuario)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  };

  function showIonicLoading() {
    return $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
    });
  };

  function buscarUsuario(){
    photosSvc.getUser($scope.userNameSearch).then(function(data){
      if (data.stat == 'fail') {
        showAlertUserNotFound();
      }else{
        window.localStorage.setItem('UserID' , JSON.stringify(data.user.id));
        window.localStorage.setItem('UserName' , JSON.stringify(data.user.username._content));
        $scope.cargarDirectorios();
      }
    });
  };

  $scope.cargarDirectorios = function(){
    if(conexion.online()){
      return photosSvc.getDirectorios(JSON.parse(window.localStorage.getItem('UserID'))).then(function(directorios){
        var array = [directorios];
        if(array[0].length == 0){
          showAlertUserNotHaveDirectories();
        }
        window.localStorage.setItem('Directorios' , JSON.stringify(directorios));
        $scope.directorios = directorios;
        
      });
    }else{
      cordova.plugins.notification.local.schedule({
        id: 1,
        text: 'Lista de directorios no actualizada.',
        title: 'FlickrApi',
        icon: 'icon'
      });
      $scope.directorios =JSON.parse(window.localStorage.getItem('Directorios'));
    }
  };

  $scope.startList();
})

.controller('DirectorioCtrl', function($scope, $stateParams, $ionicLoading, photosSvc, conexion, $rootScope) {
  $scope.cargarPhotos = function(){
    if(conexion.online()){  
      return photosSvc.getDirectorio($stateParams.id,JSON.parse(window.localStorage.getItem('UserID'))).then(function(photos){
        var clave = 'Directorio' + $stateParams.id;
        window.localStorage.setItem(clave, JSON.stringify(photos));
        $scope.photos = photos;
      });     
    }else{
      cordova.plugins.notification.local.schedule({
        id: 1,
        text: 'Lista de fotos no actualizada.',
        title: 'FlickrApi',
        icon: 'icon'
      });
      var clave = 'Directorio' + $stateParams.id;
      $scope.photos =JSON.parse(window.localStorage.getItem(clave));
    }
  };

  if($stateParams.id){
    $scope.titulo=$stateParams.title;
    showIonicLoading()
    .then($scope.cargarPhotos)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  }

  function showIonicLoading() {
    return $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
    });
  };
})

.controller('PhotoCtrl', function($scope, $stateParams,  $ionicLoading, photosSvc) {
  if($stateParams.id){
    $scope.titulo=$stateParams.title;
    showIonicLoading()
    .then(cargarPhoto)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  }

  function showIonicLoading() {
    return $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
    });
  };
  function cargarPhoto(){
    return photosSvc.getPhoto($stateParams.id).then(function(photo){
      $scope.photo=photo;
    });
  };
})

.controller('ComentariosCtrl',function($scope, $stateParams,  $ionicLoading, photosSvc){

  if($stateParams.id){
    showIonicLoading()
    .then(cargarComentarios)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  }

  function showIonicLoading() {
    return $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
    });
  };

  function cargarComentarios(){
    return photosSvc.getComentarios($stateParams.id).then(function(comentarios){
      $scope.comentarios = comentarios;
    });
  };

})

.controller('CompartirFotoCtrl', function($scope, $stateParams,  $ionicLoading) {
  $scope.subject = 'FlickrApi - Photo Shared';
  $scope.email='';

  $scope.enviarEmail = function(email){
    $scope.email = email;
    showIonicLoading()
    .then(createUrl)
    .then(sendPhoto)
    .then($ionicLoading.hide)
    .catch($ionicLoading.hide);
  };

  function showIonicLoading() {
    return $ionicLoading.show({
      template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>'
    });
  };
  function createUrl(){
    $scope.urlToShare = 'https://farm'+ $stateParams.idFarm + '.staticflickr.com/' + 
    $stateParams.idServer + '/' + $stateParams.idPhoto + '_' + $stateParams.idSecret + '_c.jpg';
  };
  function sendPhoto(){
    window.plugins.socialsharing.shareViaEmail(
      $scope.urlToShare,  
      $scope.subject,
      $scope.email, 
      null,
      null, 
      [$scope.urlToShare], 
      null,
      function(success) {
        $scope.status = true;
      },
      function(error) {
        $scope.status = false;
      }
      );
  };
});