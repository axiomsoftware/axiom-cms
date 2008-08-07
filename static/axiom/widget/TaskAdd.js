/**
Copyright Siteworx
Thomas Mayfield
*/

dojo.provide("axiom.widget.TaskAdd");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.TaskAdd",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		datePicker:null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/TaskAdd.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/TaskAdd.css'),
		onAdd:function(evt, data, req){
			dojo.html.removeClass(this.widget.addButton, 'disabled');
			this.widget.nameField.value = '';
			this.widget.descField.value = '';
			this.widget.datePicker.inputNode.value = '';
			axiom.tasks.taskPanel.refreshAll();
			axiom.showMessage('Task '+data.task_id+' has been added.');
		},
		addTask:function() {
			if(dojo.html.hasClass(this.addButton, 'disabled')){ return; }
			if(!this.nameField.value){
				this.errorMessage.style.display='block';
				this.errorMessage.innerHTML = 'Name is required.';
				return;
			}
			dojo.html.addClass(this.addButton, 'disabled');
			this.errorMessage.style.display='none';
			var data = {
				name: this.nameField.value,
				description: this.descField.value };

			var date = this.datePicker.getDate();
			if(date && this.datePicker.inputNode.value != '')
				data.due_date = date.getTime();

			dojo.io.bind({url:this.appPath+'cms/add_task',
						  contentType: 'text/json',
						  mimetype: 'text/javascript',
						  method: 'post',
						  preventCache: true,
						  postContent: dojo.json.serialize(data),
						  load: this.onAdd,
						  error: this.onError,
						  widget: this
						 });
		},
		handleKey: function(evt){
			if(evt.keyCode == 13){
				this.addTask();
			}
		},
		postCreate:function() {
			this.datePicker = dojo.widget.createWidget('DropdownDatePicker', {}, this.dueDate);
			this.datePicker.inputNode.style.width = "88%";
			dojo.event.kwConnect({ srcObj: this.addButton,
								   srcFunc: 'onclick',
								   adviceObj: this,
								   adviceFunc: 'addTask'});
			dojo.event.kwConnect({ srcObj: this.nameField,
								   srcFunc: 'onkeypress',
								   adviceObj: this,
								   adviceFunc: 'handleKey'});
			dojo.event.kwConnect({ srcObj: this.datePicker.inputNode,
								   srcFunc: 'onkeypress',
								   adviceObj: this,
								   adviceFunc: 'handleKey'});

		}
	}
);
