'use strict';

angular.module('secondarySalesApp')
    .controller('UsersCreateCtrl', function ($scope, Restangular, $http, $window, $route, $filter) {
//        if ($window.sessionStorage.roleId != 1) {
//            window.location = "/";
//        }
        $scope.heading = 'User Create';
        $scope.Saved = false;
        $scope.Updated = true;
        $scope.roleDisable = false;
        $scope.userDisable = false;
        $scope.usernameDisable = false;
        $scope.user = {
            flag: true,
            email: null,
            zoneId: null,
        //    salesAreaId: null,
            coorgId: null,
            lastmodifiedtime: new Date(),
            lastmodifiedby: $window.sessionStorage.UserEmployeeId,
            deleteflag: false
        };
        $scope.lastmodifiedby = $window.sessionStorage.UserEmployeeId;

        //console.log('$window.sessionStorage.State', $window.sessionStorage.zoneId);
        //console.log('$window.sessionStorage.Distric', $window.sessionStorage.salesAreaId);
        //console.log('$window.sessionStorage.Facility', $window.sessionStorage.coorgId);
        //console.log('$window.sessionStorage.LastModifyBy', $scope.lastmodifiedby);
        //console.log('$window.sessionStorage.Site', $window.sessionStorage.UserEmployeeId);
        /*
		"state": null,
		"district": null,
		"site": null,
		"facility": null,
		"lastmodifiedby": null,
		"lastmodifiedtime": null
*/
        $scope.lan = Restangular.all('languages?filter[where][deleteflag]=null').getList().then(function (lRas) {
            $scope.languages = lRas;
            $scope.user.language = 1;
        });
        $scope.groups = Restangular.all('groups?filter[where][deleteflag]=null').getList().$object;
        $scope.departments = Restangular.all('departments?filter[where][deleteflag]=null').getList().$object;
        $scope.ims = Restangular.all('ims?filter[where][deleteflag]=null').getList().$object;
        $scope.admins = Restangular.all('employees?filter[where][groupId]=1&filter[where][deleteflag]=false').getList().$object;
        //$scope.spms = Restangular.all('employees?filter[where][groupId]=3&filter[where][deleteflag]=false').getList().$object;
        //$scope.rios = Restangular.all('employees?filter[where][groupId]=4&filter[where][deleteflag]=null').getList().$object;
        //$scope.fieldworkers = Restangular.all('fieldworkers?filter[where][groupId]=4').getList().$object;

        $scope.fieldworkers = Restangular.all('fieldworkers?filter[where][deleteflag]=false&filter[where][usercreated]=false').getList().$object;


        $scope.comembers = Restangular.all('comembers?filter[where][deleteflag]=false&filter[where][usercreated]=false').getList().$object;

        $scope.mentors = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=17').getList().$object;

        $scope.spms = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=3').getList().$object;

        $scope.rios = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=4').getList().$object;

        $scope.nos = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=16').getList().$object;

        $scope.employees = Restangular.all('employees?filter[where][deleteFlag]=false&filter[where][userCreated]=false').getList().$object;
    
        $scope.workshops = Restangular.all('workshops?filter[where][deleteflag]=false&filter[where][userCreated]=false').getList().$object;
    
        $scope.transports = Restangular.all('transports?filter[where][deleteFlag]=false&filter[where][userCreated]=false').getList().$object;

        $scope.zones = Restangular.all('zones?filter[where][deleteFlag]=false').getList().$object;

        //$scope.salesAreas = Restangular.all('sales-areas?filter[where][state]=' + $window.sessionStorage.zoneId + '&filter[where][district]=' + $window.sessionStorage.salesAreaId + '&filter[where][facility]=' + $window.sessionStorage.coorgId + '&filter[where][deleteflag]=null').getList().$object;

        //$scope.zones = Restangular.all('zones').getList().$object;

        //$scope.employees = Restangular.all('employees').getList().$object;
        //$scope.comembers = Restangular.all('comembers').getList().$object;
        //$scope.languagemasters = Restangular.all('languagemasters').getList().$object;

        /************************************************** SAVE *******************************/
        $scope.showUniqueValidation = false;
        $scope.createduser = {
            "usercreated": true
        }
        $scope.validatestring = '';
        $scope.Save = function () {
            //document.getElementById('password').style.border = "";
            //document.getElementById('email').style.border = "";
            if ($scope.user.roleId == '' || $scope.user.roleId == null) {
                $scope.validatestring = $scope.validatestring + 'Please Select Your Role';
            } else if ($scope.user.usrName == '' || $scope.user.usrName == null) {
                $scope.validatestring = $scope.validatestring + 'Please Select Your User';
            } else if ($scope.user.username == '' || $scope.user.username == null) {
                $scope.validatestring = $scope.validatestring + 'Please Enter User Name';
                document.getElementById('Username').style.borderColor = "#FF0000";
            } else if ($scope.user.email == '' || $scope.user.email == null) {
                $scope.validatestring = $scope.validatestring + 'Please Enter Your Email Id';
                document.getElementById('email').style.borderColor = "#FF0000";
            } else if ($scope.user.password == '' || $scope.user.password == null) {
                $scope.validatestring = $scope.validatestring + 'Please Enter Your Password';
                document.getElementById('password').style.borderColor = "#FF0000";
            } else if ($scope.user.language == '' || $scope.user.language == null) {
                $scope.validatestring = $scope.validatestring + 'Please Select Your Language';
            }

            if ($scope.validatestring != '') {
                $scope.toggleValidation();
                $scope.validatestring2 = $scope.validatestring;
                $scope.validatestring = '';
            } else {
                //$scope.stakeholderdataModal = !$scope.stakeholderdataModal;
                $scope.users.post($scope.user).then(function (PostResponce) {
                        $scope.user.id = PostResponce.id;
                        $scope.user.roleid = PostResponce.roleId;
                        $scope.user.coorg_id = PostResponce.coorgId;
                        $scope.user.employee_id = PostResponce.employeeid;
                        $scope.user.zone_id = PostResponce.zoneId;
                        $scope.user.salesarea_id = PostResponce.salesAreaId;
                        $scope.analyticsusers.post($scope.user).then(function (analyticssubResponse) {
                            // window.location = '/users';
                            //document.getElementById('name').style.border = "";

                            $scope.stakeholderdataModal = !$scope.stakeholderdataModal;
                            $scope.submitDisable = true;
                            if ($scope.user.roleId == 1) {
                                Restangular.one('employees/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }

                            if ($scope.user.roleId == 2 || $scope.user.roleId == 15) {
                                Restangular.one('employees/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            
                             if ($scope.user.roleId == 4) {
                                Restangular.one('workshops/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            
                         if ($scope.user.roleId == 5) {
                         Restangular.one('transports/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }

                            if ($scope.user.roleId == 3) {
                                Restangular.one('fieldworkers/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            if ($scope.user.roleId == 3) {
                                Restangular.one('mentors/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            if ($scope.user.roleId == 4) {
                                Restangular.one('mentors/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            if ($scope.user.roleId == 16) {
                                Restangular.one('mentors/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                            if ($scope.user.roleId == 17) {
                                Restangular.one('mentors/' + $scope.user.employeeid).customPUT($scope.createduser).then(function () {
                                    window.location = '/users';
                                });
                            }
                        });


                    },
                    function (response) {
                        //alert(error.data.error.message);
                        $scope.showValidation = !$scope.showValidation;
                        /*if (response.data.error.constraint == "uniqueness") {
							$scope.validatestring1 = 'Email' + ' ' + $scope.user.email + ' ' + 'Already Exists';
						} else {
							$scope.validatestring1 = response.data.error.detail;
						}*/
                        $scope.validatestring1 = 'Email ID Already Exit';
                        //console.error('console.error', response);
                    });
            };
        };


        $scope.modalTitle = 'Thank You';
        $scope.message = 'User has been Created!';
        $scope.showValidation = false;
        /*$scope.toggleValidation = function () {
			$scope.showValidation = !$scope.showValidation;
		};*/

        $scope.toggleValidation = function () {
            $scope.showUniqueValidation = !$scope.showUniqueValidation;
        };

        /******************************************** WATCH *************************/

        $scope.$watch('user.usrName', function (newValue, oldValue) {
            //console.log('usrName', newValue);


            if (newValue === oldValue || newValue == '' || newValue == undefined) {
                return;
            } else {
                $scope.newUser = JSON.parse(newValue);
                if ($scope.user.roleId == 1) {
                    $scope.user.username = $scope.newUser.salesCode.toLowerCase();
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;
                    $scope.user.email = $scope.newUser.email;
                }

                if ($scope.user.roleId == 2) {
                    //      $scope.user.username = $scope.newUser.salesCode.toLowerCase();
                //    $scope.user.employeeid = $scope.newUser.id;
                    /*   $scope.user.mobile = $scope.newUser.mobile;
                        $scope.user.email = $scope.newUser.email; */

                    Restangular.one('employees/findOne?filter[where][id]=' + newValue).get().then(function (employ) {
                        $scope.user.mobile = employ.mobile;
                        $scope.user.email = employ.email;
                        $scope.user.employeeid = employ.id;

                        $scope.user.username = myTrim(employ.salesCode.toLowerCase());

                        function myTrim(x) {
                            return x.replace(/\s+/g, '');
                        }

                        Restangular.one('zones', employ.stateId).get().then(function (zn) {
                            $scope.statename = zn.name;

                        Restangular.one('sales_areas', employ.cityId).get().then(function (salearea) {
                            $scope.districtname = salearea.name;
                        });
                            
                        Restangular.one('cities', employ.district).get().then(function (city) {
                            $scope.Facilityname = city.name;  
                        });
                        
                        $scope.user.state = employ.stateId;
                        $scope.user.salesAreaId = employ.cityId;
                        $scope.user.district = employ.district;                           
                        });
                    });
                } 
                
                    if ($scope.user.roleId == 4) {
                    //      $scope.user.username = $scope.newUser.salesCode.toLowerCase();
                //    $scope.user.employeeid = $scope.newUser.id;
                    /*   $scope.user.mobile = $scope.newUser.mobile;
                        $scope.user.email = $scope.newUser.email; */

                    Restangular.one('workshops/findOne?filter[where][id]=' + newValue).get().then(function (wrkshp) {
                        $scope.user.mobile = wrkshp.mobile;
                        $scope.user.email = wrkshp.email;
                        $scope.user.employeeid = wrkshp.id;

                        $scope.user.username = myTrim(wrkshp.salescode.toLowerCase());

                        function myTrim(x) {
                            return x.replace(/\s+/g, '');
                        }

                        Restangular.one('zones', wrkshp.stateId).get().then(function (zn) {
                            $scope.statename = zn.name;

                        Restangular.one('sales_areas', wrkshp.cityId).get().then(function (salearea) {
                            $scope.districtname = salearea.name;
                        });
                            
                        Restangular.one('cities', wrkshp.areaId).get().then(function (city) {
                            $scope.Facilityname = city.name;  
                        });
                        
                        $scope.user.state = wrkshp.stateId;
                        $scope.user.salesAreaId = wrkshp.cityId;
                        $scope.user.district = wrkshp.district;                           
                        });
                    });
                }
                
                 if ($scope.user.roleId == 5) {
                    //      $scope.user.username = $scope.newUser.salesCode.toLowerCase();
                //    $scope.user.employeeid = $scope.newUser.id;
                    /*   $scope.user.mobile = $scope.newUser.mobile;
                        $scope.user.email = $scope.newUser.email; */

                    Restangular.one('transports/findOne?filter[where][id]=' + newValue).get().then(function (transprt) {
                        $scope.user.mobile = transprt.mobile;
                        $scope.user.email = transprt.email;
                        $scope.user.employeeid = transprt.id;

                        $scope.user.username = myTrim(transprt.salescode.toLowerCase());

                        function myTrim(x) {
                            return x.replace(/\s+/g, '');
                        }

                        Restangular.one('zones', transprt.stateId).get().then(function (zn) {
                            $scope.statename = zn.name;

                        Restangular.one('sales_areas', transprt.cityId).get().then(function (salearea) {
                            $scope.districtname = salearea.name;
                        });
                            
                        Restangular.one('cities', transprt.areaId).get().then(function (city) {
                            $scope.Facilityname = city.name;  
                        });
                        
                        $scope.user.state = transprt.stateId;
                        $scope.user.salesAreaId = transprt.cityId;
                        $scope.user.district = transprt.district;                           
                        });
                    });
                }

                if ($scope.user.roleId == 2 || $scope.user.roleId == 15) {
              //      $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
              //      $scope.user.employeeid = $scope.newUser.id;
              //      $scope.user.mobile = $scope.newUser.helpline;
                    //$scope.statename = $scope.newUser.state;
                    $scope.zones = Restangular.one('zones?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.state).get().then(function (responseZone) {
                        $scope.statename = responseZone[0].name;
                        $scope.user.zoneId = responseZone[0].id;
                        //			console.log('responseZone.name', $scope.user.zoneId);
                    });

                    $scope.salesAreas = Restangular.one('sales-areas?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.district).get().then(function (responsesalesAreas) {
                        $scope.districtname = responsesalesAreas[0].name;
                        $scope.user.salesAreaId = responsesalesAreas[0].id;
                        //			console.log('responseZone.salesAreaId', $scope.user.salesAreaId);
                    });

                    $scope.Facility = Restangular.one('employees?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.facility).get().then(function (responseFacility) {
                        $scope.Facilityname = responseFacility[0].salesCode;
                        $scope.user.coorgId = responseFacility[0].id;
                        //			console.log('responseZone.salesAreaId', $scope.user.coorgId);
                    });
                    
                     Restangular.one('employees/findOne?filter[where][id]=' + newValue).get().then(function (employ) {
                        $scope.user.mobile = employ.mobile;
                        $scope.user.email = employ.email;
                        $scope.user.employeeid = employ.id;

                        $scope.user.username = myTrim(employ.salesCode.toLowerCase());

                        function myTrim(x) {
                            return x.replace(/\s+/g, '');
                        }

                        Restangular.one('zones', employ.stateId).get().then(function (zn) {
                            $scope.statename = zn.name;

                        Restangular.one('sales_areas', employ.cityId).get().then(function (salearea) {
                            $scope.districtname = salearea.name;
                        });
                            
                        Restangular.one('cities', employ.district).get().then(function (city) {
                            $scope.Facilityname = city.name;  
                        });
                        
                        $scope.user.state = employ.stateId;
                        $scope.user.salesAreaId = employ.cityId;
                        $scope.user.district = employ.district;                           
                        });
                    });

                }

                if ($scope.user.roleId == 15) {
                    $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.helpline;
                }


                if ($scope.user.roleId == 3) {
                    $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;
                    //$scope.user.zoneId = $scope.newUser.state;
                    console.log(' $scope.newUser.state', $scope.newUser.state);
                    $scope.zones = Restangular.one('zones?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.state).get().then(function (responseZone) {
                        $scope.statename = responseZone[0].name;
                        $scope.user.zoneId = responseZone[0].id;
                    });
                }


                if ($scope.user.roleId == 4) {
                    $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;
                    //$scope.user.zoneId = $scope.newUser.state;
                    console.log(' $scope.newUser.state', $scope.newUser.state);
                    $scope.zones = Restangular.one('zones?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.state).get().then(function (responseZone) {
                        $scope.statename = responseZone[0].name;
                        $scope.user.zoneId = responseZone[0].id;
                    });
                }


                if ($scope.user.roleId == 16) {
                    $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;

                }


                if ($scope.user.roleId == 17) {
                    $scope.user.username = $scope.newUser.name.toLowerCase().replace(' ', '');
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;
                    //$scope.user.zoneId = $scope.newUser.state;
                    console.log(' $scope.newUser.state', $scope.newUser.state);
                    $scope.zones = Restangular.one('zones?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.state).get().then(function (responseZone) {
                        $scope.statename = responseZone[0].name;
                        $scope.user.zoneId = responseZone[0].id;
                    });
                }

                if ($scope.user.roleId == 3) {
                    $scope.user.username = $scope.newUser.fwcode.toLowerCase();
                    $scope.user.employeeid = $scope.newUser.id;
                    $scope.user.mobile = $scope.newUser.mobile;
                    $scope.user.email = $scope.newUser.email;

                    $scope.zones = Restangular.one('zones?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.state).get().then(function (responseZone) {
                        $scope.statename = responseZone[0].name;
                        $scope.user.zoneId = responseZone[0].id;
                        console.log('responseZone.name', $scope.user.zoneId);
                    });

                    $scope.salesAreas = Restangular.one('sales-areas?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.district).get().then(function (responsesalesAreas) {
                        $scope.districtname = responsesalesAreas[0].name;
                        $scope.user.salesAreaId = responsesalesAreas[0].id;
                        console.log('responseZone.salesAreaId', $scope.user.salesAreaId);
                    });

                    $scope.Facility = Restangular.one('employees?filter[where][deleteFlag]=false' + '&filter[where][id]=' + $scope.newUser.facility).get().then(function (responseFacility) {
                        $scope.Facilityname = responseFacility[0].salesCode;
                        $scope.user.coorgId = responseFacility[0].id;
                        console.log('responseZone.salesAreaId', $scope.user.coorgId);
                    });
                }
            }
        });

        $scope.hideState = false;
        $scope.hideDistrict = false;
        $scope.hideCo = false;
        $scope.$watch('user.roleId', function (newValue, oldValue) {
            console.log('newValue', newValue);
            console.log('oldValue', oldValue);
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
                } else if (newValue == 5 || newValue == 15) {
                    $scope.hideState = false;
                    $scope.hideDistrict = false;
                    $scope.hideCo = false;
                } else if (newValue == 6) {
                    $scope.hideState = false;
                    $scope.hideDistrict = false;
                    $scope.hideCo = false;
                } else if (newValue == 17) {
                    $scope.hideState = false;
                    $scope.hideDistrict = true;
                    $scope.hideCo = true;
                } else if (newValue == 16) {
                    $scope.hideState = true;
                    $scope.hideDistrict = true;
                    $scope.hideCo = true;
                }
            }
        });


        $scope.cofw = {
            data: 'co'
        };
        /*
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
*/
        $scope.$watch('user.zoneId', function (newValue, oldValue) {
            if (newValue === oldValue | newValue == '') {
                return;
            } else {
                //$scope.salesAreas = Restangular.all('sales-areas?filter[where][zoneId]=' + newValue).getList().$object;
                $scope.salesAreas = Restangular.all('sales-areas?filter[where][zoneId]=' + newValue + '&filter[where][deleteFlag]=false').getList().$object;
            }
        });

        $scope.$watch('user.salesAreaId', function (newValue, oldValue) {
            if (newValue === oldValue | newValue == '') {
                return;
            } else {
                //$scope.copartners = Restangular.all('employees?filter[where][groupId]=5' + '&filter[where][deleteflag]=false').getList().$object;
                //filter[where][stateId]=' + $window.sessionStorage.zoneId + '&filter[where][district]=' + $window.sessionStorage.salesAreaId + '&
                $scope.copartners = Restangular.all('employees?filter[where][deleteFlag]=false').getList().$object;
            }
        });


        $scope.users = Restangular.all('users').getList().$object;
        //$scope.employees = Restangular.all('employees').getList().$object;
        $scope.groups = Restangular.all('groups').getList().$object;
        $scope.roles = Restangular.all('roles?filter[where][deleteflag]=false').getList().$object;



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

    });