'use strict';

 var app = angular.module('sample', [
  'ionic',
  'ngRoute',
  'ui.router',
  'sample.views.game',
  'sample.views.home',
  'sample.views.leaderboards',
  'sample.components.game',
  'sample.components.mainMenu',
  'sample.components.profileMenu'
])

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
      url: '/home',
      component: 'homeView'
    })

    $stateProvider.state('game', {
      resolve: {
        user: getCurrentUser
      },
      url: '/game',
      component: 'gameView'
    })

    $stateProvider.state('leaderboards', {
      resolve: {
        user: getCurrentUser
      },
      url: '/leaderboards',
      component: 'leaderboardsView'
    })

    /**
     * [getCurrentUser description]
     * @return {[type]} [description]
     */
    function getCurrentUser () {
      gapi.client.load('plus','v1', function () {
        var request = gapi.client.plus.people.get({
          userId: 'me'
        });

        request.execute(function(response) {
            if (response.code === 403) return;
            else return response;
        });
      });
    }
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/**
 * [signinCallback description]
 * @param  {[type]} auth [description]
 * @return {[type]}      [description]
 */
var signinCallback = function(auth) {
  if (auth && auth.error == null) {
  console.log(auth);
    _loadClient();
  } else {
    if (auth && auth.hasOwnProperty('error')) {
      console.log('Login failed because: ', auth.error);
    }
  }

  function _loadClient() {
    gapi.client.load('games','v1',function (response) {
      console.log(response);
    });

    gapi.client.load('plus','v1', function () {
      var request = gapi.client.plus.people.get({
        userId: 'me'
      });

      request.execute(function(response) {
        console.log(response);
      });
    });
  }
}
