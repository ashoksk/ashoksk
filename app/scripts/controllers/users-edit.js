'use strict';

angular.module('secondarySalesApp')
	.controller('UsersEditCtrl', function ($scope, Restangular, $routeParams, $window) {
//		if ($window.sessionStorage.roleId != 1) {
//			window.location = "/";
//		}
		$scope.heading = 'User Update';
		$scope.Saved = true;
		$scope.Updated = false;
		$scope.roleDisable = true;
		$scope.userDisable = true;
		$scope.usernameDisable = true;
		$scope.languages = Restangular.all('languages?filter[where][deleteflag]=null').getList().$object;

		$scope.groups = Restangular.all('groups').getList().$object;
		//$scope.departments = Restangular.all('departments').getList().$object;
		//$scope.ims = Restangular.all('ims').getList().$object;
		$scope.rl = Restangular.all('roles').getList().then(function (RlRes) {
			$scope.roles = RlRes;
			//console.log('$scope.roles', $scope.roles);
		});
		$scope.users = Restangular.all('users').getList().$object;
		$scope.employees = Restangular.all('employees').getList().$object;
		$scope.zones = Restangular.all('zones').getList().$object;
		//$scope.roles = Restangular.all('roles').getList().$object;
		$scope.distributionAreas = Restangular.all('distribution-areas').getList().$object;
		$scope.partners = Restangular.all('partners?filter[where][groupId]=8').getList().$object;






		$scope.user = {};
		if ($window.sessionStorage.roleId != 1) {
			window.location = "/";
		}
		//$scope.languagemasters = Restangular.all('languagemasters').getList().$object;

		/************************************************** WATCH ******************************
        $scope.$watch('user.zoneId', function (newValue, oldValue) {
            if (oldValue === newValue || newValue == '') {
                return;
            } else {
                $scope.salesAreas = Restangular.all('sales-areas?filter[where][zoneId]=' + newValue).getList().$object;
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
	*/
		/*
					$scope.$watch('user.zoneId', function (newValue, oldValue) {
						if (newValue === oldValue || newValue == '') {
							return;
						} else if ($routeParams.id && (oldValue === "" || oldValue === undefined)) {
							return;
						} else {
							$scope.salesAreas = Restangular.all('sales-areas?filter[where][zoneId]=' + newValue).getList().$object;
						}
					});


					$scope.$watch('user.salesAreaId', function (newValue, oldValue) {
						if (newValue === oldValue || newValue == '') {
							return;
						} else if ($routeParams.id && (oldValue === "" || oldValue === undefined)) {
							return;
						} else {
							$scope.copartners = Restangular.all('employees?filter[where][groupId]=5' + '&filter[where][deleteflag]=false').getList().$object;
						}
					});
			*/

		/*
					if ($routeParams.id) {
						
						Restangular.one('users', $routeParams.id).get().then(function (user) {
							//if ($scope.user.roleId == 5) {
								$scope.user = Restangular.copy($scope.original);

								$scope.comember = Restangular.all('comembers?filter[where][deleteflag]=false').getList().then(function (comember) {
									$scope.comembers = comember;
									console.log('$scope.comembers', $scope.comembers);
								});
							//	$scope.user = Restangular.copy($scope.original);
							
							$scope.zones = Restangular.one('zones?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.zoneId).get().then(function (responseZone) {
								$scope.statename = responseZone[0].name;
								$scope.user.zoneId = responseZone[0].id;
								console.log('responseZone.name', $scope.user.zoneId);
							});

							$scope.salesAreas = Restangular.one('sales-areas?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.salesAreaId).get().then(function (responsesalesAreas) {
								$scope.districtname = responsesalesAreas[0].name;
								$scope.user.salesAreaId = responsesalesAreas[0].id;
								console.log('responseZone.salesAreaId', $scope.user.salesAreaId);
							});

							$scope.Facility = Restangular.one('employees?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.coorgId).get().then(function (responseFacility) {
								$scope.Facilityname = responseFacility[0].salesCode;
								$scope.user.coorgId = responseFacility[0].id;
								console.log('responseZone.salesAreaId', $scope.user.coorgId);
							});
							//}
							$scope.user = Restangular.copy($scope.original);
						});
					};
					//});

					//});
					//});		
					//});
					//};
				*/


		if ($routeParams.id) {
			Restangular.one('users', $routeParams.id).get().then(function (user) {
				$scope.original = user;
				$scope.user = Restangular.copy($scope.original);
				$scope.salesArea = Restangular.all('sales-areas?filter[where][zoneId]=' + $scope.original.zoneId).getList().then(function (salearea) {
					$scope.salesAreas = salearea;
					$scope.copartner = Restangular.all('employees?filter[where][groupId]=5' + '&filter[where][deleteflag]=false').getList().then(function (copartner) {
						$scope.copartners = copartner;

						
						if (user.zoneId == undefined || user.zoneId == null || user.zoneId == '') {
							return;
						} else {
							$scope.zones = Restangular.one('zones?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.zoneId).get().then(function (responseZone) {
								$scope.statename = responseZone[0].name;
								$scope.user.zoneId = responseZone[0].id;
								//		console.log('responseZone.name', $scope.user.zoneId);
							});
						}

						$scope.salesAreas = Restangular.one('sales-areas?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.salesAreaId).get().then(function (responsesalesAreas) {
							if (responsesalesAreas.length > 0) {
								$scope.districtname = responsesalesAreas[0].name;
								$scope.user.salesAreaId = responsesalesAreas[0].id;
								//			console.log('responseZone.salesAreaId', $scope.user.salesAreaId);
							}
						});

						$scope.Facility = Restangular.one('employees?filter[where][deleteflag]=false' + '&filter[where][id]=' + user.coorgId).get().then(function (responseFacility) {
							if (responseFacility.length > 0) {
								$scope.Facilityname = responseFacility[0].salesCode;
								$scope.user.coorgId = responseFacility[0].id;
								//			console.log('responseZone.salesAreaId', $scope.user.coorgId);

							}
						});
						/*
                        $scope.comember = Restangular.all('comembers?filter[where][deleteflag]=false').getList().then(function (comember) {
                            $scope.comembers = comember;
                            for (var i = 0; i < comember.length; i++) {
                                if ($scope.original.username === comember[i].name) {
                                    $scope.user = Restangular.copy($scope.original);
                                    $scope.user.usrName = (comember[i]);
                                    console.log('comember[i].name', $scope.user);
                                    break;
                                }
                            }
                        });
						*/
					});
				});

				if (user.roleId == 6) {
					Restangular.all('fieldworkers').getList().then(function (fldwkr) {
						$scope.fieldworkers = fldwkr;
						Restangular.one('fieldworkers', user.employeeid).get().then(function (fldwrkr) {
							$scope.user.usrName = JSON.stringify(fldwrkr);
						});
					});

				}
				if (user.roleId == 5) {
					Restangular.all('comembers').getList().then(function (comembr) {
						$scope.comembers = comembr;
						Restangular.one('comembers', user.employeeid).get().then(function (comem) {
							$scope.user.usrName = JSON.stringify(comem);
						});
					});

				}
				if (user.roleId == 3 || user.roleId == 4 || user.roleId == 16 || user.roleId == 17) {
					//$scope.mentors = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=17').getList().$object;

					//$scope.spms = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=3').getList().$object;

					//$scope.rios = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=4').getList().$object;

					// $scope.nos = Restangular.all('mentors?filter[where][deleteflag]=false&filter[where][usercreated]=false&filter[where][role]=16').getList().$object;
					Restangular.all('mentors').getList().then(function (otherusrs) {
						$scope.mentors = otherusrs;
						$scope.spms = otherusrs;
						$scope.rios = otherusrs;
						$scope.nos = otherusrs;
						Restangular.one('mentors', user.employeeid).get().then(function (mentr) {
							//console.log('mentr', mentr);
							$scope.user.usrName = JSON.stringify(mentr);
						});
					});
				}
				if (user.roleId == 1) {
					Restangular.all('employees?filter[where][groupId]=1').getList().then(function (amn) {
						$scope.admins = amn;
						Restangular.one('employees', user.employeeid).get().then(function (admn) {
							$scope.user.usrName = JSON.stringify(admn);
						});
					});

				}

			});
		};

		$scope.hideState = false;
		$scope.hideDistrict = false;
		$scope.hideCo = false;
		$scope.$watch('user.roleId', function (newValue, oldValue) {
			console.log('newValue', newValue);
			if (newValue === oldValue || newValue == '') {
				return;
			} else if ($routeParams.id && (oldValue === "" || oldValue === undefined)) {
				return;
			} else {
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



		/********************************************** UPDATE ****************************/

		Restangular.all('users?filter[where][id]=' + $routeParams.id).getList().then(function (submitcomem) {
			$scope.getUserId = submitcomem[0].employeeid;
		});

		$scope.comember = {};
		$scope.fwworker = {};
		$scope.validatestring = '';
		$scope.Update = function () {
			//document.getElementById('Username').style.border = "";
			if ($scope.user.roleId == '' || $scope.user.roleId == null) {
				$scope.validatestring = $scope.validatestring + 'Please Select Your Role';
				//} else if ($scope.user.usrName == '' || $scope.user.usrName == null) {
				//	$scope.validatestring = $scope.validatestring + 'Please Select Your User';
			} else if ($scope.user.username == '' || $scope.user.username == null) {
				$scope.validatestring = $scope.validatestring + 'Please Enter User Name';
				document.getElementById('Username').style.borderColor = "#FF0000";
			} else if ($scope.user.email == '' || $scope.user.email == null) {
				$scope.validatestring = $scope.validatestring + 'Please Enter Your Email Id';
				document.getElementById('email').style.borderColor = "#FF0000";
				//} else if ($scope.user.password == '' || $scope.user.password == null) {
				//	$scope.validatestring = $scope.validatestring + 'Please Enter Your Password';
				//	document.getElementById('password').style.borderColor = "#FF0000";
			} else if ($scope.user.language == '' || $scope.user.language == null) {
				$scope.validatestring = $scope.validatestring + 'Please Select Your Language';
			}
			if ($scope.validatestring != '') {
				$scope.toggleValidation();
				$scope.validatestring2 = $scope.validatestring;
				$scope.validatestring = '';
			} else {
				// $scope.stakeholderdataModal = !$scope.stakeholderdataModal;
				Restangular.one('users/' + $routeParams.id).customPUT($scope.user).then(function (subResponse) {
					console.log('subResponse', subResponse);
					$scope.stakeholderdataModal = !$scope.stakeholderdataModal;

					AnalyticsRestangular.one('users/' + $routeParams.id).customPUT($scope.user).then(function (analyticssubResponse) {
						if (subResponse.roleId == 5) {
							$scope.comember.helpline = subResponse.mobile;
							Restangular.one('comembers/' + $scope.getUserId).customPUT($scope.comember).then(function (submitcomember) {
								console.log('submitcomember', submitcomember);
								window.location = '/users';
							});
						} else if (subResponse.roleId == 6) {
							$scope.fwworker.mobile = subResponse.mobile;
							Restangular.one('fieldworkers/' + $scope.getUserId).customPUT($scope.fwworker).then(function (submitfwer) {
								console.log('submitfwer', submitfwer);
								window.location = '/users';
							});
						} else {
							window.location = '/users';
						}
					});
				}, function (error) {
					//console.log('error', error);
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
		$scope.message = 'User has been Updated!';
		$scope.showValidation = false;
		$scope.showUniqueValidation = false;
		$scope.toggleValidation = function () {
			$scope.showUniqueValidation = !$scope.showUniqueValidation;
		};


	});
