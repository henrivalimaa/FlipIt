'use strict';

angular.module('flipIt.views.store', [])
.component('storeView', {
  templateUrl: 'views/store/store.view.html',
  controller: StoreViewController
});

StoreViewController.$inject = [];

function StoreViewController() {
	var ctrl = this;
};