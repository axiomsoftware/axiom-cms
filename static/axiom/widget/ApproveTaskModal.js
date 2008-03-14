/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.ApproveTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.ApproveTaskModal", 
	axiom.widget.AxiomModal,
	function(){},
	{
		descriptionField: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath: new dojo.uri.dojoUri('../axiom/widget/resources/ApproveTaskModal.css'),
		close:function(){
			axiom.closeModal();
		},
		approveTasks:function(){
			var task_ids = this.getTaskIds();
			this.doTaskAction({url: 'cms/approve_tasks',  
							   params: {task_ids: task_ids,
										description: this.descriptionField.value },
							   message: this.taskListString(task_ids)+"been approved and published."});
		},
		postCreate:function() {

			this.title.innerHTML = "Approve Tasks";
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}

			var list = document.createElement('textarea');
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);
			list.value = textList.join("\n");
			
			var holder = document.createElement('div');
			var label = document.createElement('label');
			label.setAttribute('for', 'description');
			label.innerHTML = 'Description: ';
			holder.appendChild(label);
			var desc = document.createElement('textarea');
			desc.style.width="77.5%";
			desc.name = 'description';
			holder.appendChild(desc);
			this.descriptionField = desc;
			this.mainContent.appendChild(holder);

			this.modalButtons.innerHTML = '';
			var approveButton = document.createElement('a');
			approveButton.className = 'button form-button';
			approveButton.innerHTML = "Approve";
			dojo.event.kwConnect({srcObj: approveButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'approveTasks'});
			this.modalButtons.appendChild(approveButton);

			var cancelButton = document.createElement('a');
			cancelButton.className = 'button form-button';
			cancelButton.innerHTML = "Cancel";
			dojo.event.kwConnect({srcObj: cancelButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'close'});
			this.modalButtons.appendChild(cancelButton);

			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_approve.gif';

		}
	}
);
