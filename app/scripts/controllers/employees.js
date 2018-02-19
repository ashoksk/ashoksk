'use strict';

angular.module('secondarySalesApp')
    .controller('EmployeesCtrl', function ($scope, Restangular, $window, $route, $filter) {

        $scope.countries = Restangular.all('countries').getList().$object;

        /**************************************CALLING FUNCTION**********************/

        $scope.employeesArray = [];

        Restangular.all('employeelists').getList().then(function (empRes) {
            $scope.employees = empRes;
            angular.forEach($scope.employees, function (member, index) {
                member.index = index + 1;

                member.birthday = $filter('date')(member.birthday, 'dd/MM/yyyy');
                member.startdate = $filter('date')(member.startdate, 'dd/MM/yyyy');
            });
        });

        $scope.countryId = '';
        $scope.stateId = '';

        $scope.$watch('countryId', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {
                $scope.employeesArray = [];

                $scope.states = Restangular.all('states?filter[where][countryId]=' + newValue).getList().$object;

                Restangular.all('employeelists?filter[where][country]=' + newValue).getList().then(function (empRes) {
                    $scope.employees = empRes;
                    angular.forEach($scope.employees, function (member, index) {
                        member.index = index + 1;

                        member.birthday = $filter('date')(member.birthday, 'dd/MM/yyyy');
                        member.startdate = $filter('date')(member.startdate, 'dd/MM/yyyy');
                    });
                });
            }
        });

        $scope.$watch('stateId', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {

                $scope.employeesArray = [];

                Restangular.all('cities?filter[where][stateid]=' + newValue).getList().then(function (cityResp) {
                    $scope.cities = cityResp;
                });

                Restangular.all('employeelists?filter[where][state]=' + newValue).getList().then(function (empRes) {
                    $scope.employees = empRes;
                    angular.forEach($scope.employees, function (member, index) {
                        member.index = index + 1;

                        member.birthday = $filter('date')(member.birthday, 'dd/MM/yyyy');
                        member.startdate = $filter('date')(member.startdate, 'dd/MM/yyyy');
                    });
                });
            }
        });

        $scope.$watch('stateId', function (newValue, oldValue) {
            if (newValue === oldValue || newValue == '') {
                return;
            } else {

                $scope.employeesArray = [];

                Restangular.all('employeelists?filter[where][city]=' + newValue).getList().then(function (empRes) {
                    $scope.employees = empRes;
                    angular.forEach($scope.employees, function (member, index) {
                        member.index = index + 1;

                        member.birthday = $filter('date')(member.birthday, 'dd/MM/yyyy');
                        member.startdate = $filter('date')(member.startdate, 'dd/MM/yyyy');
                    });
                });
            }
        });

        /******************************** DELETE FUNCTION **************************************/

        $scope.Delete = function (id) {
            Restangular.one('employeelists', id).remove().then(function () {
                $route.reload();
            });
        };

        /**************************Export data to excel sheet ***************/

        $scope.xlscount = 0;

        $scope.exportData = function () {
            $scope.xlscount = 0;
            if ($scope.employees.length == 0) {
                alert('No data found');
            } else {
                for (var c = 0; c < $scope.employees.length; c++) {
                    $scope.employeesArray.push({
                        'FIRST NAME': $scope.employees[c].firstname,
                        'LAST NAME': $scope.employees[c].lastname,
                        'FULL NAME': $scope.employees[c].fullname,
                        'EMPLOYEE ID': $scope.employees[c].empid,
                        'MOBILE': $scope.employees[c].mobile,
                        'EMAIL': $scope.employees[c].email,
                        'ADDRESS': $scope.employees[c].address,
                        'ZIP CODE': $scope.employees[c].zipcode,
                        'BIRTH DAY': $scope.employees[c].birthday,
                        'ROLE': $scope.employees[c].role,
                        'START DATE': $scope.employees[c].startdate,
                        'EMPLOYEE TYPE': $scope.employees[c].emptype,
                        'WORK LOCATION': $scope.employees[c].worklocation,
                        'MARITAL STATUS': $scope.employees[c].maritalstatus,
                        'COUNTRY': $scope.employees[c].country,
                        'STATE': $scope.employees[c].state,
                        'CITY': $scope.employees[c].city,
                        'MANAGER': $scope.employees[c].managerid
                    });

                    $scope.xlscount++;
                    if ($scope.employees.length == $scope.xlscount) {
                        alasql('SELECT * INTO XLSX("employees.xlsx",{headers:true}) FROM ?', [$scope.employeesArray]);
                    }
                }
            }
        };


    });