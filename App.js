Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:''},
    launch: function() {
        debugger
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
module.run(function($rootScope){
	$rootScope.app = $rootScope.app || {};
	$rootScope.app.scorecard = 'balanced';
	$('html').removeClass('x-viewport');
});

module.controller('RootCtrl', function($scope, $log, insightsApi, projectLoader, variationCalculator){


	$scope.$watch('metrics', function(metrics){
		if(metrics){
			$scope.progress = "calculator";
			variationCalculator.calculateVariationsForProjects($scope.projects).then(function(variations){
				$scope.progress = null;
				$scope.variations = variations;
				$log.debug('calculator finished');
			})
		}
	});

	$scope.$watchCollection('projects', function(projects){		
		if(_.size(projects) > 0){
			$scope.progress = "metrics";
			insightsApi.loadData($scope.app.scorecard, $scope.projects).then(function(data){
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

