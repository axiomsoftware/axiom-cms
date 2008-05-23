/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.CancelScheduleModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.CancelScheduleModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		close:function(){
			axiom.closeModal();
		},
		onEnter: function(){
			this.cancelTasks();
		},
		cancelTasks:function(){
			var task_ids = this.getTaskIds(this.taskList);
			this.doTaskAction({ url: axiom.cmsPath + 'cancel_tasks', 
								params: {task_ids: task_ids}, 
								message: this.taskListString(task_ids)+"been removed from the schedule for publish."});
		},
		postCreate:function() {
			this.title.innerHTML = "Cancel Scheduled Publish";
			var warning = document.createElement('p');
			warning.innerHTML = 'You are about to cancel the following approved and scheduled task(s). The task(s) status will be changed to "Incomplete" and the task will be moved to "My Open Tasks".';
			this.mainContent.appendChild(warning);
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}
			var list = document.createElement('textarea');
			list.value = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);

			var warning2 = document.createElement('p');
			warning2.innerHTML = 'Are you sure you want to continue?';
			this.mainContent.appendChild(warning2);

			this.modalButtons.innerHTML = '';
			var deleteButton = document.createElement('a');
			deleteButton.className = 'button form-button';
			deleteButton.innerHTML = "Continue";
			dojo.event.kwConnect({srcObj: deleteButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'cancelTasks'});
			this.modalButtons.appendChild(deleteButton);

			var cancelButton = document.createElement('a');
			cancelButton.className = 'button form-button';
			cancelButton.innerHTML = "Cancel";
			dojo.event.kwConnect({srcObj: cancelButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'close'});
			this.modalButtons.appendChild(cancelButton);

			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_delete.gif';
		}
	}
);
