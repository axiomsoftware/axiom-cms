/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.TaskFilter");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.TaskFilter",
	dojo.widget.HtmlWidget,
	function(){},
	{
		resultTable:null,
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/TaskFilter.html'),
		searchTasks: function(){
			if(!this.userList.value){
				this.errorMessage.innerHTML = 'Please select a username.';
				this.errorMessage.style.display = 'block';
			} else{
				this.errorMessage.style.display = 'none';
				axiom.tasks.taskPanel.showSearch();
				this.resultTable.refresh({username: this.userList.value});
			}
		},
		registerTable: function(widget){
			this.resultTable = widget;
		},
		postCreate: function(){
			for(var i in axiom.allUsers){
				var user = axiom.allUsers[i];
				var opt = document.createElement('option');
				opt.value = user;
				opt.innerHTML = user;
				this.userList.appendChild(opt);
			}
		}
	}
);
