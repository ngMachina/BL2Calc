function BL2Ctrl($scope) {
	$scope.fireType = ["Semi-Auto","Automatic","Burst"];
	$scope.elementType = [
	{name:"None", dur:0},
	{name:"Fire", dur:5},
	{name:"Shock", dur:2},
	{name:"Corrosive", dur:8},
	{name:"Slag", dur:8}
	];

	$scope.weapon = [{
		dmg:480,
		dmgrnds:1,
		acc:96.4,
		rate:17.1,
		reload:2.3,
		mag:8,
		fire:'Semi-Auto',
		eledmg:133,
		eleper:12}];

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

	$scope.spm = function(magSize,fireRate,reload,fireType) {
		var fireCycle = magSize/$scope.semiCap(fireRate,fireType);
		var cyclesMinute = 60/(fireCycle+parseFloat(reload));
		var fullCycles = Math.floor(cyclesMinute);
		var remaining = (cyclesMinute-fullCycles)*(fireCycle+parseFloat(reload));
		var partCycle = 0;

		if(fireCycle < remaining) {
			fullCycles++;
		} else {
			partCycle = Math.floor((remaining/fireCycle)*magSize);
		}

		return (magSize*fullCycles)+parseFloat(partCycle);
	};

	$scope.susDps = function(dmg,rounds,magSize,fireRate,reload,fireType) {
		return ($scope.spm(magSize,fireRate,reload,fireType)*(dmg*rounds))/60;
	};

	$scope.susAcc = function(dmg,rounds,acc,magSize,fireRate,reload,fireType) {
		return (Math.floor(($scope.spm(magSize,fireRate,reload,fireType)*rounds)*$scope.adjAcc(acc))*dmg)/60;
	};

	$scope.eledmg = function(elementdmg,element,elementper,magSize,fireRate,reload,fireType) {
		var dmg = ((elementdmg*element.dur)*($scope.spm(magSize,fireRate,reload,fireType)*$scope.adjAcc(elementper)))/60;

		if (dmg > elementdmg) {
			return elementdmg;
		} else {
			return dmg;
		}
	};

	$scope.totaldps = function(dmg,rounds,acc,magSize,fireRate,reload,fireType,elementdmg,element,elementper) {
		return parseFloat($scope.eledmg(elementdmg,element,elementper,magSize,fireRate,reload,fireType)) + $scope.susAcc(dmg,rounds,acc,magSize,fireRate,reload,fireType);
	};
}