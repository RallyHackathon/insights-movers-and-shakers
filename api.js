
angular.module('insights.movers.api', [])
.config(function($httpProvider) {
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.service('insightsApi', function($http, $q, $log){

	// Sample Query
	// https://rally1.rallydev.com/insight/scorecardData?end-date=2014-06&granularity=quarter&projectId=7427420584&scorecardConfigId=balanced_all_visible&start-date=2013-05&workspaceId=41529001
	this.loadData = function(scorecard, projects, options){

		$log.debug('querying insights api for projects: ', _.pluck(projects, 'name'));
		return $q.all(_.map(projects, function(project){
			
			$log.debug('query for project: ', project.name)
			var params = {
				'scorecardConfigId': 'balanced',
				'start-date': options.startDate, // TODO Base these dates on current Now() - 1 month
				'end-date': options.endDate,
				'granularity': 'month',
				'projectId': project.projectId,
				'workspaceId': project.workspaceId

			};
			
			// return $q.when(sampleData).then(function(data){
			// 	project.metrics = data;
			// });
			return $http({
				url: 'https://rally1.rallydev.com/insight/scorecardData',
				method: 'GET',
				params: params
			}).then(function(response){
				var metrics = response.data;
				project.metrics = metrics;
				return metrics;
			});
		}));
	};
});


var sampleData = {
	"scopes": [
		{
			"oid": "7427420584",
			"workspaceOid": "41529001",
			"type": "project",
			"dataPoints": [
				{
					"data": {
						"DefectDensity": {
							"meta": {
								"type": "metric"
							},
							"value": 0.5476957893830119,
							"score": 5
						},
						"ReleasedDefectDensity": {
							"meta": {
								"type": "metric"
							},
							"value": 0.2861097407224689,
							"score": 0
						},
						"ThroughputStoryTransactionsPerFullTimeEquivalent": {
							"meta": {
								"type": "metric"
							},
							"value": 5.493307021871403,
							"score": 82
						},
						"CoefficientOfVarianceOnThroughputStoryTransactions": {
							"meta": {
								"type": "metric"
							},
							"value": 0.28616491603311883,
							"score": 67
						},
						"TimeInProcessStoryP50": {
							"meta": {
								"type": "metric"
							},
							"value": 2.375,
							"score": 76
						},
						"Quality": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"DefectDensity": {
										"weight": 0.5,
										"weightedScore": 2.5
									},
									"ReleasedDefectDensity": {
										"weight": 0.5,
										"weightedScore": 0
									}
								}
							},
							"score": 2.5
						},
						"Productivity": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"ThroughputStoryTransactionsPerFullTimeEquivalent": {
										"weight": 1,
										"weightedScore": 82
									}
								}
							},
							"score": 82
						},
						"Predictability": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"CoefficientOfVarianceOnThroughputStoryTransactions": {
										"weight": 1,
										"weightedScore": 67
									}
								}
							},
							"score": 67
						},
						"Responsiveness": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"TimeInProcessStoryP50": {
										"weight": 1,
										"weightedScore": 76
									}
								}
							},
							"score": 76
						},
						"OverallPerformance": {
							"meta": {
								"type": "overall",
								"contributions": {
									"Quality": {
										"weightedScore": 0.625,
										"weight": 0.25
									},
									"Productivity": {
										"weightedScore": 20.5,
										"weight": 0.25
									},
									"Predictability": {
										"weightedScore": 16.75,
										"weight": 0.25
									},
									"Responsiveness": {
										"weightedScore": 19,
										"weight": 0.25
									}
								}
							},
							"score": 56.875
						}
					},
					"month": "2014-05"
				}
			],
			"months": [
				"2014-05"
			]
		},
		{
			"oid": "41529001",
			"workspaceOid": "41529001",
			"type": "workspace",
			"dataPoints": [
				{
					"data": {
						"DefectDensity": {
							"meta": {
								"type": "metric"
							},
							"value": 0.16831678395416708,
							"score": 29
						},
						"ReleasedDefectDensity": {
							"meta": {
								"type": "metric"
							},
							"value": 0.07362928782940086,
							"score": 4
						},
						"ThroughputStoryTransactionsPerFullTimeEquivalent": {
							"meta": {
								"type": "metric"
							},
							"value": 5.303518095589465,
							"score": 81
						},
						"CoefficientOfVarianceOnThroughputStoryTransactions": {
							"meta": {
								"type": "metric"
							},
							"value": 0.3172717596590945,
							"score": 63
						},
						"TimeInProcessStoryP50": {
							"meta": {
								"type": "metric"
							},
							"value": 3.394230769230769,
							"score": 66
						},
						"Quality": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"DefectDensity": {
										"weight": 0.5,
										"weightedScore": 14.5
									},
									"ReleasedDefectDensity": {
										"weight": 0.5,
										"weightedScore": 2
									}
								}
							},
							"score": 16.5
						},
						"Productivity": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"ThroughputStoryTransactionsPerFullTimeEquivalent": {
										"weight": 1,
										"weightedScore": 81
									}
								}
							},
							"score": 81
						},
						"Predictability": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"CoefficientOfVarianceOnThroughputStoryTransactions": {
										"weight": 1,
										"weightedScore": 63
									}
								}
							},
							"score": 63
						},
						"Responsiveness": {
							"meta": {
								"type": "dimension",
								"contributions": {
									"TimeInProcessStoryP50": {
										"weight": 1,
										"weightedScore": 66
									}
								}
							},
							"score": 66
						},
						"OverallPerformance": {
							"meta": {
								"type": "overall",
								"contributions": {
									"Quality": {
										"weightedScore": 4.125,
										"weight": 0.25
									},
									"Productivity": {
										"weightedScore": 20.25,
										"weight": 0.25
									},
									"Predictability": {
										"weightedScore": 15.75,
										"weight": 0.25
									},
									"Responsiveness": {
										"weightedScore": 16.5,
										"weight": 0.25
									}
								}
							},
							"score": 56.625
						}
					},
					"month": "2014-05"
				}
			],
			"months": [
				"2014-05"
			],
			"benchmark": true
		}
	],
	"months": [
		"2014-05"
	],
	"granularity": "month",
	"startDate": "2014-05",
	"endDate": "2014-06",
	"metrics": [
		"DefectDensity",
		"ReleasedDefectDensity",
		"ThroughputStoryTransactionsPerFullTimeEquivalent",
		"CoefficientOfVarianceOnThroughputStoryTransactions",
		"TimeInProcessStoryP50"
	]
};
