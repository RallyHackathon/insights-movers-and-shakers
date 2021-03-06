angular.module('insights.movers.calculator', []).service('variationCalculator', function($q){

	this.calculateVariationsForProjects = function(projects, dimension){
		return $q.when(_.map(projects, function(project){
			var variation = this.calculateVariationForProject(project.metrics, dimension);
			project.variation = variation;
			return variation;
		}, this));
	};

	// For each project, calculate a variation against the workspace
	this.calculateVariationForProject = function(projectData, dimension){
		var scores = _.map(projectData.scopes, function(scope){
			return this.getDimensionScore(scope, dimension);
		}, this);
		var projectScores = scores[0];
		var workspaceScores = scores[1];
		var differences = this.getDifferenceFromScores(projectScores, workspaceScores);

		// TODO support variation for more than 2 time periods
		// We're being careful here to only use the most recent time points.
		var t0 = _.last(_.initial(projectScores));
		var t1 = _.last(projectScores);
		var percentage = this.calculateVariation(t0, t1);

		return {
			percentageAbs: Math.abs(percentage),
			percentage: percentage,
			projectScores: scores[0],
			workspaceScores: scores[1],
			differences: differences,
			t1: t1,
			t0: t0
		}
	};

	this.getDimensionScore = function(scope, dimension) {
		var scores = _(scope.dataPoints).pluck('data').pluck(dimension).pluck('score').value();
		return scores;
	};

	this.getDifferenceFromScores = function(projectScores, workspaceScores) {
		return _.zip(projectScores, workspaceScores).map(function(tuple){
			var projectScore = tuple[0];
			var workspaceScore = tuple[1];
			return projectScore-workspaceScore;
		});
	};

	this.calculateVariation = function(t1, t2){
		// t1 == 1 and t2 == 2
		// 2/1 - 1
		return ( ( t2 / t1 ) - 1 ) * 100
	};

});

// var sampleData = {
// 	"scopes": [
// 		{
// 			"oid": "7427420584",
// 			"workspaceOid": "41529001",
// 			"type": "project",
// 			"dataPoints": [
// 				{
// 					"data": {
// 						"DefectDensity": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.5476957893830119,
// 							"score": 5
// 						},
// 						"ReleasedDefectDensity": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.2861097407224689,
// 							"score": 0
// 						},
// 						"ThroughputStoryTransactionsPerFullTimeEquivalent": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 5.493307021871403,
// 							"score": 82
// 						},
// 						"CoefficientOfVarianceOnThroughputStoryTransactions": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.28616491603311883,
// 							"score": 67
// 						},
// 						"TimeInProcessStoryP50": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 2.375,
// 							"score": 76
// 						},
// 						"Quality": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"DefectDensity": {
// 										"weight": 0.5,
// 										"weightedScore": 2.5
// 									},
// 									"ReleasedDefectDensity": {
// 										"weight": 0.5,
// 										"weightedScore": 0
// 									}
// 								}
// 							},
// 							"score": 2.5
// 						},
// 						"Productivity": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"ThroughputStoryTransactionsPerFullTimeEquivalent": {
// 										"weight": 1,
// 										"weightedScore": 82
// 									}
// 								}
// 							},
// 							"score": 82
// 						},
// 						"Predictability": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"CoefficientOfVarianceOnThroughputStoryTransactions": {
// 										"weight": 1,
// 										"weightedScore": 67
// 									}
// 								}
// 							},
// 							"score": 67
// 						},
// 						"Responsiveness": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"TimeInProcessStoryP50": {
// 										"weight": 1,
// 										"weightedScore": 76
// 									}
// 								}
// 							},
// 							"score": 76
// 						},
// 						"OverallPerformance": {
// 							"meta": {
// 								"type": "overall",
// 								"contributions": {
// 									"Quality": {
// 										"weightedScore": 0.625,
// 										"weight": 0.25
// 									},
// 									"Productivity": {
// 										"weightedScore": 20.5,
// 										"weight": 0.25
// 									},
// 									"Predictability": {
// 										"weightedScore": 16.75,
// 										"weight": 0.25
// 									},
// 									"Responsiveness": {
// 										"weightedScore": 19,
// 										"weight": 0.25
// 									}
// 								}
// 							},
// 							"score": 56.875
// 						}
// 					},
// 					"month": "2014-05"
// 				}
// 			],
// 			"months": [
// 				"2014-05"
// 			]
// 		},
// 		{
// 			"oid": "41529001",
// 			"workspaceOid": "41529001",
// 			"type": "workspace",
// 			"dataPoints": [
// 				{
// 					"data": {
// 						"DefectDensity": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.16831678395416708,
// 							"score": 29
// 						},
// 						"ReleasedDefectDensity": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.07362928782940086,
// 							"score": 4
// 						},
// 						"ThroughputStoryTransactionsPerFullTimeEquivalent": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 5.303518095589465,
// 							"score": 81
// 						},
// 						"CoefficientOfVarianceOnThroughputStoryTransactions": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 0.3172717596590945,
// 							"score": 63
// 						},
// 						"TimeInProcessStoryP50": {
// 							"meta": {
// 								"type": "metric"
// 							},
// 							"value": 3.394230769230769,
// 							"score": 66
// 						},
// 						"Quality": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"DefectDensity": {
// 										"weight": 0.5,
// 										"weightedScore": 14.5
// 									},
// 									"ReleasedDefectDensity": {
// 										"weight": 0.5,
// 										"weightedScore": 2
// 									}
// 								}
// 							},
// 							"score": 16.5
// 						},
// 						"Productivity": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"ThroughputStoryTransactionsPerFullTimeEquivalent": {
// 										"weight": 1,
// 										"weightedScore": 81
// 									}
// 								}
// 							},
// 							"score": 81
// 						},
// 						"Predictability": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"CoefficientOfVarianceOnThroughputStoryTransactions": {
// 										"weight": 1,
// 										"weightedScore": 63
// 									}
// 								}
// 							},
// 							"score": 63
// 						},
// 						"Responsiveness": {
// 							"meta": {
// 								"type": "dimension",
// 								"contributions": {
// 									"TimeInProcessStoryP50": {
// 										"weight": 1,
// 										"weightedScore": 66
// 									}
// 								}
// 							},
// 							"score": 66
// 						},
// 						"OverallPerformance": {
// 							"meta": {
// 								"type": "overall",
// 								"contributions": {
// 									"Quality": {
// 										"weightedScore": 4.125,
// 										"weight": 0.25
// 									},
// 									"Productivity": {
// 										"weightedScore": 20.25,
// 										"weight": 0.25
// 									},
// 									"Predictability": {
// 										"weightedScore": 15.75,
// 										"weight": 0.25
// 									},
// 									"Responsiveness": {
// 										"weightedScore": 16.5,
// 										"weight": 0.25
// 									}
// 								}
// 							},
// 							"score": 56.625
// 						}
// 					},
// 					"month": "2014-05"
// 				}
// 			],
// 			"months": [
// 				"2014-05"
// 			],
// 			"benchmark": true
// 		}
// 	],
// 	"months": [
// 		"2014-05"
// 	],
// 	"granularity": "month",
// 	"startDate": "2014-05",
// 	"endDate": "2014-06",
// 	"metrics": [
// 		"DefectDensity",
// 		"ReleasedDefectDensity",
// 		"ThroughputStoryTransactionsPerFullTimeEquivalent",
// 		"CoefficientOfVarianceOnThroughputStoryTransactions",
// 		"TimeInProcessStoryP50"
// 	]
// };
