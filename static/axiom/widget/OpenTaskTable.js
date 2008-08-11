/**
Copyright Axiom, Inc
Thomas Mayfield
*/

dojo.provide("axiom.widget.OpenTaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.TaskTable");
dojo.require("axiom.widget.EditTaskModal");
dojo.require("axiom.widget.SubmitTaskModal");
dojo.require("axiom.widget.DeleteTaskModal");

dojo.widget.defineWidget(
	"axiom.widget.OpenTaskTable", 
	axiom.widget.TaskTable,
	function(){},
	{
		appPath:'',
		data: {},
		nonSubmittable: {},
		selectedRows:{},
		numCols: 8,
		submitButton: null,
		deleteButton: null,
		sortObj: { status: 'desc', _created: 'desc', task_id: 'desc'},
		sortDirections: { task_id: 'asc',
						  name: 'desc',
						  due_date: 'desc',
						  status: 'desc'
						},
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/OpenTaskTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/OpenTaskTable.css'),
		insertRow: function(task){
			var row_id = task.task_id + 'open';
			var status = task.status == 'Rejected' ? '<span class="alert">'+task.status+'</span>' : task.status;
			var edit_icon = document.createElement('img');
			edit_icon.src = axiom.staticPath +'/axiom/images/icon_edit.gif';
			edit_icon.style.cursor = 'pointer';
			dojo.event.kwConnect({srcObj: edit_icon,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc:  'editTask'});
			var row = this.createRow({id: row_id,
				cols: [ {content: edit_icon,      'class': 'col_action' }, 
				{content: task.task_id,   'class': 'col_open_id' }, 
				{content: task.name,      'class': 'col_task_name', colspan: '2'},
				{content: task.objects.length,  'class': 'col_task_items' },
				{content: this.formatDate(task.due_date),  'class': 'col_due_date' },
				{content: status,         'class': 'col_status' },
				{content: (task.admin_actor || task.creator)+' on '+this.formatDate(task.lastmodified,true),   'class': 'col_by' }]
					  })
			this.results_body.appendChild(row);
			if(task.status.match(/Incomplete|Rejected/)){
				dojo.html.addClass(row, 'submittable');
			}
			this.insertObjectRows(task, row_id);
		},
		onSelect:function(row){
			if(!dojo.html.hasClass(row, 'submittable')){
				dojo.html.addClass(this.submitButton, 'form-button-disabled');
				this.nonSubmittable[row.id] = true;
			}
			this.checkButtons();
		},
		onUnselect:function(row){
			if(row.id != this.activeRow){
				delete this.nonSubmittable[row.id];
			}
			this.checkButtons();
		},
		checkButtons: function(){
			this.checkSubmitButton();
			this.checkDeleteButton();
		},
		checkSubmitButton:function(){
			this.checkButton(this.nonSubmittable, this.submitButton);
		},
		checkDeleteButton:function(){
			this.checkButton({}, this.deleteButton);
		},
		handleResults:function(type, data, req){
			if(this.widget.insertResults(data)){
				var buttons = this.widget.insertButtonRow([{text: "Submit", callback: 'submitTasks'}, {text: "Delete", callback: 'deleteTasks'}, ]);
				this.widget.submitButton = buttons[0];
				this.widget.deleteButton = buttons[1];
			}
		},
		deleteTasks:function(){
			if(!dojo.html.hasClass(this.deleteButton, 'form-button-disabled')){
				var taskList = [];
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[2].innerHTML, name: cells[3].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:DeleteTaskModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		submitTasks:function(){
			if(!dojo.html.hasClass(this.submitButton, 'form-button-disabled')){
				var taskList = [];
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[2].innerHTML, name: cells[3].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:SubmitTaskModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		postCreate:function() {
			this.tablewrap.style.display = 'block';
			this.searchUrl = axiom.cmsPath + 'my_open_tasks';
			this.search();
		}
	}
);
