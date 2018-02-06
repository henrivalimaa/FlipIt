'use strict';

angular.module('sample.components.profileMenu', [])
.component('profileMenu', {
  bindings: {
  	user: '<'
  },
  templateUrl: 'components/profile-menu/profile-menu.template.html',
  controller: ProfileMenuController
});

ProfileMenuController.$inject = [];

function ProfileMenuController() {
	var ctrl = this;

	ctrl.$onInit = function () {
		/*
		gapi.client.load('plus','v1', function () {
			var request = gapi.client.plus.people.get({
				userId: 'me'
			});

			request.execute(function(response) {
				ctrl.user = response;
			});
		});

		*/

		// console.log(ctrl.user);
	}
}