'use strict';

angular.module('secondarySalesApp')
	.controller('NavbarCtrl', function ($scope, $http, Restangular, $window, $timeout, $location, baseUrl, $modal, $route, $rootScope) {

		Restangular.one('users?filter[where][username]=' + $window.sessionStorage.userName).get().then(function (user) {
			$scope.user = user[0];
		});

		$scope.rolesconfiguration = true;
		$scope.rolesconfiguration1 = true;
		if ($window.sessionStorage.roleId == 1 || $window.sessionStorage.roleId == 10 || $window.sessionStorage.roleId == 11 || $window.sessionStorage.roleId == 12 || $window.sessionStorage.roleId == 13 || $window.sessionStorage.roleId == 14) {
			$scope.rolesconfiguration = false;
		} else {
			$scope.rolesconfiguration1 = false;
		}
        $scope.UserLanguage = $window.sessionStorage.language;
        $scope.KnowledgeBaseName = "Knowledge Base";
        if ($scope.UserLanguage == 1) {
            $scope.KnowledgeBaseName = "Knowledge Base";
        } else if ($scope.UserLanguage == 2) {
            $scope.KnowledgeBaseName = "ज्ञानधार";
        } else if ($scope.UserLanguage == 3) {
            $scope.KnowledgeBaseName = "ಜ್ಞಾನದ ತಳಹದಿ";
        } else if ($scope.UserLanguage == 4) {
            $scope.KnowledgeBaseName = "அறிவு சார்ந்த";
        } else if ($scope.UserLanguage == 5) {
            $scope.KnowledgeBaseName = "నాలెడ్జ్ బేస్";
        } else if ($scope.UserLanguage == 6) {
            $scope.KnowledgeBaseName = "पायाभूत माहिती";
        }

		/*
		       $scope.menu = [{
		         'title': 'Home',
		         'route': '/?(navbar)?',
		         'link': '/'
		       },
		       {
		         'title': 'hh',
		         'route': '/hh',
		         'link': '/hh'
		       }];
		       */
		/*************************************************************************************
			if ($window.sessionStorage.roleId == 5) {
				Restangular.one('comembers', $window.sessionStorage.UserEmployeeId).get().then(function (comember) {
					$scope.comemberid = comember.id;
					$scope.partners1 = Restangular.all('beneficiaries?filter[where][state]=' + $window.sessionStorage.zoneId + '&filter[where][district]=' + $window.sessionStorage.salesAreaId + '&filter[where][deleteflag]=false' + '&filter[where][facilityId]=' + $scope.comemberid + '&filter={"where":{"lastmodifiedbyrole":{"inq":[5,6]}}}').getList().then(function (resPartner1) {
						$scope.partners = resPartner1;
					});
				});

			} else {
				$scope.partners2 = Restangular.all('beneficiaries?filter[where][state]=' + $window.sessionStorage.zoneId + '&filter[where][district]=' + $window.sessionStorage.salesAreaId + '&filter[where][deleteflag]=false' + '&filter[where][fieldworker]=' + $window.sessionStorage.UserEmployeeId + '&filter[where][lastmodifiedbyrole]=6').getList().then(function (resPartner2) {
					$scope.partners = resPartner2;
				});
			}
		/**************************************** Member *******************************************/

        if ($window.sessionStorage.roleId == 2) {
            $scope.assignTransport = 'Assign Transport';
            $scope.salesOrders = 'Display Orders';
            
        } else if ($window.sessionStorage.roleId == 4) {
            $scope.assignTransport = 'Display Orders';
            
        } else if ($window.sessionStorage.roleId == 6) {
            $scope.assignTransport = 'Load Truck';
            $scope.salesOrders = 'Commence Discharge/Unload';
            
        } else if ($window.sessionStorage.roleId == 5) {
            $scope.assignTransport = 'Load Truck';
            $scope.salesOrders = 'Discharge Truck';
            
			$scope.part = Restangular.all('beneficiaries?filter[where][deleteflag]=false' + '&filter[where][facility]=' + $window.sessionStorage.coorgId).getList().then(function (part1) {
				$scope.partners = part1;
				angular.forEach($scope.partners, function (member, index) {
					member.index = index + 1;
				});
			});
		} else {
			Restangular.one('fieldworkers', $window.sessionStorage.UserEmployeeId).get().then(function (fw) {
				$scope.part = Restangular.all('beneficiaries?filter={"where":{"and":[{"site":{"inq":[' + fw.sitesassigned + ']}},{"deleteflag":{"inq":[false]}}]}}').getList().then(function (part2) {
					$scope.partners = part2;
					angular.forEach($scope.partners, function (member, index) {
						member.index = index + 1;

					});
				});
			});
		}

		/***********************************************************************/




		$scope.searchbulkupdate = '';

        $scope.NewOrder = function () {
            $location.path("/customerorders/" + $window.sessionStorage.UserEmployeeId);
        };

		$scope.openOnetoOne = function () {
			$scope.modalInstance1 = $modal.open({
				animation: true,
				templateUrl: 'template/OnetooOne.html',
				scope: $scope,
				backdrop: 'static'

			});
		};

		$scope.okOnetooOne = function (fullname) {
			$scope.modalInstance1.close();

			var fullname = fullname;
			$rootScope.fullname = $window.sessionStorage.fullName = fullname;
			console.log('$rootScope.okOnetooOne', $rootScope.fullname);
			$location.path("/onetoone/" + fullname);
			$route.reload();
		};

		$scope.cancelOnetooOne = function () {
			$scope.modalInstance1.close();
		};

		$scope.loading = true;
		//$scope.LoadingMOdal = false;
		$scope.toggleLoading = function () {
			$scope.modalInstanceLoad = $modal.open({
				animation: true,
				templateUrl: 'template/LodingModal.html',
				scope: $scope,
				backdrop: 'static',
				size: 'sm'

			});
			//$scope.LoadingMOdal = !$scope.LoadingMOdal;
		};



		$scope.openMainReportIncident = function () {
			$scope.modalMainReport = $modal.open({
				animation: true,
				templateUrl: 'template/MainReportIncident.html',
				scope: $scope,
				backdrop: 'static'

			});

		};

		$scope.okMainReportIncident = function (fullname) {
			$scope.modalMainReport.close();

			var fullname = fullname;
			$rootScope.fullname = $window.sessionStorage.fullName = fullname;
			console.log('$rootScope.okReportIncident', $rootScope.fullname);
			$location.path("/reportincident");
			$route.reload();
		};

		$scope.cancelMainReportIncident = function () {
			$scope.modalMainReport.close();
		};


		$scope.menu = [{
				'title': 'Home',
				'link': '/'
    },
			{
				'title': 'States',
				'link': '/states'
    },
			{
				'title': 'Contact',
				'link': '#'
    }];

		$scope.fwprofileedit = true;
		$scope.coprofileedit = true;
		if ($window.sessionStorage.roleId == 5) {
			$scope.coprofileedit = false;
			$scope.UserId = $window.sessionStorage.UserEmployeeId;
		} else {
			//$scope.UserId = $window.sessionStorage.UserEmployeeId;
			$scope.fwprofileedit = false;
			$scope.UserId = $window.sessionStorage.UserEmployeeId;
		}

		console.log($window.sessionStorage.userId + 'sddsf');
		$scope.showNav = function () {
			//console.log('$window.sessionStorage.userId', $window.sessionStorage.userId);
			if ($window.sessionStorage.userId) {
				return true;
			}
		};
		$scope.isActive = function (route) {
			return route === $location.path();
		};

		$scope.getClass = function (path) {
			if ($location.path().substr(0, path.length) === path) {
				return 'active';
			} else {
				return '';
			}
		}

		$scope.logout = function () {
			//$http.post(baseUrl + '/users/logout?access_token='+$window.sessionStorage.accessToken).success(function(logout) {
			Restangular.one('users/logout?access_token=' + $window.sessionStorage.accessToken).post().then(function (logout) {
				$window.sessionStorage.userId = '';
				console.log('Logout');
			}).then(function (redirect) {

				$location.path("/login");
				//$idle.unwatch();

			});
		};
		if ($window.sessionStorage.userId) {
			$scope.roles = Restangular.one('roles', $window.sessionStorage.roleId).get().$object;
		}


		/*************************** Language *******************************/
		$scope.languages = Restangular.all('languages').getList().$object;
    
        $scope.home = 'Home';
        $scope.printprofile = 'Profile';
        $scope.printsignout = 'Sign out';
        $scope.fieldwork = 'Field Work';
        $scope.facility = 'Marketing';
        $scope.printonetoneheader = 'One to One';
        $scope.members = 'Members';
        $scope.applyforscheme = 'Apply for Scheme';
        $scope.applyfordocument = 'Apply for Document';
        $scope.printheaderreportincident = 'Report Incident';
        $scope.headergroupmeeting = 'Group Meeting';
        $scope.stakeholdermeeting = 'Stakeholder Meeting';
        $scope.fieldworkerth = 'Field Worker';
        $scope.site = 'Site';
        $scope.assignfwtosite = 'Assign Worker to Site';
        $scope.facilityprofileheader = 'Facility Profile';
        $scope.eventheader = 'Event';
        $scope.dashboard = 'Dashboard';
        $scope.customers = 'Retailers';
    
		/*$scope.multiLang = Restangular.one('multilanguages?filter[where][id]=' + $window.sessionStorage.language).get().then(function (langResponse) {
		
			$rootScope.style = {
				"font-size": langResponse[0].fontsize
			}

			$scope.printonetoneheader = langResponse[0].onetoneheader;
			$scope.applyforscheme = langResponse[0].applyforscheme;
			$scope.applyfordocument = langResponse[0].applyfordocument;
			$scope.bulkupdateheader = langResponse[0].bulkupdateheader;
			$scope.eventheader = langResponse[0].eventheader;
			$scope.headergroupmeeting = langResponse[0].headergroupmeeting;
			$scope.stakeholdermeeting = langResponse[0].stakeholdermeeting;
			$scope.printheaderreportincident = langResponse[0].headerreportincident;
			$scope.printmembername = langResponse[0].membername;
			$scope.nickname = langResponse[0].nickname;
			$scope.facility = langResponse[0].facility;
			$scope.fieldworkerth = langResponse[0].fieldworkerth;
			$scope.eventheader = langResponse[0].eventheader;
			$scope.comanagerhdfprofileheader = langResponse[0].comanagerhdfprofileheader;
			$scope.site = langResponse[0].site;
			$scope.home = langResponse[0].home;
			$scope.fieldwork = langResponse[0].fieldwork;
			$scope.members = langResponse[0].members;
			$scope.hotspot = langResponse[0].hotspot;
			$scope.trackapplication = langResponse[0].trackapplication;
			$scope.archivedmembers = langResponse[0].archivedmembers;
			$scope.assignfwtosite = langResponse[0].assignfwtosite;
			$scope.dashboard = langResponse[0].dashboard;
			$scope.facilityprofileheader = langResponse[0].facilityprofileheader;
			$scope.searchfor = langResponse[0].searchfor;
			$scope.savebutton = langResponse[0].savebutton;
			$scope.update = langResponse[0].update;
			$scope.cancel = langResponse[0].cancel;
			$scope.create = langResponse[0].create;
			$scope.printprofile = langResponse[0].profile;
			$scope.printsignout = langResponse[0].logout;
		});*/


	});
