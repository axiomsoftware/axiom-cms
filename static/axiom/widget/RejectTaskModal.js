/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.RejectTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.RejectTaskModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		reasonField: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/RejectTaskModal.css'),
		close:function(){
			axiom.closeModal();
		},
		onEnter: function(){
			this.rejectTasks();
		},
		rejectTasks:function(){
			var task_ids = this.getTaskIds();
			this.doTaskAction({url: axiom.cmsPath + 'reject_tasks',  
							   params: {task_ids: task_ids,
										reason: this.reasonField.value},
							   message: this.taskListString(task_ids)+"been rejected."});
		},
		postCreate:function() {
			this.title.innerHTML = "Reject Tasks";
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}
			var list = document.createElement('textarea');
			list.value = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);

			var holder = document.createElement('div');
			var label = document.createElement('label');
			label.setAttribute('for', 'reason');
			label.innerHTML = '<span class="required">*</span>Reason For Rejection: ';
			holder.appendChild(label);
			var reason = document.createElement('textarea');
			reason.style.width="57%";
			reason.name = 'reason';
			holder.appendChild(reason);
			this.reasonField = reason;
			this.mainContent.appendChild(holder);

			this.modalButtons.innerHTML = '';
			var rejectButton = document.createElement('a');
			rejectButton.className = 'button form-button';
			rejectButton.innerHTML = "Reject";
			dojo.event.kwConnect({srcObj: rejectButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'rejectTasks'});
			this.modalButtons.appendChild(rejectButton);

			var cancelButton = document.createElement('a');
			cancelButton.className = 'button form-button';
			cancelButton.innerHTML = "Cancel";
			dojo.event.kwConnect({srcObj: cancelButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'close'});
			this.modalButtons.appendChild(cancelButton);

			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_reject.gif';
		}
	}
);
