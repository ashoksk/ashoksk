'use strict';

angular.module('secondarySalesApp')
    .controller('CustomerCtrl', function ($scope, $rootScope, Restangular, $location, $routeParams, $timeout, baseUrl, $route, $window, $filter) {
        /*********/
        $scope.modalTitle = 'Thank You';
        $scope.searchHide = true;

        $scope.showForm = function () {
            var visible = $location.path() === '/zones/create' || $location.path() === '/zones/' + $routeParams.id;
            return visible;
        };
        $scope.isCreateView = function () {
            if ($scope.showForm()) {
                var visible = $location.path() === '/zones/create';
                return visible;
            }
        };
        $scope.hideCreateButton = function () {
            var visible = $location.path() === '/zones/create' || $location.path() === '/zones/' + $routeParams.id;
            return visible;
        };
        $scope.hideSearchFilter = function () {
            var visible = $location.path() === '/zones/create' || $location.path() === '/zones/' + $routeParams.id;
            return visible;
        };


        /*********************************** Pagination *******************************************/
        if ($window.sessionStorage.myRoute == null || $window.sessionStorage.myRoute == undefined) {
            $window.sessionStorage.myRoute = null;
            $window.sessionStorage.myRoute_currentPage = 1;
            $window.sessionStorage.myRoute_currentPagesize = 5;
        } else {
            $scope.pageSize = $window.sessionStorage.myRoute_currentPagesize;
            $scope.currentpage = $window.sessionStorage.myRoute_currentPage;
            //console.log('$scope.countryId From Landing', $scope.pageSize);
        }

        $scope.currentPage = $window.sessionStorage.myRoute_currentPage;
        $scope.PageChanged = function (newPage, oldPage) {
            $scope.currentpage = newPage;
            $window.sessionStorage.myRoute_currentPage = newPage;
        };

        $scope.pageSize = $window.sessionStorage.myRoute_currentPagesize;
        $scope.pageFunction = function (mypage) {
            console.log('mypage', mypage);
            $scope.pageSize = mypage;
            $window.sessionStorage.myRoute_currentPagesize = mypage;
        };


        console.log('$window.sessionStorage.prviousLocation', $window.sessionStorage.prviousLocation);
        if ($window.sessionStorage.prviousLocation != "partials/zones") {
            $window.sessionStorage.myRoute = '';
            $window.sessionStorage.myRoute_currentPage = 1;
            $window.sessionStorage.myRoute_currentPagesize = 5;
            $scope.currentpage = 1;
            $scope.pageSize = 5;
        }

        /*if ($location.path() === '/zones/create' || $location.path() === '/zones/' + $routeParams.id) {
        	console.log('$location.path()', $location.path());
        	$scope.currentpage = 1;
        	$scope.pageSize = 5;
        } else {
        	console.log('else $location.path()', $location.path());
        	$window.sessionStorage.myRoute_currentPagesize = 5;
        	$window.sessionStorage.myRoute_currentPage = 1;
        }*/
        /*********************************** INDEX *******************************************/

        Restangular.one('users', $window.sessionStorage.userId).get().then(function (user) {
            $scope.userName = user.username;
        });

        $scope.rolesconfiguration = true;
        $scope.rolesconfigurationone = true;

        if ($window.sessionStorage.roleId == 1) {
            $scope.rolesconfiguration = false;
            $scope.rolesconfigurationone = true;
            $scope.userName = 'Admin';

        } else if ($window.sessionStorage.roleId == 2) {
            $scope.rolesconfiguration = true;
            $scope.rolesconfigurationone = false;

        } else if ($window.sessionStorage.roleId == 4) {
            $scope.rolesconfiguration = false;
            $scope.rolesconfigurationone = true;

        } else if ($window.sessionStorage.roleId == 5) {
            $scope.rolesconfiguration = false;
            $scope.rolesconfigurationone = true;

        } else if ($window.sessionStorage.roleId == 6) {
            $scope.rolesconfiguration = false;
            $scope.rolesconfigurationone = true;

        } else {
            $scope.rolesconfiguration = false;
            $scope.rolesconfigurationone = true;
        }


        $scope.$watch('searchZone', function (newValue, oldValue) {
            if (newValue == oldValue || newValue == '') {
                $scope.searchHide = true;
            } else {
                $scope.searchHide = false;
            }
        });

        $scope.okOnetoOne = function () {
            $location.path("/customers/" + 1);
        };

        Restangular.all('employeelists').getList().then(function (cust) {
            $scope.employeelists = cust;
            $scope.zoneId = $window.sessionStorage.sales_zoneId;
            angular.forEach($scope.employeelists, function (member, index) {
                member.index = index + 1;

                $scope.TotalTodos = [];
                $scope.TotalTodos.push(member);
            });
        });

        $scope.getCommunicationPreferenceId = function (communicationpreferenceId) {
            return Restangular.one('communicationpreferences', communicationpreferenceId).get().$object;
        };

        $scope.getLocalityId = function (LocalityId) {
            return Restangular.one('distribution_routes', LocalityId).get().$object;
        };

        /*-------------------------------------------------------------------------------------*/
        $scope.zone = {
            lastmodifiedtime: new Date(),
            lastmodifiedby: $window.sessionStorage.UserEmployeeId,
            deleteflag: false
        };

        $scope.statecodeDisable = false;
        $scope.membercountDisable = false;
        if ($routeParams.id) {
            $scope.message = 'State has been Updated!';
            $scope.statecodeDisable = true;
            $scope.membercountDisable = true;
            Restangular.one('zones', $routeParams.id).get().then(function (zone) {
                $scope.original = zone;
                $scope.zone = Restangular.copy($scope.original);
            });
        } else {
            $scope.message = 'State has been created!';
        }


        $scope.$watch('selected', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                console.log('newValue', newValue);

                Restangular.one('employeelists/findOne?filter[where][firstname]=' + newValue).get().then(function (customer) {
                    $scope.idvalue = customer.id;
                    window.location = '/customerorderdetails/' + $scope.idvalue;
                });
            }
        });

        $scope.Order = function () {
            window.location = '/customerorderdetails/' + $scope.selected;
        };

        /*  $scope.myFunction = function () {
              window.print();
          }; */
        /*---------------------------Delete---------------------------------------------------*/

        $scope.Delete = function (id) {
            $scope.item = [{
                deleteflag: true
            }]
            Restangular.one('zones/' + id).customPUT($scope.item[0]).then(function () {
                $route.reload();
            });
        }

        $scope.showValidation = false;
        $scope.toggleValidation = function () {
            $scope.showValidation = !$scope.showValidation;
        };



    });

/********************************* Not In Use ************************


		$scope.showValidation = false;
		$scope.toggleValidation = function () {
			$scope.showValidation = !$scope.showValidation;
		};
		
		$scope.validatestring = '';
		/*$scope.SaveZone = function () {
			document.getElementById('name').style.border = "";
			if ($scope.zone.name == '' || $scope.zone.name == null) {
				//$scope.zone.name = null;
				$scope.validatestring = $scope.validatestring + 'Please enter state name';
			}
			if ($scope.validatestring != '') {
				$scope.toggleValidation();
				$scope.validatestring1 = $scope.validatestring;
				$scope.validatestring = '';
			//	$scope.stakeholderdataModal = !$scope.stakeholderdataModal;
			} else {
				$scope.stakeholderdataModal = !$scope.stakeholderdataModal;
				Restangular.all('zones').post($scope.zone).then(function (res) {
					console.log('Zone Saved', res);
					window.location = '/zones';
				});
			}
		};*/


/****************************************************************/