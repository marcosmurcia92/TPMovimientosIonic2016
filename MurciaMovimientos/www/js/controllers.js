angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,$ionicPlatform, $timeout, UsuarioMovimiento) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

$scope.UsuarioMovimiento = UsuarioMovimiento;

$ionicPlatform.registerBackButtonAction(function (event) {
    navigator.app.exitApp(); //<-- remove this line to disable the exit
  }, 100);

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.login();
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    UsuarioMovimiento.login($scope.loginData.username);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 500);
  };
})

.controller('AuthorCtrl', function($scope) {

})

.controller('AccelCtrl', function($scope,$timeout,$ionicPlatform,$cordovaDeviceMotion,$cordovaMedia,$cordovaFile,UsuarioMovimiento) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    var parSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/parSound.wav";
    var babSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/babSound.wav";
    var barSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/barSound.wav";
    var derSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/derSound.wav";
    var izqSrc = cordova.file.externalApplicationStorageDirectory+"files/"+UsuarioMovimiento.getName()+"/izqSound.wav";
  
    var parMedia = $cordovaMedia.newMedia(parSrc);
    var babMedia = $cordovaMedia.newMedia(babSrc);
    var barMedia = $cordovaMedia.newMedia(barSrc);
    var derMedia = $cordovaMedia.newMedia(derSrc);
    var izqMedia = $cordovaMedia.newMedia(izqSrc);

    $scope.options = { 
      frequency: 100, // Measure every 100ms
      deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
    };

    $scope.measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
    }

    // Watcher object
    $scope.watch = null;

    $scope.derClass = "fhm_img";
    $scope.izqClass = "fhm_img";
    $scope.parClass = "fhm_img";
    $scope.barClass = "fhm_img";
    $scope.babClass = "fhm_img";

    $scope.$on('$ionicView.enter', function(e) {
      $scope.startWatching();
    });

    $scope.GrabarSonido = function(id){
      switch(id) {
          case "parado":
              $timeout(function () {
                  parMedia.startRecording();
                  $timeout(function(){
                      parMedia.stopRecording();
                  },1000);
              }, 500);
              break;
          case "bocaarriba":
              $timeout(function () {
                  barMedia.startRecording();
                  $timeout(function(){
                      barMedia.stopRecording();
                  },1000);
              }, 500);
              break;
          case "bocaabajo":
              $timeout(function () {
                  babMedia.startRecording();
                  $timeout(function(){
                      babMedia.stopRecording();
                  },1000);
              }, 500);

              break;
          case "derecha":
              $timeout(function () {
                  derMedia.startRecording();
                  $timeout(function(){
                      derMedia.stopRecording();
                  },1000);
              }, 500);
              break;
          case "izquierda":
              $timeout(function () {
                  izqMedia.startRecording();
                  $timeout(function(){
                      izqMedia.stopRecording();
                  },1000);
              }, 500);
              break;
      }
    }

    $scope.startWatching = function() {
        // Device motion configuration
        $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
     
        // Device motion initilaization
        $scope.watch.then(null, function(error) {
            console.log('Error: ' + error);
        },function(result) {
     
            // Set current data  
            // $scope.measurements.x = result.x;
            // $scope.measurements.y = result.y;
            // $scope.measurements.z = result.z;


            if(result.z > 2){
              //BOCA ARRIBA (DEPENDE DE OTRA INCLINACION)
              $scope.measurements.z = 1;
            }else if(result.z < -2){
              //BOCA ABAJO
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_img";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_imgOn";
              $scope.measurements.z = -1;
            }else{
              //PARADO
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_imgOn";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_img";
              $scope.measurements.z = 0;
            }

            if(result.x > 2){
              $scope.measurements.x = 1;
            }else if(result.x < -2){
              $scope.measurements.x = -1;
            }else{
              $scope.measurements.x = 0;
            }

            if(result.y > 2){
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_imgOn";
              $scope.parClass = "fhm_img";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_img";
              $scope.measurements.y = 1;
            }else if(result.y < -2){
              $scope.derClass = "fhm_imgOn";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_img";
              $scope.barClass = "fhm_img";
              $scope.babClass = "fhm_img";
              $scope.measurements.y = -1;
            }else{
              $scope.derClass = "fhm_img";
              $scope.izqClass = "fhm_img";
              $scope.parClass = "fhm_img";
              $scope.barClass = "fhm_imgOn";
              $scope.babClass = "fhm_img";
              $scope.measurements.y = 0;
            }

            //PARADO

            $scope.measurements.timestamp = result.timestamp; 
     
        });     
    };  

    $scope.stopWatching = function() {  
        $scope.watch.clearWatch();
    }  

    $scope.$on('$ionicView.beforeLeave', function(){
        $scope.watch.clearWatch(); // Turn off motion detection watcher
    }); 
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
