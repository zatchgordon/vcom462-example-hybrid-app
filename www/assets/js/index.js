;(function($, window, undefined) {

	'use strict';

	var app = (function() {
		var pub = {};

		//toggle this to switch between running in browser and running in simulator/device
		pub.localDev = false; //true = browser; false = device/simulator

		//our forecast.io api information
		var apiUrl = 'https://api.forecast.io/forecast/';
		var apiKey = 'c4729aeb0be8a11d9a75ba13f9a86e0c';

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
				//PAGE ONE
				var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

				var actual = Math.round(data['currently']['temperature']);
				var feelsLike = Math.round(data['currently']['apparentTemperature']);
				var icon=data['currently']['icon'];

					$('#feels').html('Feels like');
				
					$("#tempRow").html("<span id='feelsLike'>"+ feelsLike + "\xB0 </span>");
				
				$("#wethIcon").html("<img id='icon' src='assets/img/weather/"+ icon +"_big.png'>");

				

				switch (icon){
					case 'partly-cloudy-night':
						$('#page-one, #page-two, #page-three').css( "background", "#6b598c" );
						break;
					case 'partly-cloudy-day':
						$('#page-one, #page-two, #page-three').css( "background", "#2f73b3" );
						break;
					case 'clear-night':
						$('#page-one, #page-two, #page-three').css( "background", "#8b75b3" );
						break;
					case 'clear-day':
						$('#page-one, #page-two, #page-three').css( "background", "#75d1ef" );
						break;
					case 'fog':
						$('#page-one, #page-two, #page-three').css( "background", "#a2c0ca" );
						break;
					case 'cloudy':
						$('#page-one, #page-two, #page-three').css( "background", "#015a78" );
						break;
					case 'hail':
						$('#page-one, #page-two, #page-three').css( "background", "#6ab1b5" );
						break;
					case 'rain':
						$('#page-one, #page-two, #page-three').css( "background", "#91a3a4" );
						break;
					case 'sleet':
						$('#page-one, #page-two, #page-three').css( "background", "#5a7987" );
						break;
					case 'snow':
						$('#page-one, #page-two, #page-three').css( "background", "#9ed7f2" );
						break;
					case 'thunderstorm':
						$('#page-one, #page-two, #page-three').css( "background", "#313f46" );
						break;
					default:
						$('#page-one, #page-two, #page-three').css( "background", "#1b2c4e" );
						$("#wethIcon").html("<img id='icon' src='assets/img/weather/question_big.png'>");
						break;
				}


				//PAGE TWO
				

					var curHour = new Date().getHours();
					var mer = "AM";
					curHour+=2;
					if(curHour>12){
						curHour= curHour - 12;
						mer= "PM";
					}
					if(curHour==12){
						mer= "PM";
					}


				for(var ct=2; ct<12; ct+=2){
					
					var nextIcon = data['hourly']['data'][ct]['icon'];
					var nextTemp = Math.round(data['hourly']['data'][ct]['temperature']);
					//var nextLow = Math.round(data['hourly']['data'][ct]['temperatureMin']);

					$('#hourDay_'+ ct +'').html(curHour + " " + mer + ":");
					$('#hourIcon_'+ ct +'').html("<img id='icon' src='assets/img/weather/"+ nextIcon +"_big.png'>");
					$('#hourHighLow_'+ ct +'').html(nextTemp + "\xB0"); 

					curHour+=2;

					if(curHour>12){
						curHour= curHour - 12;
						if(mer=="AM"){
							mer="PM"
						}
						if(mer=="PM"){
							mer="AM"
						}
					}
					if(curHour==12){
						if(mer=="AM"){
							mer="PM"
						}
						if(mer=="PM"){
							mer="AM"
						}
					}
					
				}


				//Page THREE
					var numToday = new Date().getDay();
					numToday++;
					var today = "Tom"
				for(var ct=1; ct<6; ct++){
					
					var nextIcon = data['daily']['data'][ct]['icon'];
					var nextHigh = Math.round(data['daily']['data'][ct]['temperatureMax']);
					var nextLow = Math.round(data['daily']['data'][ct]['temperatureMin']);

					$('#weekDay_'+ ct +'').html(today + ":");
					$('#icon_'+ ct +'').html("<img id='icon' src='assets/img/weather/"+ nextIcon +"_big.png'>");
					$('#highLow_'+ ct +'').html(nextHigh +"/"+ nextLow +"\xB0");

					numToday++;
					var today = days[numToday];
				}




				console.log(data['hourly']['data']);
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