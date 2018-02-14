'use strict';

angular.module('flipIt.views.settings', [])
.component('settingsView', {
  templateUrl: 'views/settings/settings.view.html',
  controller: SettingsViewController
});

SettingsViewController.$inject = [];

function SettingsViewController() {
	var ctrl = this;
};