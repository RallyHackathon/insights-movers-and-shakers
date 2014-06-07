Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:''},
    launch: function() {
        //Write app code here
        angular.bootstrap(document.body, ['insights.movers']);
        var scope = angular.element(document.body).scope();
        scope.app = this.getContext().map.map;
        scope.$digest();
        $('#root').attr('style', 'display:block;')
        $('body').removeClass('x-body')
        $('html').removeClass('x-viewport')
    }
});

var module = angular.module('insights.movers', [
	'insights.movers.calculator',
	'insights.movers.projects',
	'insights.movers.api'
]);
module.run(function($rootScope, $timeout){
	$rootScope.app = $rootScope.app || {};
	$rootScope.context = {
		dimension: 'Quality',
		scorecard: 'balanced',
		endDate: moment().format('YYYY-MM'),
		startDate: moment().subtract('months', 4).format('YYYY-MM'),
		t0: moment().subtract('months', 2).format('YYYY-MM'),
		t1: moment().subtract('months', 1).format('YYYY-MM')
	}
	
	$rootScope.dimensions = [
		'OverallPerformance',
		'Quality',
		'Productivity',
		'Responsiveness',
		'Predictability'
	];

	$rootScope.dimension = 'OverallPerformance';
	$timeout(function(){
		$('html').removeClass('x-viewport');
	});
});

module.controller('RootCtrl', function($scope, $log, insightsApi, projectLoader, variationCalculator){
	$scope.toFixed = function(x){
		return (isFinite(x)) ? x.toFixed(0) : x
	};

	var recalc = function(){
		if($scope.metrics && $scope.context.scorecard){
			$scope.progress = "calculator";
			variationCalculator.calculateVariationsForProjects($scope.projects, $scope.context.dimension).then(function(variations){
				$scope.progress = null;
				$scope.variations = variations;
				$log.debug('calculator finished');
				$scope.sortedProjects = _.sortBy($scope.projects, function(project){
					return (isFinite(project.variation.percentageAbs)) ? project.variation.percentageAbs : null;
				}).reverse();
			})
		}
	}


	$scope.$watch('metrics', recalc);
	$scope.$watch('context', recalc, true);

	$scope.$watchCollection('projects', function(projects){		
		if(_.size(projects) > 0){
			$scope.progress = "metrics";
			var options = {startDate: $scope.context.startDate, endDate: $scope.context.endDate};
			insightsApi.loadData($scope.context.scorecard, $scope.projects, options).then(function(data){
				$scope.progress = null;
				$scope.metrics = data;
				$log.debug('insights api finished');
			});
		}
	})
	
	$scope.$watch('app.project', function(project){
		if(project) {
			$scope.progress = "projects";
			projectLoader.getScopedProjects($scope.app.project, $scope.app.workspace).then(function(projects){
				$scope.progress = null;
				$scope.projects = projects;
				$log.debug('loaded projects');
			})
		}
	})

});

