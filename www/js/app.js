angular.module('photosFlickrApp', ['ionic', 'pascalprecht.translate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(function($rootScope){
  $rootScope.preferencias = {
    dirName: false,
    dirDate: false,
    photoName: false,
    es: true,
    en:false
  };
})

.run(function asegurarPermisosNotificaciones() {
  document.addEventListener('deviceReady', function() {
    cordova.plugins.notification.local.hasPermission(function(notificacionesPermitidas) {
      if (!notificacionesPermitidas) {
        cordova.plugins.notification.local.registerPermission();
      }
    });
  }, false);
})

.config(function($stateProvider, $urlRouterProvider,$translateProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.bienvenido' , {
    url: '/bienvenido' ,
    views: {
      'menuContent': {
        templateUrl: 'templates/bienvenido.html'
      }
    }
  })
  .state('app.preferencias', {
    url: '/Preferencias',
    views: {
      'menuContent': {
        templateUrl: 'templates/preferencias.html',
        controller: 'PreferenciasCtrl'
      }
    }
  })
  .state('app.directorios', {
    url: '/Directorios',
    views: {
      'menuContent': {
        templateUrl: 'templates/directorios.html',
        controller: 'DirectoriosCtrl'
      }
    }
  })
  .state('app.directorio', {
    url: '/Directorios/:id/:title',
    views: {
      'menuContent': {
        templateUrl: 'templates/directorio.html',
        controller: 'DirectorioCtrl'
      }
    }
  })
  .state('app.photo',{
    url: '/photo/:id/:title',
    views: {
      'menuContent': {
        templateUrl: 'templates/photo.html',
        controller: 'PhotoCtrl'
      }
    }
  })
  .state('app.comentarios',{
    url: '/comentarios/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/comentarios.html',
        controller: 'ComentariosCtrl'
      }
    }
  })
  .state('app.compartirFoto',{
    url: '/compartirFoto/:idFarm/:idServer/:idPhoto/:idSecret',
    views: {
      'menuContent': {
        templateUrl: 'templates/compartirFoto.html',
        controller: 'CompartirFotoCtrl'
      }
    }
  })
  .state('app.about', {
    url: '/About',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
      }
    }
  });

  $urlRouterProvider.otherwise('/app/bienvenido');

  $translateProvider.translations('es', {
    saludo: "Bienvenido",
    titulo_directorios: "Directorios",
    titulo_comentarios: "Comentarios",
    titulo_compartir: "Compartir Foto",
    titulo_preferencias: "Preferencias",
    placeholder_busqueda: "Buscar Usuario",
    fotos: "Fotos",
    menu_directorios: "Directorios",
    menu_preferencias: "Preferencias",
    menu_acerca_api: "Acerca FlickrApi",
    pref_ordenar_directorios: "Ordenar Directorios",
    pref_ordenar_por_nombre: "Nombre",
    pref_ordenar_directorios_fecha: "Fecha",
    pref_ordenar_fotos: "Ordenar Fotos",
    pref_lenguaje: "Idioma",
    pref_lenguaje_es: "Español",
    pref_lenguaje_en: "Inglés",
    acerca_subtitulo: "Descripción",
    acerca_desc: "Aplicacion híbrida que brinda la posibilidad de buscar usuarios de Flickr, visualizando cada uno de sus directorios con sus correspondientes fotos. Además permite ver comentarios en las mismas y compartirlas vía email. Otorga un sistema de  búsqueda basado en preferencias y posee soporte  internacional",
    acerca_autores: "Desarrolladores",
    acerca_carrera: "Ing. en Sistemas, UTN-FRC"
  });

  $translateProvider.translations('en', {
    saludo: "Welcome",
    titulo_directorios: "Directories",
    titulo_comentarios: "Comments",
    titulo_compartir: "Share Photo",
    titulo_preferencias: "Settings",
    placeholder_busqueda: "Search User",
    fotos: "Photos",
    menu_directorios: "Directories",
    menu_preferencias: "Settings",
    menu_acerca_api: "About FlickrApi",
    pref_ordenar_directorios: "Order Directories",
    pref_ordenar_por_nombre: "Name",
    pref_ordenar_directorios_fecha: "Date",
    pref_ordenar_fotos: "Order Photos",
    pref_lenguaje: "Languaje",
    pref_lenguaje_es: "Spanish",
    pref_lenguaje_en: "English",  
    acerca_subtitulo: "Description",
    acerca_desc: "Hybrid Application that offers search of Flickr users visualizing each of their photos and directories based on preferences. It also gives them the possibility to see the comments of the photos and share them by email. This application has international support.",
    acerca_autores: "Developers",
    acerca_carrera: "System Engineer, UTN-FRC"
  });

  $translateProvider.preferredLanguage("es");
  $translateProvider.fallbackLanguage("es");
})

.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.common = 'Content-Type: application/json';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
