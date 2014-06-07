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
	'insights.movers.api',
	'highcharts-ng'
]);
module.run(function($rootScope, $timeout){
	$rootScope.app = $rootScope.app || {};
	$rootScope.context = {
		dimension: 'OverallPerformance',
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

	$timeout(function(){
		$('html').removeClass('x-viewport');
	});
});

module.controller('RootCtrl', function($scope, $log, insightsApi, projectLoader, variationCalculator){
	$scope.age = function(creationDate){
		return moment.duration(moment(new Date).diff(moment(creationDate))).humanize()
	};
	$scope.toFixed = function(x){
		return (isFinite(x)) ? x.toFixed(0) : ''
	};
	var createHighchartsConfig = function(seriesName, series){
		return {
			options: {
				chart: {
	                backgroundColor: null,
	                borderWidth: 0,
	                type: 'column',
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
	                backgroundColor: '#ffffff',
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
            },
            series: [{
            	name: seriesName,
            	data: series
            }],
            size: {
            	height: 20,
            	width: 120
            }
        };
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
				return $scope.sortedProjects;
			}).then(function(projects){
				_.each(projects, function(project){
					project.differenceChartConfig = createHighchartsConfig('Workspace Delta', project.variation.differences);
					project.scoresChartConfig = createHighchartsConfig('Project Scores', project.variation.projectScores);
				});
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

