/**
Copyright Axiom, Inc
Thomas Mayfield
*/

dojo.provide("axiom.widget.ScheduledTaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.TaskTable");
dojo.require("axiom.widget.CancelScheduleModal");
dojo.require("axiom.widget.RescheduleTaskModal");

dojo.widget.defineWidget(
	"axiom.widget.ScheduledTaskTable", 
	axiom.widget.TaskTable,
	function(){},
	{
		appPath:'',
		data: {},
		nonSubmittable: {},
		selectedRows:{},
		numCols: 6,
		cancelButton: null,
		rescheduleButton: null,
		sortObj: { status: 'desc', _created: 'desc', task_id: 'desc'},
		sortDirections: { task_id: 'asc',
						  name: 'desc',
						  due_date: 'desc',
						  status: 'desc'
						},
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ScheduledTaskTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ScheduledTaskTable.css'),
		insertRow: function(task){
			var row_id = task.task_id + 'scheduled';
			var row = this.createRow({id: row_id,
				cols: [ {content: task.task_id,   'class': 'col_task_id' }, 
				{content: task.name,      'class': 'col_name', colspan: '2'},
				{content: task.objects.length,  'class': 'col_items' },
				{content: this.formatPublishDate(task.publish_date), 'class': 'col_publish_date' },
				{content: (task.admin_actor || task.creator)+' on '+this.formatDate(task.lastmodified,true),   'class': 'col_by' }]
					  })
			this.results_body.appendChild(row);
			this.insertObjectRows(task, row_id);
		},
		formatPublishDate:function(dateobj) {
			var result;
			try {
				result = dojo.date.strftime(dateobj,'%m/%d/%y at %I:%M %p');
			} catch(e) {
				result = '';
			}
			return result;
		},
		onSelect:function(row){
			this.checkButtons();
		},
		onUnselect:function(row){
			this.checkButtons();
		},
		checkButtons: function(){
			this.checkSubmitButton();
			this.checkDeleteButton();
		},
		checkSubmitButton:function(){
			this.checkButton({}, this.cancelButton);
		},
		checkDeleteButton:function(){
			this.checkButton({}, this.rescheduleButton);
		},
		handleResults:function(type, data, req){
			if(this.widget.insertResults(data) && !axiom.isContentContributor){
				var buttons = this.widget.insertButtonRow([{text: "Cancel", callback: 'cancelPublish'}, {text: "Reschedule", callback: 'rescheduleTasks'}, ]);
				this.widget.cancelButton = buttons[0];
				this.widget.rescheduleButton = buttons[1];
			}
		},
		cancelPublish:function(){
			if(!dojo.html.hasClass(this.submitButton, 'form-button-disabled')){
				var taskList = [];
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[1].innerHTML, name: cells[2].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:CancelScheduleModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		rescheduleTasks:function(){
			if(!dojo.html.hasClass(this.rescheduleButton, 'form-button-disabled')){
				var taskList = [];
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[1].innerHTML, name: cells[2].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:RescheduleTaskModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		postCreate:function() {
			this.tablewrap.style.display = 'block';
			this.searchUrl = axiom.cmsPath + 'my_scheduled_tasks';
			this.search();
		}
	}
);
