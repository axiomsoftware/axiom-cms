/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.SubmitTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.SubmitTaskModal", 
	axiom.widget.AxiomModal,
	function(){},
	{
		userSelect: null,
		submitInput: null,
		publishInput: null,
		validateErrorField: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		close:function(){
			axiom.closeModal();
		},
		submitTasks:function(){
			var task_ids = this.getTaskIds();
			if(axiom.isContentContributor || !this.publishInput.checked){
				if(this.userSelect.value != "-- Choose One --"){
					this.doTaskAction({url:'cms/submit_tasks',  
									   params: {task_ids: task_ids,
												assignee: this.userSelect.value},
									   message: this.taskListString(task_ids)+"been submitted for approval."});
				} else {
					this.validateErrorField.style.display = 'block';
					this.validateErrorField.innerHTML = 'Please select a user.';
				}
			} else{
				this.doTaskAction({url:'cms/approve_tasks',
								   params: {task_ids: task_ids},
								   message: this.taskListString(task_ids)+"been approved and published."});
			}
		},
		postCreate:function() {
			
			// title and task list
			this.title.innerHTML = "Submit Tasks";
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}
			var list = document.createElement('textarea');
			list.value = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);

			// create list of users for selection
			var user_select = document.createElement('select');
			var info_opt = document.createElement('option');
			info_opt.innerHTML = '-- Choose One --';
			user_select.appendChild(info_opt);
			for(var i in axiom.adminsAndEditors){
				var user = axiom.adminsAndEditors[i];
				if(user != axiom.currentUser){
					var opt = document.createElement('option');
					opt.innerHTML = user;
					opt.value = user;
					user_select.appendChild(opt);
				}
			}
			user_select.setAttribute('name', 'assignee');
			
			// submit options
			var holder = document.createElement('div');
			dojo.html.addClass(holder, 'selectLabel');
			var label = document.createElement('label');
			label.setAttribute('for', 'assignee');

			var validateErrorField = document.createElement('div');
			validateErrorField.className = 'error_message';
			this.validateErrorField = validateErrorField;

			if(axiom.isContentContributor){
				holder.appendChild(validateErrorField);
				label.innerHTML = '<span class="required">*</span> Submit to: ';
				label.style.display = 'inline';
				holder.appendChild(label);
				dojo.html.addClass(user_select, 'validate-empty');
				holder.appendChild(user_select);
			} else{
				label.innerHTML = 'Select an action: ';
				label.style.display = 'block';
				holder.appendChild(label);
				var publishInput;
				if(dojo.render.html.ie){
					publishInput = document.createElement('<input type="radio" value="publish" checked="true" name="submitOption"/>');
				} else{
					publishInput = document.createElement('input');
					publishInput.type = 'radio';
					publishInput.value = 'publish';
					publishInput.checked = true; 
					publishInput.name = 'submitOption';
				}
				holder.appendChild(publishInput);
				this.publishInput = publishInput;
				holder.appendChild(document.createTextNode("Publish to website"));
				
				holder.appendChild(document.createElement('br'));
				holder.appendChild(validateErrorField);
				
				var submitInput;
				if(dojo.render.html.ie){
					submitInput = document.createElement('<input type="radio" value="submit" name="submitOption"/>');
				} else {
					submitInput = document.createElement('input');
					submitInput.type = 'radio';
					submitInput.value = 'submit';
					submitInput.name = 'submitOption';
				}
				holder.appendChild(submitInput);
				this.submitInput = submitInput;
				holder.appendChild(document.createTextNode("Submit for approval to:"));
				holder.appendChild(user_select);
			}
			this.mainContent.appendChild(holder);

			// submit button
			this.userSelect = user_select;
			this.modalButtons.innerHTML = '';
			var submitButton = document.createElement('a');
			submitButton.className = 'button form-button';
			submitButton.innerHTML = "Submit";
			dojo.event.kwConnect({srcObj: submitButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'submitTasks'});
			this.modalButtons.appendChild(submitButton);

			// cancel button
			var cancelButton = document.createElement('a');
			cancelButton.className = 'button form-button';
			cancelButton.innerHTML = "Cancel";
			dojo.event.kwConnect({srcObj: cancelButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'close'});
			this.modalButtons.appendChild(cancelButton);

			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_submit.gif';
		}
	}
);
