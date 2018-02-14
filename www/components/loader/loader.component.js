'use strict';

angular.module('flipIt.components.loader', [])
.component('loader', {
  templateUrl: 'components/loader/loader.template.html',
  controller: LoaderController
});

LoaderController.$inject = [];

function LoaderController() {
	var ctrl = this;
}