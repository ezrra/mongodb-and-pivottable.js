(function () {
	var app = angular.module('App', ['ngAnimate']);
	app.controller('MainCtrl', function ($scope, $http, $q) {

		/**
		 * HTTP request to API
		 */
		function request () {
			var defer = $q.defer();
			$http.get('/api/data').then(function (response) {
					defer.resolve(response);
				}, function (response) {
					defer.reject('Failed to get data. ' + response);
				});
			return defer.promise;
		};

		request()
			.then(function (response) {
				var data = response.data;
				pivotUI(data);
			}).catch(function (response) {
				alert("Request error")
			});

		/**
		 * Pivot Init
		 */
		function pivotUI (data) {
			$("#output").pivotUI(
		    data, {
	        rows: ["DatabaseSource"],
	        cols: ["Product"],
		    }, false, "en"
			);
		}

	});
})();
