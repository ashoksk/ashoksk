'use strict';

angular.module('secondarySalesApp')
    .directive('loading', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loading" style="color:#333;"><img src="images/ajax_loader.gif" width="20" height="20" class="loadingwidth" /> LOADING...</div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })

.directive('loading1', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loading" style="color:#333;"><img src="images/loader.gif" width="20" height="20" class="loadingwidth" /> </div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })
    .controller('LoginCtrl', function ($rootScope, $scope, $http, $window, $location, Restangular, $modal) {
        $scope.login = function () {
            $scope.loading = true;
            
            //   $scope.errormsg = 'hide';
            Restangular.one('users', 1);
            console.log('login');
            Restangular.all('users').login($scope.user).then(function (loginResult) {
                var session = $window.sessionStorage.loginResult = angular.toJson(loginResult);
                var sessionObj = angular.fromJson(session);
                $rootScope.accessToken = $window.sessionStorage.accessToken = sessionObj.id;
                $rootScope.currentUserId = $window.sessionStorage.userId = sessionObj.userId;
                $rootScope.currentUserTtl = $window.sessionStorage.userTtl = sessionObj.ttl;
            }).then(function () {
                //$location.path('/');
                Restangular.one('users/' + $window.sessionStorage.userId + '?access_token=' + $window.sessionStorage.accessToken).get().then(function (customer) {
                    console.log('customer', customer);
                    var name = customer.username;
                    var roleid = customer.roleId;
                    var zoneid = customer.state;
                    var salesAreaId = customer.salesAreaId;
                    var coorgId = customer.EmployeeId;
                    var groupId = customer.groupId;
                    var EmployeeId = customer.employeeid;
                    var deleteFlag = customer.deleteflag;
                    if (EmployeeId == null) {
                        EmployeeId = 0
                    }
                    $rootScope.currentUserName = $window.sessionStorage.userName = name;
                    $rootScope.roleId = $window.sessionStorage.roleId = roleid;
                    $rootScope.zoneId = $window.sessionStorage.zoneId = zoneid;
                    $rootScope.salesAreaId = $window.sessionStorage.salesAreaId = salesAreaId;
                    $rootScope.coorgId = $window.sessionStorage.coorgId = EmployeeId;
                    $rootScope.groupId = $window.sessionStorage.groupId = groupId;
                    $rootScope.UserEmployeeId = $window.sessionStorage.UserEmployeeId = EmployeeId;
                    $rootScope.DeleteFlag = $window.sessionStorage.DeleteFlag = deleteFlag;
                }).then(function () {
                    //$location.path('/');
                    /* if ($window.sessionStorage.roleId != 6) {
                         window.location = "/";
                         console.log('Login Sucessfull');
                         $scope.loading = false;
                     } else {
                         window.location = "/";
                         $scope.loading = false;
                         // $scope.logout();
                     }*/
                    //	 if ($window.sessionStorage.roleId != 6) {
                    if ($window.sessionStorage.DeleteFlag == 'true') {
                        $scope.loading = false;
                        $scope.logout();
                    } else {
                        window.location = "/";
                        console.log('Login Sucessfull');
                        $scope.loading = false;
                    }
                    //    } else {
                    //        //window.location = "/";
                    //        $scope.loading = false;
                    //        $scope.logout();
                    //     }
                });
                //$scope.loading = false;
            }, function (response) {
                console.log('response', response);
                //alert(response.statusText);

                $scope.errormsg = 'invalid username or password';
                //   $scope.errormsg = 'show';
                $scope.loading = false;

            })
        };

          $scope.domains = [{
                id: 1,
                name: 'domain1'
          }]

        $scope.logout = function () {
            //$http.post(baseUrl + '/users/logout?access_token='+$window.sessionStorage.accessToken).success(function(logout) {
            Restangular.one('users/logout?access_token=' + $window.sessionStorage.accessToken).post().then(function (logout) {
                $window.sessionStorage.userId = '';
                console.log('Logout');
            }).then(function (redirect) {
                window.location = "/login";
                alert('There is No Access for this User');
             //   $idle.unwatch();

            });
        };
    })

.directive('notification', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {
            $scope.notification = {
                status: 'hide',
                type: 'danger',
                message: 'Invalid Username or Password!!!'
            };
    }],
        link: function (scope, elem, attrs) {
            // watch for changes
            attrs.$observe('notification', function (value) {
                if (value === 'show') {
                    // shows alert
                    $(elem).slideDown();

                    // and after 3secs
                    $timeout(function () {
                        // hide it
                        $(elem).slideUp();

                        // and update the show property
                        scope.notification.status = 'hide';
                    }, 1000);
                }
            });
        }
    };
  }]);