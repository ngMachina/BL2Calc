angular.module('app', [])

.controller('BL2Ctrl', function($scope, $http) {

	$scope.fireType = ["Semi-Auto","Automatic"];
	$scope.elementType = [
	{type:"",dur:0},
	{type:"Incendiary",name:"Burn",verb:"Ignite",dur:5},
	{type:"Shock",name:"Electrocute",verb:"shock",dur:2},
	{type:"Corrosive",name:"Corrosive",verb:"corrode",dur:8},
	{type:"Slag",name:"Slag",verb:"Slag",dur:8}
	];

	$http.get('weapon.json').success(function(data) {
		$scope.weapons = data;

	});

	$scope.semiCap = function(fireRate, fireType) {
		var rate = fireRate;

		if(fireType == "Semi-Auto") {
			if(rate > 5.4) {
				rate = 5.4;
			}
		}

		return rate;
	};

	$scope.adjAcc = function(acc) {
		return acc/100;
	};

	$scope.spm = function(magSize,fireRate,reload,fireType,rounds) {
		var mag = Math.ceil(magSize/rounds);
		var fireCycle = mag/$scope.semiCap(fireRate,fireType);
		var cyclesMinute = 60/(fireCycle+parseFloat(reload));
		var fullCycles = Math.floor(cyclesMinute);
		var remaining = (cyclesMinute-fullCycles)*(fireCycle+parseFloat(reload));
		var partCycle = 0;

		if(fireCycle < remaining) {
			fullCycles++;
		} else {
			partCycle = Math.floor((remaining/fireCycle)*mag);
		}

		var spm = (mag*fullCycles)+parseFloat(partCycle);
	

		$scope.dps = function(dmg,dmgrnds,acc) {
			return (Math.floor((spm*dmgrnds)*$scope.adjAcc(acc))*dmg)/60;
		};

		$scope.eledmg = function(elementdmg,element,elementper,elementdur) {
			var dmg = ((elementdmg*elementdur)*(spm*$scope.adjAcc(elementper)))/60;

			if (dmg > elementdmg) {
				return elementdmg;
			} else {
				return dmg;
			}
		};

		return spm;
	};

	$scope.totaldps = function(elementdmg,element,elementper,elementdur,dmg,dmgrnds,acc) {
		return parseFloat($scope.eledmg(elementdmg,element,elementper,elementdur)) + $scope.dps(dmg,dmgrnds,acc);
	};
})

.directive('weaponblock', function() {
	return {
		restrict: 'E',
		replace: true,
		controller:'BL2Ctrl',
		scope: {
			weaponStats: '=info'
		},
		templateUrl:'weaponblock.html',
	};
});