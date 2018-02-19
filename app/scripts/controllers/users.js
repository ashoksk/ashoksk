'use strict';

angular.module('secondarySalesApp')
	.controller('UsersCtrl', function ($scope, Restangular, $http, $window, $route, $filter) {

//		if ($window.sessionStorage.roleId != 1) {
//			window.location = "/";
//		}

		if ($window.sessionStorage.user_zoneId == null || $window.sessionStorage.user_zoneId == undefined || $window.sessionStorage.user_facilityId == null || $window.sessionStorage.user_facilityId == undefined) {

			$window.sessionStorage.user_zoneId = null;
			$window.sessionStorage.user_facilityId = null;
			$window.sessionStorage.user_currentPage = 1;
			$window.sessionStorage.user_currentPagesize = 5;
		} else {
			$scope.countryId = $window.sessionStorage.user_zoneId;
			$scope.failityId = $window.sessionStorage.user_facilityId;
			$scope.currentpage = $window.sessionStorage.user_currentPage;
			$scope.pageSize = $window.sessionStorage.user_currentPagesize;
		}


		if ($window.sessionStorage.prviousLocation != "partials/users-form") {
			$window.sessionStorage.user_zoneId = '';
			$window.sessionStorage.user_facilityId = '';
			$window.sessionStorage.user_currentPage = 1;
			$scope.currentpage = 1;
			$scope.pageSize = 5;

			//$scope.tds = Restangular.all('users?filter[where][roleId]=1&filter[where][id]=' + $window.sessionStorage.userId).getList().then(function (response) {

			//$scope.tds = Restangular.all('users?filter={"where":{"and":[{"roleId":{"inq":[16]}},{"id":{"inq":[' +$window.sessionStorage.userId+']}}]}}').getList().then(function (response) {	

			$scope.led = Restangular.all('users?filter[where][or][0][id]=' + $window.sessionStorage.userId + '&filter[where][or][1][deleteflag]=false' + '&filter[where][or][1][roleId]=16').getList().then(function (response) {

				//$scope.tds = Restangular.all('users?filter={"where":{"and":[{"roleId":{"inq":[16]}},{"id":{"inq":[1249]}}]}}').getList().then(function (response) {

				//console.log('response', response);
				$scope.users = response;
				angular.forEach($scope.users, function (member, index) {
					member.index = index + 1;
				});
			});
		}
		
		$scope.currentpage = $window.sessionStorage.user_currentPage;
		$scope.PageChanged = function (newPage, oldPage) {
			$scope.currentpage = newPage;
			$window.sessionStorage.user_currentPage = newPage;
		};

		$scope.pageSize = $window.sessionStorage.user_currentPagesize;
		$scope.pageFunction = function (mypage) {
			$scope.pageSize = mypage;
			$window.sessionStorage.user_currentPagesize = mypage;
		};

		$scope.znes = Restangular.all('zones?filter[where][deleteFlag]=false').getList().then(function (znes) {
			$scope.zones = znes;
			$scope.countryId = $window.sessionStorage.user_zoneId;
		});


		$scope.getRole = function (stakeholdertype) {
			return Restangular.one('roles', stakeholdertype).get().$object;
		};

		/*****************************************************************	


			$scope.user = {
				flag: true,
				email: '',
				zoneId: '',
				salesAreaId: '',
				coorgId: '',
				lastmodifiedtime: $filter('date')(new Date(), 'y-MM-dd'),
				lastmodifiedby: $window.sessionStorage.UserEmployeeId
				
			};
			$scope.lastmodifiedby = $scope.user.usrName;

			console.log('$window.sessionStorage.State', $window.sessionStorage.zoneId);
			console.log('$window.sessionStorage.Distric', $window.sessionStorage.salesAreaId);
			console.log('$window.sessionStorage.Facility', $window.sessionStorage.coorgId);
			console.log('$window.sessionStorage.LastModifyBy', $scope.lastmodifiedby);
			console.log('$window.sessionStorage.Site', $window.sessionStorage.UserEmployeeId);
			
			$scope.getRole = function (stakeholdertype) {
				return Restangular.one('roles', stakeholdertype).get().$object;
			};


			$scope.groups = Restangular.all('groups?filter[where][deleteflag]=null').getList().$object;
			$scope.departments = Restangular.all('departments?filter[where][deleteflag]=null').getList().$object;
			$scope.ims = Restangular.all('ims?filter[where][deleteflag]=null').getList().$object;
			$scope.admins = Restangular.all('employees?filter[where][groupId]=1&filter[where][deleteflag]=null').getList().$object;
			$scope.spms = Restangular.all('employees?filter[where][groupId]=3&filter[where][deleteflag]=null').getList().$object;
			$scope.rios = Restangular.all('employees?filter[where][groupId]=4&filter[where][deleteflag]=null').getList().$object;
			//$scope.fieldworkers = Restangular.all('fieldworkers?filter[where][groupId]=4').getList().$object;

			$scope.fieldworkers = Restangular.all('fieldworkers?filter[where][deleteflag]=null&filter[where][usercreated]=null').getList().$object;


			$scope.comembers = Restangular.all('comembers?filter[where][deleteflag]=null&filter[where][usercreated]=null').getList().$object;

			$scope.employees = Restangular.all('employees?filter[where][deleteflag]=null&filter[where][usercreated]=null').getList().$object;

			//$scope.zones = Restangular.all('zones?filter[where][deleteflag]=false').getList().$object;

			//$scope.salesAreas = Restangular.all('sales-areas?filter[where][state]=' + $window.sessionStorage.zoneId + '&filter[where][district]=' + $window.sessionStorage.salesAreaId + '&filter[where][facility]=' + $window.sessionStorage.coorgId + '&filter[where][deleteflag]=null').getList().$object;

			//$scope.zones = Restangular.all('zones').getList().$object;

			//$scope.employees = Restangular.all('employees').getList().$object;
			//$scope.comembers = Restangular.all('comembers').getList().$object;
			//$scope.languagemasters = Restangular.all('languagemasters').getList().$object;

			/************************************************ SAVE *******************************
			$scope.createduser = {
				"usercreated": 'yes'
			}
			$scope.Save = function () {
				$scope.users.post($scope.user).then(function () {
					console.log('$scope.user', $scope.user);
					// window.location = '/users';

					if ($scope.user.roleId == 1 || $scope.user.roleId == 3 || $scope.user.roleId == 4) {
						Restangular.one('employees/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
							window.location = '/users';
						});
					}

					if ($scope.user.roleId == 5) {
						Restangular.one('comembers/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
							window.location = '/users';
						});
					}

					if ($scope.user.roleId == 6) {
						Restangular.one('fieldworkers/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
							window.location = '/users';
						});
					}
				}, function (error) {
					console.log('error', error);
				});
			};


			/******************************************** WATCH *************************

			$scope.$watch('user.usrName', function (newValue, oldValue) {
				if (newValue === oldValue || newValue == '' || newValue == undefined) {
					return;
				} else {
					$scope.newUser = JSON.parse(newValue);
					if ($scope.user.roleId == 1 || $scope.user.roleId == 3 || $scope.user.roleId == 4) {
						$scope.user.username = $scope.newUser.salesCode.toLowerCase();
						$scope.user.employeeid = $scope.newUser.id;
						$scope.user.mobile = $scope.newUser.mobile;
						$scope.user.email = $scope.newUser.email;
					}

					if ($scope.user.roleId == 5) {
						$scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
						$scope.user.employeeid = $scope.newUser.id;
						$scope.user.mobile = $scope.newUser.helpline;
					}

					if ($scope.user.roleId == 6) {
						$scope.user.username = $scope.newUser.fwcode.toLowerCase();
						$scope.user.employeeid = $scope.newUser.id;
						$scope.user.mobile = $scope.newUser.mobile;
						$scope.user.email = $scope.newUser.email;
					}
				}
			});

			$scope.hideState = false;
			$scope.hideDistrict = false;
			$scope.hideCo = false;
			$scope.$watch('user.roleId', function (newValue, oldValue) {
				if (newValue === oldValue || newValue == '' || newValue == undefined) {
					return;
				} else {
					$scope.user.username = null;
					$scope.user.employeeid = null;
					if (newValue == 1) {
						$scope.hideState = true;
						$scope.hideDistrict = true;
						$scope.hideCo = true;
					} else if (newValue == 3) {
						$scope.hideState = false;
						$scope.hideDistrict = true;
						$scope.hideCo = true;
					} else if (newValue == 4) {
						$scope.hideState = false;
						$scope.hideDistrict = true;
						$scope.hideCo = true;
					} else if (newValue == 5) {
						$scope.hideState = false;
						$scope.hideDistrict = false;
						$scope.hideCo = false;
					} else if (newValue == 6) {
						$scope.hideState = false;
						$scope.hideDistrict = false;
						$scope.hideCo = false;
					}
				}
			});


			$scope.cofw = {
				data: 'co'
			};
			$scope.partners = Restangular.all('partners?filter[where][groupId]=8').getList().$object;
			$scope.$watch('cofw.data', function (newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				} else {
					console.log(newValue);
					if (newValue == 'co') {
						$scope.partners = Restangular.all('partners?filter[where][groupId]=8').getList().$object;
					} else if (newValue == 'fw') {
						$scope.partners = Restangular.all('partners?filter[where][groupId]=9').getList().$object;
					}
				}
			});

			$scope.$watch('user.zoneId', function (newValue, oldValue) {
				if (newValue === oldValue | newValue == '') {
					return;
				} else {
					//$scope.salesAreas = Restangular.all('sales-areas?filter[where][zoneId]=' + newValue).getList().$object;
					$scope.salesAreas = Restangular.all('sales-areas?filter[where][groupId]=5' + '&filter[where][deleteflag]=null').getList().$object;
				}
			});

			$scope.$watch('user.salesAreaId', function (newValue, oldValue) {
				if (newValue === oldValue | newValue == '') {
					return;
				} else {
					//$scope.copartners = Restangular.all('partners?filter[where][salesAreaId]=' + newValue + '&filter[where][groupId]=8').getList().$object;
					//$scope.copartners = Restangular.all('employees?filter[where][groupId]=5').getList().$object;
					$scope.copartners = Restangular.all('employees?filter[where][groupId]=5' + '&filter[where][deleteflag]=null').getList().$object;


				}
			});


			//$scope.users = Restangular.all('users').getList().$object;



			//$scope.employees = Restangular.all('employees').getList().$object;
			$scope.groups = Restangular.all('groups').getList().$object;
			$scope.roles = Restangular.all('roles').getList().$object;



			//$scope.salesAreas = Restangular.all('sales-areas').getList().$object;
			$scope.distributionAreas = Restangular.all('distribution-areas').getList().$object;
			$scope.distributionSubareas = Restangular.all('distribution-subareas').getList().$object;



			$scope.$watch('user.distributionAreaId', function (newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				} else {
					$scope.user.organizationId = newValue;
				}
			});

			$scope.$watch('user.salesAreaId', function (newValue, oldValue) {
				if (newValue === oldValue) {
					return;
				} else {
					$scope.user.organizationId = newValue;
				}
			});


			/**************************************CALLING FUNCTION**********************/
		$scope.countryId = '';
		$scope.stateId = '';
		$scope.statesid = '';
		$scope.countiesid = '';

		$scope.$watch('countryId', function (newValue, oldValue) {
			if (newValue === oldValue || newValue == '') {
				return;
			} else {
				$window.sessionStorage.user_zoneId = newValue;
				$scope.displaysalesareas12 = Restangular.all('employees?filter[where][stateId]=' + newValue + '&filter[where][deleteFlag]=false').getList().then(function (responceSt) {
					$scope.facilities = responceSt;
					$scope.failityId = $window.sessionStorage.user_facilityId;
				});


				$scope.cities = Restangular.all('users?filter[where][state]=' + newValue + '&filter[where][deleteflag]=false').getList().then(function (ctyRes) {
					$scope.users = ctyRes;
					angular.forEach($scope.users, function (member, index) {
						member.index = index + 1;
					});
				});
				$scope.countiesid = +newValue;
			}
		});

		$scope.$watch('failityId', function (newValue, oldValue) {
			if (newValue === oldValue || newValue == '') {
				return;
			} else {
				$window.sessionStorage.user_facilityId = newValue;
				$scope.users = Restangular.all('users?filter[where][employeeid]=' + newValue + '&filter[where][state]=' + $scope.countiesid + '&filter[where][deleteflag]=false').getList().then(function (ctyRes) {
					$scope.users = ctyRes;
					angular.forEach($scope.users, function (member, index) {
						member.index = index + 1;
					});
				});
			}
		});

		$scope.Delete = function (id) {
			$scope.item = [{
				deleteflag: true
            }]
			Restangular.one('users/' + id).customPUT($scope.item[0]).then(function () {
				$route.reload();
			});
		}

	});
