(function () {

	var app = angular.module('App', ['daterangepicker', 'ngAnimate']);

	app.controller('MainCtrl', function ($scope, $http, $q) {

		moment.locale('en');

		$scope.currentData = [];

		/**
		 * Directive manipulate DOM
		 */
		$scope.loader = false;
		$scope.dateRangePickerMsg = true;
		$scope.dateRangePickerInput = false;

		/**
		 * Construct directive daterangepicker
		 * @param startDate
		 * @prams endDate
		 */
		$scope.date = { startDate: moment().subtract(1, "days"), endDate: moment() };

		/**
		 * Days array is a global variable
		 */
		var days = [];

		var dates = [
			{ text: "Yesterday", endDate: moment().subtract(1, 'days').format("YYYY-MM-DD 23:59:59"), startDate: moment().subtract(1, 'days').format("YYYY-MM-DD 00:00:00"), data: [] },
			{ text: "7 days ago", endDate: moment().subtract(1, 'days').format("YYYY-MM-DD 23:59:59"), startDate: moment().subtract(7, 'days').format("YYYY-MM-DD 00:00:00"), data: [] },
			{ text: "14 days ago", endDate: moment().subtract(1, 'days').format("YYYY-MM-DD 23:59:59"), startDate: moment().subtract(13, 'days').format("YYYY-MM-DD 00:00:00"), data: [] },
			{ text: "30 days ago", endDate: moment().subtract(1, 'days').format("YYYY-MM-DD 23:59:59"), startDate: moment().subtract(29, 'days').format("YYYY-MM-DD 00:00:00"), data: [] }
		];

		/**
		 * First date of the dates range
		 */
		var startDate 		= moment(dates[dates.length - 1].startDate);

		/**
		 * Last date of the dates range
		 */
		var endDate 		= moment(dates[0].endDate);

		/**
		 * Array of days using startDate & endDate variables
		 */
		var daysArray 		= daysToArray(startDate, endDate);

		/**
		 * Length of the days array
		 */
		var daysArrayLength = daysArray.length;

		/**
		 * Settings options of moment.js
		 * @param locale texts
		 * @param ranges
		 */
		$scope.opts = {
      locale: {
          applyClass: 'btn-green',
          applyLabel: "Apply",
          fromLabel: "from",
          format: "YYYY-MM-DD",
          toLabel: "to",
          cancelLabel: 'Cancel',
          customRangeLabel: 'Range',
          "monthNames": ["January","February","March","April","May","June","July","August","September","October","November","December"
        ],
        "daysOfWeek": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      },
      ranges: {},
	  };

	    /**
	     * Return an array of dates between start date and end date
	     * @param startDate
	     * @param endDate
	     */
		function daysToArray (startDate, endDate) {

			var days 		= [],
				startDate = moment(startDate).subtract(1, 'days').format("YYYY-MM-DD"),
				endDate 	= moment(endDate).format("YYYY-MM-DD");

			while (startDate < endDate) {
				startDate = moment(startDate).add(1, 'day').format("YYYY-MM-DD");
				days.push(moment(startDate).format("YYYY-MM-DD"));
			}

			return days;
		}

		/**
		 * HTTP request to API
		 * @param startDate
		 * @param endDate
		 * @param callback
		 */
		function request (startDate, endDate, callback) {
			var dates = { startDate: startDate, endDate: endDate };
			var req = { method: 'GET', url: '/api/range', params: dates };
			$http(req).then(function (response) {
				callback(null, response)
			}, function (err) {
				callback(err, [])
			});
		};

		angular.forEach(daysArray, function (date, index) {
			request(date, date, function (err, response) {
				days.push({
					date: date,
					data: response.data,
				});
				if (index == daysArrayLength - 1) {
					setDates();
				}
			});
		});

		function setDates () {

			angular.forEach(dates, function (date, index) {
				angular.forEach(days, function (day, key) {
					if (moment(day.date).isBetween(date.startDate, date.endDate, null, '[]')) {
						angular.forEach(day.data, function (value) {
							dates[index].data.push(value)
						});
					}
				});

				if (index == 0) {
					$scope.currentData = {
						'text': date.text,
						'data': date.data,
						'startDate': date.startDate,
						'endDate': date.endDate
					}

					pivotUI();

					$scope.date = {
		        startDate: moment(date.startDate),
		        endDate: moment(date.endDate)
				  };
				};

				$scope.opts.ranges[date.text] = [date.startDate, date.endDate];
			})

			$scope.dateRangePickerMsg = false;
			$scope.dateRangePickerInput = true;
			watchDate();
		}

		function pivotUI () {
			$("#output").pivotUI(
		    $scope.currentData.data, {
	        rows: ["DatabaseSource"],
	        cols: [""],
		    }, false, "es"
			);
		}

    function watchDate () {
	    $scope.$watch('date', function(date) {
        var startDate 	= moment(date.startDate).format("YYYY-MM-DD 00:00:00");
        var endDate 	= moment(date.endDate).format("YYYY-MM-DD 23:59:59");
        var index 		= _.findKey(dates, { 'startDate': startDate, 'endDate': endDate });

        $scope.currentData = [];

        if (dates.length > 0 && dates[index]) {
        	$scope.currentData = {
						'text': dates[index].text,
						'data': dates[index].data,
						'startDate': dates[index].startDate,
						'endDate': dates[index].endDate
					}
        	$scope.currentData = dates[index];
        	pivotUI();
        }
	    }, false);
    }
	});

})();
