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
        angular.element(document.body).find('#root').css('display', 'visible')
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
});

module.controller('RootCtrl', function($scope, insightsApi, projectLoader, variationCalculator){

	$scope.chartConfig = {
        chart: {
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [2, 0, 2, 0],
            width: 120,
            height: 20,
            style: {
                overflow: 'visible'
            },
            skipClone: true
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0]
        },
        legend: {
            enabled: false
        },
        tooltip: {
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            hideDelay: 0,
            shared: true,
            padding: 0,
            positioner: function (w, h, point) {
                return { x: point.plotX - w / 2, y: point.plotY - h};
            }
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 1,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2
                        }
                    }
                },
                fillOpacity: 0.25
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver'
            }
        }
    };
	$scope.$watch('metrics', function(metrics){
		if(metrics){
			$scope.progress = "calculator";
			variationCalculator.getSeries(metrics).then(function(series){
				$scope.progress = null;
				$scope.series = series;
			})
		}
	});

	$scope.$watchCollection('projects', function(projects){		
		if(_.length(projects) > 0){
			$scope.progress = "metrics";
			insightsApi.loadData($scope.app.scorecard, projects).then(function(data){
				$scope.progress = null;
				$scope.metrics = data;
			});
		}
	})
	
	$scope.$watch('app.project', function(project){
		if(project) {
			$scope.progress = "projects";
			projectLoader.getScopedProjects($scope.app.project, $scope.app.workspace).then(function(projects){
				$scope.progress = null;
				$scope.projectsInScope = projects;
			})
		}
	})

});

