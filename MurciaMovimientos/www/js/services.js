angular.module('starter.services', [])

.factory('UsuarioMovimiento', [function(){
  var userName = '';
  var watch = null;

  return{
    login:function(user){
      userName = user;
    },
    getName:function(){
      return userName;
    },
    setWatch:function(accWatch){
      watch = accWatch;
    },
    getWatch:function(){
      return watch;
    }
  };
}])

.factory('BlankFactory', function() {
  
});
