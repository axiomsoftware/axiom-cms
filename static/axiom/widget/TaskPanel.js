/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.TaskPanel");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.PendingTaskTable");
dojo.require("axiom.widget.OpenTaskTable");
dojo.require("axiom.widget.ClosedTaskTable");
dojo.require("axiom.widget.ScheduledTaskTable");
dojo.require("axiom.widget.SearchTaskTable");

dojo.widget.defineWidget(
	"axiom.widget.TaskPanel", 
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		staticPath:'',
		pendingTable:null,
		openTable:null,
		closedTable:null,
		scheduledTable:null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/TaskPanel.html'),
		refreshAll:function(){
			if(!axiom.isContentContributor)
				this.pendingTable.refresh();
			this.openTable.refresh(); 
			this.scheduledTable.refresh(); 
			this.closedTable.refresh(); 
			if(this.searchTable.domNode.style.display == 'block'){
				axiom.tasks.taskFilter.searchTasks();
			}
		},
		showSearch: function(){
			if(!axiom.isContentContributor)
				this.pendingTable.hide();
			this.openTable.hide();
			this.scheduledTable.hide();
			this.closedTable.hide();
			this.searchTable.show();
		},
		hideSearch:function(){
			if(!axiom.isContentContributor)
				this.pendingTable.show();
			this.openTable.show();
			this.scheduledTable.show();
			this.closedTable.show();
			this.searchTable.hide();
		},
		postCreate:function() {
			if(!axiom.isContentContributor)
				this.pendingTable = dojo.widget.createWidget("axiom:PendingTaskTable", {appPath:this.appPath, staticPath: this.staticPath}, this.PendingTable);
			this.openTable = dojo.widget.createWidget("axiom:OpenTaskTable",    {appPath:this.appPath, staticPath: this.staticPath}, this.OpenTable);
			this.scheduledTable = dojo.widget.createWidget("axiom:ScheduledTaskTable",  {appPath:this.appPath, staticPath: this.staticPath}, this.ScheduledTable);
			this.closedTable = dojo.widget.createWidget("axiom:ClosedTaskTable",  {appPath:this.appPath, staticPath: this.staticPath}, this.ClosedTable);
			this.searchTable = dojo.widget.createWidget("axiom:SearchTaskTable",  {appPath:this.appPath, staticPath: this.staticPath}, this.SearchTable);
			this.searchTable.hide();
		}
	}
);
