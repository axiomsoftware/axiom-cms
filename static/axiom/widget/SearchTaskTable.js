/**
Copyright Axiom, Inc
Thomas Mayfield
*/

dojo.provide("axiom.widget.SearchTaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.TaskTable");
dojo.require("axiom.widget.EditTaskModal");
dojo.require("axiom.widget.SubmitTaskModal");
dojo.require("axiom.widget.DeleteTaskModal");
dojo.require("axiom.widget.ApproveTaskModal");
dojo.require("axiom.widget.RejectTaskModal");
dojo.require("axiom.widget.PendingTaskTable");
dojo.require("axiom.widget.OpenTaskTable");

dojo.widget.defineWidget(
	"axiom.widget.SearchTaskTable", 
	axiom.widget.OpenTaskTable,
	function(){},
	{
		numCols: 7,
		nonSubmittable: {},
		nonDeletable: {},
		nonApprovable: {},
		nonRejectable: {},
		approveButton: null,
		rejectButton: null,
		username: '',
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SearchTaskTable.html'),
		insertRow: function(task){
			var row_id = task.task_id + 'search';
			var status = task.status == 'Rejected' ? '<span class="alert">'+task.status+'</span>' : task.status;
			var edit_icon = document.createElement('img');
			edit_icon.src = axiom.staticPath +'/axiom/images/icon_edit.gif';
			edit_icon.style.cursor = 'pointer';
			dojo.event.kwConnect({srcObj: edit_icon,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc:  'editTask'});
			var row = this.createRow({
				id: row_id,
				cols: [ {content: edit_icon,      'class': 'col_action' }, 
						{content: task.task_id,   'class': 'col_open_id' }, 
						{content: task.name,      'class': 'col_task_name', colspan: '2'},
						{content: task.objects.length,  'class': 'col_task_items' },
						{content: this.formatDate(task.due_date),  'class': 'col_due_date' },
						{content: status,         'class': 'col_status' }]
			})

			this.results_body.appendChild(row);

			if(task.submittable){ dojo.html.addClass(row, 'submittable'); }
			if(task.deletable){ dojo.html.addClass(row, 'deletable'); }
 			if(task.approvable){ dojo.html.addClass(row, 'approvable'); }
			if(task.rejectable){ dojo.html.addClass(row, 'rejectable'); }

			this.insertObjectRows(task, row_id);
		},
		refresh:function(args){
			dojo.dom.removeChildren(this.results_body)
			this.selectedRows = {};
			if(!args.username){
				args.username = this.username;
			}
			this.search(args);
		},
		onSelect:function(row){
			var actions = {'Submittable': this.submitButton,
				           'Deletable': this.deleteButton,
				           'Approvable': this.approveButton,
				           'Rejectable': this.rejectButton};
			for(var action in actions){
				if(!dojo.html.hasClass(row, action.toLowerCase())){
					dojo.html.addClass(actions[action], 'form-button-disabled');
					this['non'+action][row.id] = true;
				}
			}
			this.checkButtons();
		},
		onUnselect:function(row){
			if(row.id != this.activeRow){
				delete this.nonSubmittable[row.id];
				delete this.nonDeletable[row.id];
				delete this.nonApprovable[row.id];
				delete this.nonRejectable[row.id];
			}
			this.checkButtons();
		},
		hideSearch: function(){
			axiom.tasks.taskPanel.hideSearch();
		},
		checkButtons: function(){
			this.checkButton(this.nonSubmittable, this.submitButton);
			this.checkButton(this.nonDeletable,   this.deleteButton);
			this.checkButton(this.nonApprovable,  this.approveButton);
			this.checkButton(this.nonRejectable,  this.rejectButton);
		},
		handleResults:function(type, data, req){
			this.widget.nonRejectable = {};
			this.widget.nonApprovable = {};
			this.widget.nonDeletable = {};
			this.widget.nonSubmittable = {};
			this.widget.username.innerHTML = axiom.tasks.taskFilter.userList.value;
			if(this.widget.insertResults(data)){
				var buttons = this.widget.insertButtonRow(
					[{text: "Submit",  callback: 'submitTasks'}, 
					 {text: "Delete",  callback: 'deleteTasks'}, 
					 {text: "Approve", callback: 'approveTasks'},
					 {text: "Reject",  callback: 'rejectTasks'}] );
				this.widget.submitButton = buttons[0];
				this.widget.deleteButton = buttons[1];
				this.widget.approveButton = buttons[2];
				this.widget.rejectButton = buttons[3];
			}
		},
		postCreate:function() {
			dojo.lang.mixin(this, {approveTasks: axiom.widget.PendingTaskTable.prototype.approveTasks,
								   rejectTasks: axiom.widget.PendingTaskTable.prototype.rejectTasks});
			this.tablewrap.style.display = 'block';
			this.searchUrl = this.appPath+ 'cms/search_tasks';
		}
	}
);