'use strict';

angular.module('secondarySalesApp')
	.controller('ImportEmployeesXlsCtrl', function ($scope, $rootScope, Restangular, $location, $routeParams, $timeout, baseUrl, $http, $window, $route, $fileUploader) {

		$scope.hideSubmit = true;
		$scope.DisableValidate = true;

		var X = XLSX;
    
		var XW = {
			/* worker message */
			msg: 'xlsx',
			/* worker scripts */
			rABS: 'scripts/services/xlsxworker2.js',
			norABS: 'scripts/services/xlsxworker1.js',
			noxfer: 'scripts/services/xlsxworker.js'
		};


		var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
		if (!rABS) {
			document.getElementsByName("userabs")[0].disabled = true;
			document.getElementsByName("userabs")[0].checked = false;
		}

		var use_worker = typeof Worker !== 'undefined';
		if (!use_worker) {
			document.getElementsByName("useworker")[0].disabled = true;
			document.getElementsByName("useworker")[0].checked = false;
		}

		function xw_noxfer(data, cb) {
			var worker = new Worker(XW.noxfer);
			worker.onmessage = function (e) {
				switch (e.data.t) {
					case 'ready':
						break;
					case 'e':
						console.error(e.data.d);
						break;
					case XW.msg:
						cb(JSON.parse(e.data.d));
						break;
				}
			};
			var arr = rABS ? data : btoa(fixdata(data));
			worker.postMessage({
				d: arr,
				b: rABS
			});
		}

		function xw_xfer(data, cb) {
			var worker = new Worker(rABS ? XW.rABS : XW.norABS);
			worker.onmessage = function (e) {
				switch (e.data.t) {
					case 'ready':
						break;
					case 'e':
						console.error(e.data.d);
						break;
					default:
						var xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
						console.log("done");
						$scope.DisableValidate = false;
						cb(JSON.parse(xx));
						break;
				}
			};
			if (rABS) {
				var val = s2ab(data);
				worker.postMessage(val[1], [val[1]]);
			} else {
				worker.postMessage(data, [data]);
			}
		}

		function xw(data, cb) {
			//transferable = document.getElementsByName("xferable")[0].checked;
			transferable = true;
			if (transferable) xw_xfer(data, cb);
			else xw_noxfer(data, cb);
		}

		var transferable = use_worker;
		if (!transferable) {
			document.getElementsByName("xferable")[0].disabled = true;
			document.getElementsByName("xferable")[0].checked = false;
		}

		function s2ab(s) {
			var b = new ArrayBuffer(s.length * 2),
				v = new Uint16Array(b);
			for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
			return [v, b];
		}

		function ab2str(data) {
			var o = "",
				l = 0,
				w = 10240;
			for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
			o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
			return o;
		}

		function to_json(workbook) {
			var result = {};
			workbook.SheetNames.forEach(function (sheetName) {
				var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				if (roa.length > 0) {
					result[sheetName] = roa;
				}
			});
			return result;
		}

		function to_csv(workbook) {
			var result = [];
			workbook.SheetNames.forEach(function (sheetName) {
				var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
				if (csv.length > 0) {
					result.push("SHEET: " + sheetName);
					result.push("");
					result.push(csv);
				}
			});
			return result.join("\n");
		}

		function to_formulae(workbook) {
			var result = [];
			workbook.SheetNames.forEach(function (sheetName) {
				var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
				if (formulae.length > 0) {
					result.push("SHEET: " + sheetName);
					result.push("");
					result.push(formulae.join("\n"));
				}
			});
			return result.join("\n");
		}

		function process_wb(wb) {
			var output = "";
			switch (get_radio_value("format")) {
				case "csv":
					output = to_csv(wb);
					break;
				case "form":
					output = to_formulae(wb);
					break;
				default:
					output = JSON.stringify(to_json(wb), 2, 2);
					$scope.entries = to_json(wb);
					$scope.xlsentries = $scope.entries.Sheet1;

					angular.forEach($scope.xlsentries, function (member, index) {
						//Just add the index to your item
						member.index = index;
					});
			}
			if (typeof console !== 'undefined') console.log("output", new Date());
		}

		function get_radio_value(radioName) {
			var radios = document.getElementsByName(radioName);
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].checked || radios.length === 1) {
					return radios[i].value;
				}
			}
		}

		var xlf = document.getElementById('xlf');
		//console.log('Event Start');

		function handleFile(e) {
			$scope.hideSubmit = true;
			$scope.hideValidate = false;
			rABS = true;
			use_worker = true;
			var files = e.target.files;
			var f = files[0]; {
				var reader = new FileReader();
				var name = f.name;
				reader.onload = function (e) {
					if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
					var data = e.target.result;
					if (use_worker) {
						xw(data, process_wb);
					} else {
						var wb;
						if (rABS) {
							wb = X.read(data, {
								type: 'binary'
							});
						} else {
							var arr = fixdata(data);
							wb = X.read(btoa(arr), {
								type: 'base64'
							});
						}
						process_wb(wb);
					}
				};
				if (rABS) reader.readAsBinaryString(f);
				else reader.readAsArrayBuffer(f);
			}
		}
    
       /****** File Validation (Accept Xls file Only) **********************/

		function validateFileType(e) {
			$scope.DisableSubmit = true;
			$scope.xlsentries = [];
			var _validVideoFileExtensions = [".xlsx", ".xls"];
			var sFileName = this.value;
			if (sFileName.length > 0) {
				var blnValid = false;
				for (var j = 0; j < _validVideoFileExtensions.length; j++) {
					var sCurExtension = _validVideoFileExtensions[j];
					if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
						blnValid = true;
						$scope.CorrectFormat = true;
						handleFile(e);
						break;
					}
				}
				if (!blnValid) {
					alert("Sorry, " + sFileName.split(/[\/\\]/).pop() + " is invalid, allowed extensions are: " + _validVideoFileExtensions.join(", "));
					xlf.value = null;
					$scope.CorrectFormat = false;
				}
			}
		};

		xlf.addEventListener('change', validateFileType, false);

		$scope.Save = function () {
            $scope.savedataModal = !$scope.savedataModal;
			$scope.item = $scope.entries.Sheet1;
            $scope.saveFunc();
		};
    
       var saveCount = 0;
    
       $scope.saveFunc = function () {
           
           if (saveCount < $scope.item.length) {
               
               $scope.item[saveCount].fullname = $scope.item[saveCount].firstname + ' ' + $scope.item[saveCount].lastname;
               
               Restangular.all('employeelists').post($scope.item[saveCount]).then(function (postResp) {
                    saveCount++;
                    $scope.saveFunc();
                }, function (response) {
					console.log("Error with status code", response.status);
				});
           } else {
               $scope.savedataModal = false;
               window.location = "/employees";
           }
       };

		$scope.Validate = function () {
            
			$scope.errortext = '';
            
            var re = /^-?[0-9]\d*(\.\d+)?$/; 
            
			if ($scope.xlsentries[0]['firstname'] && $scope.xlsentries[0]['lastname'] && $scope.xlsentries[0]['empid'] && $scope.xlsentries[0]['mobile'] && $scope.xlsentries[0]['email'] && $scope.xlsentries[0]['address'] && $scope.xlsentries[0]['zipcode'] && $scope.xlsentries[0]['birthday'] && $scope.xlsentries[0]['role'] && $scope.xlsentries[0]['startdate'] && $scope.xlsentries[0]['emptype'] && $scope.xlsentries[0]['worklocation'] && $scope.xlsentries[0]['maritalstatus'] && $scope.xlsentries[0]['country'] && $scope.xlsentries[0]['state'] && $scope.xlsentries[0]['city'] && $scope.xlsentries[0]['managerid']) {
				console.log('presence');
				$scope.hideValidate = true;

				for (var i = 0; i < $scope.xlsentries.length; i++) {
					if ($scope.xlsentries[i].firstname == '' || $scope.xlsentries[i].firstname == null) {
						$scope.errortext = $scope.errortext + 'Invalid firstname at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].lastname == '' || $scope.xlsentries[i].lastname == null) {
						$scope.errortext = $scope.errortext + 'Invalid lastname at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].empid == '' || $scope.xlsentries[i].empid == null) {
						$scope.errortext = $scope.errortext + 'Invalid employee id at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].mobile == '' || $scope.xlsentries[i].mobile == null || $scope.xlsentries[i].mobile.length != 10) {
						$scope.errortext = $scope.errortext + 'Invalid mobile at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].email == '' || $scope.xlsentries[i].email == null) {
						$scope.errortext = $scope.errortext + 'Invalid email at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].address == '' || $scope.xlsentries[i].address == null) {
						$scope.errortext = $scope.errortext + 'Invalid address at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].zipcode == '' || $scope.xlsentries[i].zipcode == null || $scope.xlsentries[i].zipcode.length != 6) {
						$scope.errortext = $scope.errortext + 'Invalid zip code at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].birthday == '' || $scope.xlsentries[i].birthday == null) {
						$scope.errortext = $scope.errortext + 'Invalid birth day at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].role == '' || $scope.xlsentries[i].role == null) {
						$scope.errortext = $scope.errortext + 'Invalid role at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].startdate == '' || $scope.xlsentries[i].startdate == null) {
						$scope.errortext = $scope.errortext + 'Invalid start date at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].emptype == '' || $scope.xlsentries[i].emptype == null) {
						$scope.errortext = $scope.errortext + 'Invalid employee type at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].worklocation == '' || $scope.xlsentries[i].worklocation == null) {
						$scope.errortext = $scope.errortext + 'Invalid work location at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].maritalstatus == '' || $scope.xlsentries[i].maritalstatus == null) {
						$scope.errortext = $scope.errortext + 'Invalid marital status at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].country == '' || $scope.xlsentries[i].country == null) {
						$scope.errortext = $scope.errortext + 'Invalid country at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].state == '' || $scope.xlsentries[i].state == null) {
						$scope.errortext = $scope.errortext + 'Invalid state at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].city == '' || $scope.xlsentries[i].city == null) {
						$scope.errortext = $scope.errortext + 'Invalid city at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					} else if ($scope.xlsentries[i].managerid == '' || $scope.xlsentries[i].managerid == null) {
						$scope.errortext = $scope.errortext + 'Invalid manager at Column Number::' + JSON.stringify($scope.xlsentries[i].index + 2) + '\r\n';
                        
					}
					
				}
                
				var textFile = null,
					makeTextFile = function (text) {
						var data = new Blob([text], {
							type: 'text/plain'
						});

						if (textFile !== null) {
							window.URL.revokeObjectURL(textFile);
						}
                        
						textFile = window.URL.createObjectURL(data);
						return textFile;
					};

				if ($scope.errortext != '') {
					//alert('Some Of your data is not in proper format. Click on "Download Error Text" to download the error log.');
					$scope.showValidation = !$scope.showValidation;
					var link = document.getElementById('downloadlink');
					link.href = makeTextFile($scope.errortext);
					link.style.display = 'block';
                    angular.element("input[type='file']").val(null);
                    $scope.xlsentries = [];
				} else {
                    $scope.successValidation = !$scope.successValidation;
					$scope.hideSubmit = false;
				}
			} else {
				$scope.xlsValidation = !$scope.xlsValidation;
                angular.element("input[type='file']").val(null);
                $scope.xlsentries = [];y
			}
		}
	});
