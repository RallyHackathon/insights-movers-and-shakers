angular.module('insights.movers.projects', []).service('projectLoader', function($http, $q){
	
	// Walk the alm project children tree to get all project/workspace oids
	this.getScopedProjects = function(rootProject, workspace){
		
		// TODO Load the projects. yay.
		return $q.when([{projectId:rootProject.ObjectID, workspaceId: workspace.ObjectID}]);
	};

});
