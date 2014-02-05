//I generally don't like to put everything in the same file, but this is small so I won't fight it
//Still, wouldn't be a bad idea to separate your factories, directives and controllers into their own files

angular.module('app', [])

  //A factory (a type of service) is an object you can pass around via dependency
  //injection to other angular components, it's usually a good idea to put http requests
  //in here - I generally prefer to use $resource, which extends $http
  .factory('WeaponData', function ($http) {

    //It's a good idea to return a promise, which means returning the request
    //before the success callback, but this can be pretty case by case
    return $http.get('weapon.json');
  })


  //You can see here in the controller I am passing in WeaponData, the same you DI other
  //angular stuff - also, I won't do it here, but it's a good idea to look into making your code
  //minification friendly
  .controller('BL2Ctrl', function ($scope, WeaponData) {

    //$http call moved to WeaponData factory
    //I probably still wouldn't quite write it out this way, but at least we moved the request
    //into a factory
    WeaponData.success(function(data){
      $scope.weapons = data;
    });
  })


  //I moved almost ALL your controller into your directive, because all of this logic is
  //specifically tied to the directive, and isn't applicable outside of it
  //If any of this logic IS applicable outside of the directive, it would be a good idea
  //to put it into factories/services/filters - reusable objects you can pass around your app
  //This was a straight copy paste job, and I haven't actually looked at your code too much
  //but there are certain things that you should probably be careful about - like using ==
  //instead of using === for example - I'd recommend running that code through jsLint, or see
  //if you can tie jsLint into your ide or text editor to help you figure out best javascript
  //practices - that or read some great javascript books!
  .directive('weaponblock', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        weaponStats: '=info'
      },
      templateUrl: 'weaponblock.html',
      link: function(scope, element, attrs){


        scope.fireType = ["Semi-Auto", "Automatic"];
        scope.elementType = [
          {type: "", dur: 0},
          {type: "Incendiary", name: "Burn", verb: "Ignite", dur: 5},
          {type: "Shock", name: "Electrocute", verb: "shock", dur: 2},
          {type: "Corrosive", name: "Corrosive", verb: "corrode", dur: 8},
          {type: "Slag", name: "Slag", verb: "Slag", dur: 8}
        ];

        scope.semiCap = function (fireRate, fireType) {
          var rate = fireRate;

          if (fireType == "Semi-Auto") {
            if (rate > 5.4) {
              rate = 5.4;
            }
          }

          return rate;
        };

        scope.adjAcc = function (acc) {
          return acc / 100;
        };

        scope.spm = function (magSize, fireRate, reload, fireType, rounds) {
          var mag = Math.ceil(magSize / rounds);
          var fireCycle = mag / scope.semiCap(fireRate, fireType);
          var cyclesMinute = 60 / (fireCycle + parseFloat(reload));
          var fullCycles = Math.floor(cyclesMinute);
          var remaining = (cyclesMinute - fullCycles) * (fireCycle + parseFloat(reload));
          var partCycle = 0;

          if (fireCycle < remaining) {
            fullCycles++;
          } else {
            partCycle = Math.floor((remaining / fireCycle) * mag);
          }

          var spm = (mag * fullCycles) + parseFloat(partCycle);


          scope.dps = function (dmg, dmgrnds, acc) {
            return (Math.floor((spm * dmgrnds) * scope.adjAcc(acc)) * dmg) / 60;
          };

          scope.eledmg = function (elementdmg, element, elementper, elementdur) {
            var dmg = ((elementdmg * elementdur) * (spm * scope.adjAcc(elementper))) / 60;

            if (dmg > elementdmg) {
              return elementdmg;
            } else {
              return dmg;
            }
          };

          return spm;
        };

        scope.totaldps = function (elementdmg, element, elementper, elementdur, dmg, dmgrnds, acc) {
          return parseFloat(scope.eledmg(elementdmg, element, elementper, elementdur)) + scope.dps(dmg, dmgrnds, acc);
        };
      }
    };
  });