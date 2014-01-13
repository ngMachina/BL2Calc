function BL2Ctrl($scope) {
	$scope.dmgrounds = 1;
	$scope.dmgrounds2 = 1;
	$scope.fireType = ["Semi-Auto","Automatic","Burst"];

	$scope.semiCap = function(fireRate) {
		var rate = fireRate;

		if($scope.fireType == "Semi-Auto") {
			if(rate > 5.4) {
				rate = 5.4;
			}
		}

		return rate;
	};

	$scope.adjAcc = function(acc) {
		return acc/100;
	};

	$scope.dps = function(dmg,rounds,fireRate) {
		return (dmg*rounds)*$scope.semiCap(fireRate);
	};

	$scope.dpsacc = function(dmg,rounds,acc,fireRate) {
		return (Math.floor((($scope.semiCap(fireRate)*rounds)*60)*$scope.adjAcc(acc))*dmg)/60;
	};

	$scope.spm = function(magSize,fireRate,reload) {
		var fireCycle = magSize/$scope.semiCap(fireRate);
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

	$scope.susDps = function(dmg,rounds,magSize,fireRate,reload) {
		return ($scope.spm(magSize,fireRate,reload)*(dmg*rounds))/60;
	};

	$scope.susAcc = function(dmg,rounds,acc,magSize,fireRate,reload) {
		return (Math.floor(($scope.spm(magSize,fireRate,reload)*rounds)*$scope.adjAcc(acc))*dmg)/60;
	};
}