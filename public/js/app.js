(function () {
	var app = angular.module('App', ['ngAnimate']);
	app.controller('MainCtrl', function ($scope, $http, $q) {

		$scope.loader =  true;

		$scope.generate = function () {
			$scope.loader =  true;
			generate()
				.then(function (response) {
					setup();
				}).catch(function (response) {
					alert("Request error")
				});
		}

		function generate () {
			var defer = $q.defer();
			$http.get('/api/generate').then(function (response) {
					defer.resolve(response);
				}, function (response) {
					defer.reject('Failed to get data. ' + response);
				});
			return defer.promise;
		}

		/**
		 * HTTP request to API
		 */
		function request () {
			var defer = $q.defer();
			$http.get('/api/index').then(function (response) {
					defer.resolve(response);
				}, function (response) {
					defer.reject('Failed to get data. ' + response);
				});
			return defer.promise;
		};

		/**
		 *  Setup request
		 */
		function setup () {
			request()
				.then(function (response) {
					var data = response.data;
					pivotUI(data);
				}).catch(function (response) {
					alert("Request error")
				});
		}

		/**
		 * Pivot Init
		 */
		function pivotUI (data) {
			$("#output").pivotUI(
		    data, {
	        rows: ["product"],
	        cols: ["os"],
		    }, true, "en"
			);
			$scope.loader = false;
		}

		setup();

	});
})();
