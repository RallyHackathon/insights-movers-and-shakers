describe('insights.movers.calculator', function(){
	
	beforeEach(angular.mock.module('insights.movers.calculator'))
	beforeEach(inject(function(variationCalculator){
		this.variationCalculator = variationCalculator;
		this.projectData = {
			scopes: [
				// This is the project scores
				{
					dataPoints: [
						{
							data: {
								'Quality': {
									score: 1
								}
							},
							month: '2014-01'
						}
					]
				},
				// This is the workspace scores
				{
					dataPoints: [
						{
							data: {
								'Quality': {
									score: 1
								}
							},
							month: '2014-01'
						}
					]
				}
			]
		}
	}))
	
	describe('calculateVariationForProject', function(){

		it('should calculate the difference relative to the workspace average', function(){
			var result = this.variationCalculator.calculateVariationForProject(this.data)
			expect(result).toBeDefined()
		})

	})

})
