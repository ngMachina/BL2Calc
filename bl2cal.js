function BL2Ctrl($scope) {
	$scope.semiCap = function() {
		rate = $scope.fireRate;

		if(rate > 5.4) {
			rate = 5.4;
		}

		return rate;
	};

	$scope.adjAcc = function() {
		return $scope.accuracy/100;
	};

	$scope.dps = function() {
		return $scope.damage * $scope.semiCap();
	};

	$scope.dpsacc = function() {
		return (Math.floor(($scope.semiCap() * 60)*$scope.adjAcc())*$scope.damage)/60;
	};

	$scope.spm = function() {
		var fireCycle = $scope.magSize/$scope.semiCap();
		var cyclesMinute = 60/(fireCycle + parseFloat($scope.reloadSpeed));
		var fullCycles = Math.floor(cyclesMinute);
		var remaining = (cyclesMinute - fullCycles)*(fireCycle + parseFloat($scope.reloadSpeed));
		var partCycle = 0;

		if(fireCycle < remaining) {
			fullCycles++;
		} else {
			partCycle = Math.floor((remaining/fireCycle)*$scope.magSize);
		}

		return ($scope.magSize * fullCycles) + parseFloat(partCycle);
	};

	$scope.susDps = function() {
		return ($scope.spm()*$scope.damage)/60;
	};

	$scope.susAcc = function() {
		return (Math.floor($scope.spm()*$scope.adjAcc())*$scope.damage)/60;
	};
}