/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.EditTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.EditTaskModal", 
	axiom.widget.AxiomModal,
	function(){},
	{
		descriptionField: null,
		task: null,
		datePicker: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/EditTaskModal.html'),
		close:function(){
			axiom.closeModal();
		},
		editCallback: function(evt, data, req){
			if(data){
				axiom.openModal({content: data.errors[0]});
			} else{ 
				this.widget.close();
				axiom.tasks.taskPanel.refreshAll();
			}
		},
		saveTask:function(){
			var widget = this;
			if(axiom.validateForm('edit-task')){ 
				dojo.io.bind({url: this.task.href+'/save_task',
							  method: 'post',
							  mimetype: 'text/javascript',
							  contentType: 'text/json',
							  preventCache: true,
							  widget: widget,
							  load: widget.editCallback,
							  postContent: dojo.json.serialize(axiom.getFormData('edit-task', true))
							 });
			}
		},
		postCreate:function() {
			this.idCell.innerHTML = this.task.task_id;
			this.nameField.value = this.task.name;
			this.descriptionField.innerHTML = this.task.description;
			var userlist = this.task.status == 'Pending' ? axiom.adminsAndEditors  : axiom.allUsers; 
			for(var i in userlist){
				var opt = document.createElement('option');
				opt.innerHTML = userlist[i];
				opt.value = userlist[i];
				if(this.task.assignee == userlist[i])
					opt.setAttribute('selected', true);
				this.assigneeField.appendChild(opt);
			}
			this.datePicker = dojo.widget.createWidget('DropdownDatePicker', {inputName:'due_date', value: this.task.due_date}, this.datePickerNode);
			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_edit.gif';
		}
	}
);
