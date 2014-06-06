Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:''},
    launch: function() {
        //Write app code here
        angular.bootstrap(document.body, ['insights.movers']);
    }
});

var module = angular.module('insights.movers', []);
module.controller('RootCtrl', function($scope){
	$scope.test = 'my value';
	console.log('test');
})
