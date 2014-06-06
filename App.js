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
    }
});

var module = angular.module('insights.movers', []);
module.run(function($rootScope){
	$rootScope.app = $rootScope.app || {};
	$rootScope.app.scorecard = 'balanced';
});

module.controller('RootCtrl', function($scope, insightsApi, projectLoader){

	$scope.$watch('app.project', function(project){
		if(project) {
			projectLoader.getScopedProjects($scope.app.project, $scope.app.workspace).then(function(projects){
				return insightsApi.loadData($scope.app.scorecard, projects)
			}).then(function(data){
				$scope.data = data
			});
		}
	})

});

module.service('variationCalculator', function(){

	// For each project, calculate a variation against the workspace
	this.calculateVariationForProject = function(projectData){

	};

	// Array of data objects for projects
	this.createHighChartsSeries = function(projectsData){

	};


});

module.service('projectLoader', function($http, $q){
	
	// Walk the alm project children tree to get all project/workspace oids
	this.getScopedProjects = function(rootProject, workspace){
		
		// TODO Load the projects. yay.
		return $q.when([{projectId:rootProject.ObjectID, workspaceId: workspace.ObjectID}]);
	};

});

module.service('insightsApi', function($http, $q){

	// Sample Query
	// https://rally1.rallydev.com/insight/scorecardData?end-date=2014-06&granularity=quarter&projectId=7427420584&scorecardConfigId=balanced_all_visible&start-date=2013-05&workspaceId=41529001
	this.loadData = function(scorecard, projects){
		return $q.all(_.each(projects, function(project){
			var params = {
				'scorecardConfigId': 'balanced',
				'start-date': '2014-01', // TODO Base these dates on current Now() - 1 month
				'end-date': '2014-01',
				'granularity': 'month',
				'projectId': project.projectId,
				'workspaceId': project.workspaceId

			};
			return $http({
				url: 'https://rally1.rallydev.com/insight/scorecardData',
				method: 'GET',
				params: params
			});
		}))
	};
});
