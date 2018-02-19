'use strict';

angular.module('secondarySalesApp')
    .controller('EmployeesEditCtrl', function ($scope, Restangular, $window, $filter, $timeout, $routeParams) {
    
        /************ Show & Hide Update Create Button **********/

        $scope.Created = true;

        /******************** Get Dropdown Values ***************/

        $scope.countries = Restangular.all('countries').getList().$object;
        $scope.titles = Restangular.one('titles').get().$object;
        $scope.roles = Restangular.all('roles').getList().$object;
        $scope.managers = Restangular.all('users').getList().$object; 
        $scope.maritalstatuses = Restangular.all('maritalstatuses').getList().$object;
    
        /******************* Filter States **********************/

        $scope.$watch('employee.country', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                Restangular.all('states?filter[where][countryId]=' + newValue).getList().then (function (steResp) {
                    $scope.states = steResp;
                    $scope.employee.state = $scope.employee.state;
                });
            }
        });

        /******************* Filter Cities **************************/

        $scope.$watch('employee.state', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                Restangular.all('cities?filter[where][stateId]=' + newValue).getList().then (function (cityResp) {
                    $scope.cities = cityResp;
                    $scope.employee.city = $scope.employee.city;
                });
            }
        });
    
       /************** Full Name **********************/
    
        $scope.$watch('employee.firstname', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                $scope.employee.fullname = newValue;
            }
        });
    
        $scope.$watch('employee.lastname', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                $scope.employee.fullname = $scope.employee.firstname + ' ' + newValue;
            }
        });
    
        /*********************** Get via Route params ***************/
    
        if ($routeParams.id) {
            Restangular.one('employeelists', $routeParams.id).get().then(function (employee) {
                $scope.original = employee;
                $scope.employee = Restangular.copy($scope.original);
            });
        }

        /***************************** SAVE FUNCTION **********************************************************/

        $scope.showValidation = false;

        $scope.validatestring = '';

        $scope.Update = function () {

            document.getElementById('firstname').style.border = "";
            document.getElementById('lastname').style.border = "";
            document.getElementById('address').style.border = "";
            document.getElementById('zipcode').style.border = "";
            document.getElementById('work').style.border = "";

            if ($scope.employee.firstname == '' || $scope.employee.firstname == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter your first name..!!';
                document.getElementById('firstname').style.border = "1px solid #ff0000";

            } else if ($scope.employee.lastname == '' || $scope.employee.lastname == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter your last name..!!';
                document.getElementById('lastname').style.border = "1px solid #ff0000";

            } else if ($scope.employee.role == '' || $scope.employee.role == null) {
                $scope.validatestring = $scope.validatestring + 'Please select role..!!';

            } else if ($scope.employee.email == '' || $scope.employee.email == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter email id..!!';

            } else if ($scope.employee.mobile == '' || $scope.employee.mobile == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter mobile no..!!';

            } else if ($scope.employee.address == '' || $scope.employee.address == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter address..!!';
                document.getElementById('address').style.border = "1px solid #ff0000";

            } else if ($scope.employee.zipcode == '' || $scope.employee.zipcode == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter zip code..!!';
                document.getElementById('zipcode').style.border = "1px solid #ff0000";

            } else if ($scope.employee.startdate == '' || $scope.employee.startdate == null) {
                $scope.validatestring = $scope.validatestring + 'Please select start date..!!';

            } else if ($scope.employee.birthday == '' || $scope.employee.birthday == null) {
                $scope.validatestring = $scope.validatestring + 'Please select birthday..!!';

            } else if ($scope.employee.emptype == '' || $scope.employee.emptype == null) {
                $scope.validatestring = $scope.validatestring + 'Please select empployment type..!!';

            } else if ($scope.employee.maritalstatus == '' || $scope.employee.maritalstatus == null) {
                $scope.validatestring = $scope.validatestring + 'Please select marital status..!!';

            } else if ($scope.employee.country == '' || $scope.employee.country == null) {
                $scope.validatestring = $scope.validatestring + 'Please select country..!!';

            } else if ($scope.employee.state == '' || $scope.employee.state == null) {
                $scope.validatestring = $scope.validatestring + 'Please select state..!!';

            } else if ($scope.employee.city == '' || $scope.employee.city == null) {
                $scope.validatestring = $scope.validatestring + 'Please select city..!!';

            } else if ($scope.employee.worklocation == '' || $scope.employee.worklocation == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter work location..!!';
                document.getElementById('work').style.border = "1px solid #ff0000";

            } else if ($scope.employee.managerid == '' || $scope.employee.managerid == null) {
                $scope.validatestring = $scope.validatestring + 'Please enter manager..!!';
            }

            if ($scope.validatestring != '') {
                $scope.toggleValidation();
                $scope.validatestring2 = $scope.validatestring;
                $scope.validatestring = '';
            } else {
                Restangular.one('employeelists', $routeParams.id).customPUT($scope.employee).then(function () {
                    window.location = '/employees';
                }, function (response) {
                    alert(response.data.error.detail);
                });
            }
        };

        /************* Validation Popup ************************/

        $scope.toggleValidation = function () {
            $scope.showUniqueValidation = !$scope.showUniqueValidation;
        };
    
       /********************** Date Picker Code ****************/
    
        //Datepicker settings start//////////

        $scope.today = function () {
            $scope.dt = $filter('date')(new Date(), 'y-MM-dd');
        };

        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.dtmax = new Date();

        $scope.toggleMin = function () {
            $scope.minDate = ($scope.minDate) ? null : new Date();
        };

        $scope.toggleMin();
        $scope.picker = {};

        $scope.open = function ($event, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                $('#datepicker' + index).focus();
            });
            $scope.opened = true;
        };

        $scope.open1 = function ($event, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                $('#datepicker' + index).focus();
            });
            $scope.opened1 = true;
        };

        $scope.dateOptions = {
            'year-format': 'yy',
            'starting-day': 1
        };

        $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];
        //Datepicker settings end///

    });