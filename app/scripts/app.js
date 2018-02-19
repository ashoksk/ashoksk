'use strict';

angular.module('secondarySalesApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'ui.select2',
    'ui.bootstrap',
    'angularFileUpload',
    'angularUtils.directives.dirPagination',
    'ngIdle',
    'toggle-switch',
    'angucomplete',
    'services.breadcrumbs',
  'ngPageTitle',
  'confirmButton',
'toaster'
 //'toaster'
 //'ngAnimate',
 //'720kb.tooltips'
 //'ngFormValidation'
  ])
    .config(function ($routeProvider, $locationProvider, RestangularProvider, $idleProvider, $keepaliveProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/customers',
                controller: 'CustomerCtrl',
                label: 'Home',
                data: {
                    pageTitle: 'Home'
                }
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl',
                label: 'Login',
                data: {
                    pageTitle: 'Login'
                }
            })
            .when('/users', {
                templateUrl: 'partials/users',
                controller: 'UsersCtrl'
            })
            .when('/users/create', {
                templateUrl: 'partials/users-form',
                controller: 'UsersCreateCtrl'
            })
            .when('/users/:id', {
                templateUrl: 'partials/users-form',
                controller: 'UsersEditCtrl'
            })
            .when('/employees', {
                templateUrl: 'partials/employees',
                controller: 'EmployeesCtrl',
                label: 'Employees',
                data: {
                    pageTitle: 'Employees'
                }
            })
            .when('/employees/create', {
                templateUrl: 'partials/employees-form',
                controller: 'EmployeesCreateCtrl',
                label: 'Employee Create',
                data: {
                    pageTitle: 'Employees Create'
                }
            })
            .when('/employees/:id', {
                templateUrl: 'partials/employees-form',
                controller: 'EmployeesEditCtrl',
                label: 'Employee Edit',
                data: {
                    pageTitle: 'Employee Edit'
                }
            })
            .when('/import-employees', {
                templateUrl: 'partials/import-employees',
                controller: 'ImportEmployeesXlsCtrl',
                label: 'Import Employees',
                data: {
                    pageTitle: 'Import Employees'
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
        RestangularProvider.setBaseUrl('//newsample-app.herokuapp.com/api/v1/');
        RestangularProvider.addElementTransformer('users', true, function (user) {
            // This will add a method called login that will do a POST to the path login
            // signature is (name, operation, path, params, headers, elementToPost)

            user.addRestangularMethod('login', 'post', 'login');

            return user;
        });
        $idleProvider.idleDuration(60 * 30);
        $idleProvider.warningDuration(5);
        $keepaliveProvider.interval(10);
    })

    .run(function ($rootScope, $window, $location, Restangular, $idle, $modal) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (current != undefined) {
                $window.sessionStorage.prviousLocation = current.loadedTemplateUrl;
                // console.log('$window.sessionStorage.prviousLocation when current != undefined',$window.sessionStorage.prviousLocation);
            } else {
                $window.sessionStorage.prviousLocation = null;
                //console.log('$window.sessionStorage.prviousLocation when else',$window.sessionStorage.prviousLocation);
            }
            console.log('$window.sessionStorage.userId', $window.sessionStorage.userId);
            console.log('$location.path()', $location.path());
            if (!$window.sessionStorage.userId && $location.path() !== '/login') {
                $location.path('/login');
            }
            if ($location.path() == '/login') {
                $rootScope.showMe = true;
            } else {
                $rootScope.showMe = false;
            }
            Restangular.setDefaultHeaders({
                'authorization': $window.sessionStorage.accessToken
            });
        });

        $rootScope.started = false;
        $rootScope.pageSize = 5;

        function closeModals() {
            if ($rootScope.warning) {
                $rootScope.warning.close();
                $rootScope.warning = null;
            }

            if ($rootScope.timedout) {
                $rootScope.timedout.close();
                $rootScope.timedout = null;
            }
        }

        function logout() {
            // alert('alert');
            //$location.path("/login");

            //$http.post(baseUrl + '/users/logout?access_token='+$window.sessionStorage.accessToken).success(function(logout) {
            Restangular.one('users/logout?access_token=' + $window.sessionStorage.accessToken).post().then(function (logout) {
                $window.sessionStorage.userId = '';
                console.log('Logout');
            }).then(function (redirect) {
                $window.location.href = '/login';
                $window.location.reload();
                $idle.unwatch();
            });
        }

        $rootScope.$on('$idleStart', function () {
            closeModals();

            $rootScope.warning = $modal.open({
                templateUrl: 'partials/warning-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $rootScope.$on('$idleEnd', function () {
            closeModals();
        });

        $rootScope.$on('$idleTimeout', function () {
            closeModals();
            logout();
            $rootScope.timedout = $modal.open({
                templateUrl: 'partials/timedout-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $rootScope.start = function () {
            closeModals();
            $idle.watch();
            $rootScope.started = true;
        };
        if (!$window.sessionStorage.userId == '') {
            $rootScope.start();
        }

        $rootScope.stop = function () {
            closeModals();
            $idle.unwatch();
            $rootScope.started = false;

        };
        $rootScope.style = {
            "font-size": 14
        }
    })

.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})