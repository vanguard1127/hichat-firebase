angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'ngStorage'])
.run(function($ionicPlatform, $state, $rootScope, $ionicPopup, $ionicHistory, $ionicLoading, $localStorage, $location){
	$rootScope.hostMail = hostMail;
	$rootScope.keyMap = keyMap;
	$rootScope.getMap = 'https://maps.googleapis.com/maps/api/staticmap?key='+$rootScope.keyMap+'&';
	$ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
	if(navigator.splashscreen) {
		setTimeout(function(){navigator.splashscreen.hide();}, 300);
	}
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
	});
	$rootScope.goBack = function(){
		$ionicHistory.goBack();
	};
	$rootScope.showLoading = function(template) {
		$ionicLoading.show({
		  template: template
		});
	};
	$rootScope.hideLoading = function(){
		$ionicLoading.hide();
	};
	$rootScope.openLink = function(link){
		var ref = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
	};
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if(angular.isUndefined($localStorage.userLogin) || !$localStorage.userLogin.isLogin) {
			$location.path('/walkthrough');
		}
	});
	$ionicPlatform.on('pause', function(){
		$rootScope.inBackground = true;
	});
	$ionicPlatform.on('resume', function(){
		$rootScope.inBackground = false;
	});
	document.addEventListener("offline", onOffline, false);
	function onOffline() {
		$rootScope.hideLoading();
		var confirmPopup = $ionicPopup.alert({
			title: 'Connection is disconnected',
			template: 'This App only work while Connection connected!'
		}).then(function(){ navigator.app.exitApp(); });
	}
	if(angular.isDefined($localStorage.userLogin)){
	$ionicPlatform.ready(function(){
		$rootScope.showNotification = function(numMessages){
			cordova.plugins.notification.local.schedule({
				id: 1,
				title: "Hichat notification",
				text: "You have new messages",
			});
		};
		var notification = firebase.database().ref('notification').child($localStorage.userLogin.id);
		notification.on('value', function(snapshot){
			var data = snapshot.val();
			if(data){
				if(data.messagesNew > 0 && $rootScope.inBackground)
					$rootScope.showNotification();
			}
		});
	});
	}
	$rootScope.reload = function(){
		$state.reload();
	};
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('walkthrough', {
		url: '/walkthrough',
		templateUrl: 'templates/sign/walkthrough.html',
	})

	.state('register', {
		url: '/register',
		templateUrl: 'templates/sign/register.html',
		controller: 'signCtrl'
	})

	.state('login', {
		url: '/login',
		templateUrl: 'templates/sign/login.html',
		controller: 'signCtrl'
	})

	.state('editInfomation', {
		url: '/editInfomation',
		templateUrl: 'templates/sign/edit-infomation.html',
		controller: 'signCtrl'
	})
    .state('home', {
		url: '/home/:tab',
		templateUrl: 'templates/home.html',
		controller: 'homeCtrl'
	})

	.state('detail', {
		cache: false,
		url: '/messages/detail/:id',
		templateUrl: 'templates/messages/detail.html',
		controller: 'messagesDetail'
	})

	.state('sendLocation', {
		cache:false,
		url: '/messages/location/:id/:source',
		templateUrl: 'templates/messages/location.html',
		controller: 'sendLocation'
    })

	.state('recommended', {
		url: '/contacts/recommended',
		templateUrl: 'templates/contacts/recommended.html',
		controller: 'contactsRecommended'
	})

	.state('addContacts', {
		cache: false,
		url: '/contacts/add',
		templateUrl: 'templates/contacts/add.html',
		controller: 'contactsAdd'
    })

	.state('searchContacts', {
		cache: false,
		url: '/contacts/search/:id',
		templateUrl: 'templates/contacts/search.html',
		controller: 'contactsSearch'
	})

	.state('inviteContacts', {
		url: '/contacts/invite/:id',
		templateUrl: 'templates/contacts/invite.html',
		controller: 'contactsInvite'
	})

	.state('updateContacts', {
		url: '/contacts/update',
		templateUrl: 'templates/contacts/update.html',
		controller: 'contactsUpdate'
	})

	.state('nearbyContacts', {
		cache: false,
		url: '/contacts/nearby',
		templateUrl: 'templates/contacts/nearby.html',
		controller: 'contactsNearby'
	})

	.state('nearbyLocation', {
		cache: false,
		url: '/contacts/location',
		templateUrl: 'templates/contacts/location.html',
		controller: 'nearbyLocation'
    })

  .state('createGroup', {
	  cache: false,
      url: '/group/create',
      templateUrl: 'templates/group/create.html',
	  controller: 'groupCreate'
    })

	.state('addGroup', {
		url: '/group/add/:id',
		templateUrl: 'templates/group/add.html',
		controller: 'groupAdd'
	})
	
	.state('viewGroup', {
		cache: false,
		url: '/group/view/:id',
        templateUrl: 'templates/group/view.html',
		controller: 'groupView'
	})

	.state('groupDetail', {
		cache: false,
		url: '/group/detail/:id',
		templateUrl: 'templates/group/detail.html',
		controller: 'groupDetail'
	})

	.state('profiles', {
		url: '/settings/profiles',
		templateUrl: 'templates/settings/profiles.html',
		controller: 'settingsCtrl'
    })

	.state('settingsMessages', {
		url: '/settings/messages',
		templateUrl: 'templates/settings/messages.html',
		controller: 'settingsCtrl'
    })

	.state('settingsContacts', {
      url: '/settings/contacts',
      templateUrl: 'templates/settings/contacts.html',
	  controller: 'settingsCtrl'
    })

	.state('settingsLanguages', {
      url: '/settings/languages',
      templateUrl: 'templates/settings/languages.html',
	  controller: 'settingsCtrl'
    })

	.state('about', {
      url: '/settings/about',
      templateUrl: 'templates/settings/about.html',
    })

	.state('settingsAccount', {
      url: '/settings/account',
      templateUrl: 'templates/settings/account.html',
	  controller: 'settingsCtrl'
    })

	.state('settingsPassword', {
      url: '/settings/password',
      templateUrl: 'templates/settings/password.html',
	  controller: 'changePasswordCtrl'
    })

	.state('search', {
	  cache: false,
      url: '/search',
      templateUrl: 'templates/search.html',
	  controller: 'searchCtrl'
    })
	;

	$urlRouterProvider.otherwise('/home/0');
})
.filter('firstChar', function(){
	return function(string){
		if(angular.isDefined(string) && string != '') return string.substring(0,1).toUpperCase();
	};
})
.filter('sinceTime', function($filter){
	return function(time){
		time = Number(time);
		if(angular.isDefined(time) && angular.isNumber(time)) {
			var now = new Date().getTime();
			var since = now - time;
			if(since > 432000000){
				return $filter('date')(time,'dd/MM/yyyy');
			} else {
				if(since < 120000) return 'Just Now';
				else {
					if(since < 3600000) return $filter('date')(since,'mm')+' minutes';
					else if(since < 86400000) return Math.floor(since/1000/60/60)+' hours';
					else return $filter('date')(since,'dd')+' days';
				}
			}
		}
	};
})
.filter('isEmpty', function () {
	var bar;
	return function (obj) {
		for (bar in obj) {
			if (obj.hasOwnProperty(bar)) {
				return false;
			}
		}
		return true;
	};
})
.config(function($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('top');
})