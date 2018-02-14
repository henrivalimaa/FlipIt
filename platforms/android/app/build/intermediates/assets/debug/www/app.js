'use strict';

 var app = angular.module('flipIt', [
  'ionic',
  'ngRoute',
  'ui.router',
  'flipIt.views.game',
  'flipIt.views.home',
  'flipIt.views.store',
  'flipIt.views.settings',
  'flipIt.views.profile',
  'flipIt.views.leaderboards',
  'flipIt.components.game',
  'flipIt.components.loader',
  'flipIt.components.mainMenu',
  'flipIt.components.profile'
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

    $stateProvider.state('settings', {
      url: '/settings',
      component: 'settingsView'
    })

    $stateProvider.state('profile', {
      url: '/profile',
      component: 'profileView'
    })

    $stateProvider.state('store', {
      url: '/store',
      component: 'storeView'
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
      /*
      window.plugins.playGamesServices.showPlayer(function (player) {
        return player;
      });
      */
     return;
    }
});

app.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {

    // Google auth
    window.plugins.playGamesServices.auth(function (response) {
      $rootScope.userIsAuthenticated = true;
      $state.reload();
    });

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
