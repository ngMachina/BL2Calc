angular.module('app', [])

.controller('BL2Ctrl', function($scope) {

	$scope.fireType = ["Semi-Auto","Automatic"];
	$scope.elementType = [
	{type:"",dur:0},
	{type:"Incendiary",name:"Burn",verb:"Ignite",dur:5},
	{type:"Shock",name:"Electrocute",verb:"shock",dur:2},
	{type:"Corrosive",name:"Corrosive",verb:"corrode",dur:8},
	{type:"Slag",name:"Slag",verb:"Slag",dur:8}
	];

	$scope.weapon = [{
		dmg:480,
		dmgrnds:1,
		acc:96.4,
		rate:17.1,
		reload:2.3,
		mag:8,
		fire:$scope.fireType[0],
		rounds:1,
		ele:$scope.elementType[1],
		eledmg:133,
		eleper:12},{
		dmg:11590,
		dmgrnds:1,
		acc:92,
		rate:4.4,
		reload:2.2,
		mag:29,
		fire:$scope.fireType[1],
		rounds:2,
		ele:$scope.elementType[3],
		eledmg:3605.9,
		eleper:14.4
		}];

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

		$scope.eledmg = function(elementdmg,element,elementper) {
			var dmg = ((elementdmg*element.dur)*(spm*$scope.adjAcc(elementper)))/60;

			if (dmg > elementdmg) {
				return elementdmg;
			} else {
				return dmg;
			}
		};

		return spm;
	};

	$scope.totaldps = function(dmg,dmgrnds,acc,magSize,fireRate,reload,fireType,rounds,elementdmg,element,elementper) {
		return parseFloat($scope.eledmg(elementdmg,element,elementper,magSize,fireRate,reload,fireType,rounds)) + $scope.dps(dmg,dmgrnds,acc,magSize,fireRate,reload,fireType,rounds);
	};

	$scope.dpstest = function(dmg,acc) {
		return dmg*acc;
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
		templateUrl:'weaponblock.html'
	};
});