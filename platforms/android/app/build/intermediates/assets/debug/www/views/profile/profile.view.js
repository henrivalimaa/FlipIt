'use strict';

angular.module('flipIt.views.profile', [])
.component('profileView', {
  templateUrl: 'views/profile/profile.view.html',
  controller: ProfileViewController
});

ProfileViewController.$inject = [];

function ProfileViewController() {
	var ctrl = this;
};