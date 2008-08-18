axiom.tasks = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('TaskAdd')){
			dojo.require("axiom.widget.TaskAdd");
			dojo.require("axiom.widget.TaskFilter");
			dojo.require("axiom.widget.TaskPanel");
			
			axiom.tasks.taskAdd = dojo.widget.createWidget('axiom:TaskAdd', {appPath:axiom.appPath}, dojo.byId('TaskAdd'));
			axiom.tasks.taskPanel = dojo.widget.createWidget('axiom:TaskPanel', {appPath:axiom.appPath}, dojo.byId('TaskPanel'));
			if(!axiom.isContentContributor){
				axiom.tasks.taskFilter = dojo.widget.createWidget('axiom:TaskFilter', {appPath:axiom.appPath}, dojo.byId('TaskFilter'));
				axiom.tasks.taskFilter.registerTable(axiom.tasks.taskPanel.searchTable);
			}
		}
	},
	cancelDelete: function(url){
		dojo.io.bind({ url: (url == '/'?'':url)+"/cancel_delete",
					   load: function() {axiom.tasks.taskPanel.refreshAll()}
					 });
					   
	}
}
dojo.addOnLoad(axiom.tasks.init);
