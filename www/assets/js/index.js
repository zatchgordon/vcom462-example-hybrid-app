;(function($, window, undefined) {

	'use strict';

	var app = (function() {
		var pub = {};

		//toggle this to switch between running in browser and running in simulator/device
		pub.localDev = true; //true = browser; false = device/simulator

		//our forecast.io api information
		var apiUrl = 'https://api.forecast.io/forecast/';
		var apiKey = '[YOUR API KEY HERE]';

		pub.coords = {
			latitude: '[default longitude here]',
			longitude: '[default latitude here]'
		};

		pub.init = function init() {
			bindEvents();

			startUp();
		};

		//get initial values for geolocation, etc.
		function startUp() {
			if(!app.localDev) {
				navigator
					.geolocation
					.getCurrentPosition(
						geolocationSuccess,
						geolocationError
					)
				;
			} else {
				getWeather();
			}
		}

		//geolocation was successful
		function geolocationSuccess(position) {
			app.coords.latitude = position.coords.latitude;
			app.coords.longitude = position.coords.longitude;

			//we need a callback function
			//here to trigger anything that uses our coordinates
			getWeather();
		}

		function getWeather() {
			var url = apiUrl + apiKey + '/' + app.coords.latitude + ',' + app.coords.longitude;

			var response = $.ajax({
				url: url
			});

			response.done(function(data) {
				console.log(data);
			});
		}

		//geolocation failed
		function geolocationError() {
			alert('We could not locate you.');
		}

		function bindEvents() {
			$('.page').hammer()
				.bind('swipeleft', swipeLeftHandler)
				.bind('swiperight', swipeRightHandler)
			;
		}

		function swipeLeftHandler(e) {
			//make sure there is a page with .right
			//figure out which page is active (does not have .left or .right)
			//add .left to current page
			//remove .right from next page
			if($('.page.right').length) {
				var $activePage = $('.page').not('.right, .left');
				var $nextPage = $activePage.next('.page');

				$activePage.addClass('left');
				$nextPage.removeClass('right');
			}
		}

		function swipeRightHandler(e) {
			if($('.page.left').length) {
				var $activePage = $('.page').not('.left, .right');
				var $prevPage = $activePage.prev('.page');

				$activePage.addClass('right');
				$prevPage.removeClass('left');
			}
		}

		return pub;
	}());


	$(document).ready(function() {
		app.init();
	});

	$(window).load(function() {
		//if you have any methods that need a fully loaded window, trigger them here
	});


})(window.jQuery, window);