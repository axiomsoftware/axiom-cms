/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.DeleteObjectsModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.DeleteObjectsModal", 
	axiom.widget.AxiomModal,
	function(){},
	{
		taskField: null,
		errorField: null,
		objects: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/DeleteObjectsModal.css'),
		close:function(){
			axiom.closeModal();
		},
		addToTask:function(){
			if(this.taskField.value != "--Choose One--"){
				var task_id = this.taskField.value.match(/^\d*/)[0];
				var message; 
				if(this.objects.length < 2 ){
					message = this.objects[0].title + ' has been added to task ' + task_id + ' for deletion.';
				} else {
					message = this.objects.length +' content objects have been added to task '+ task_id + ' for deletion.';
				}
				this.doTaskAction({url:      'add_to_delete_task',  
								   params:   {objects: this.objects, task_id: task_id},
								   message:  message,
								   callback: function(){axiom.cfilter.search()}
								  });
				
			} else{
				this.errorField.style.display = 'block';
				this.errorField.innerHTML = "Please select a task before proceeding.";
			}
		},
		deleteObjects: function(){
			var widget = this;
			var message;
			if(this.objects.length < 2 ){
				message = this.objects[0].title + ' has been deleted.';
			} else {
				message = this.objects.length +' content objects have been deleted.';
			}
			
			dojo.io.bind({ url: 'cms/delete_objects',
						   method: 'post',
						   contentType: 'text/json',
						   postContent: dojo.json.serialize({objs: this.objects}),
						   load: function() { 
							   widget.close();
							   axiom.showMessage(message)
							   axiom.cfilter.search();
						   },
						   error: function() { axiom.openModal({content: "Error deleting objects."}) }
						 });
		},
		postCreate:function() {
			// if-cms-version-enterprise
			this.title.innerHTML = "Add Content to Task for Deletion";
			// end-cms-if
			// if-cms-version-workgroup|standard
			this.title.innerHTML = "Delete Objects";
			// end-cms-if

			var textList = [];
			for(var i in this.objects){
				textList.push(this.objects[i].title);
			}
			var list = document.createElement('textarea');
			list.innerHTML = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);
			
			// if-cms-version-enterprise
			var error_field = document.createElement('div');
			error_field.className = 'error_message';
			this.errorField = error_field;
			this.mainContent.appendChild(error_field);

			var task_label = document.createElement('label');
			task_label.innerHTML = '<span class="required">*</span>Task: ';
			this.mainContent.appendChild(task_label);

			var task_list = document.createElement('select');
			task_list.innerHTML = "<option>--Choose One--</option>";
			for(var i in axiom.myAssignedTasks){
				var task = axiom.myAssignedTasks[i];
				var opt = document.createElement('option');
				opt.innerHTML = task.task_id + ' - ' +task.name;
				opt.value = task.task_id + ' - ' +task.name;
				task_list.appendChild(opt);
			}
			this.taskField = task_list;
			this.mainContent.appendChild(task_list);
			// end-cms-if
			// if-cms-version-personal|standard
			var warning = document.createElement('div');
			warning.innerHTML = "Are you sure you want to delete the selected content listed above?"
			this.mainContent.appendChild(warning);
			// end-cms-if

			this.modalButtons.innerHTML = '';
			var saveButton = document.createElement('a');
			saveButton.className = 'button form-button';
			// if-cms-version-enterprise
			saveButton.innerHTML = "Save";
			// end-cms-if
			// if-cms-version-personal|standard
			saveButton.innerHTML = "Delete";
			// end-cms-if

			dojo.event.kwConnect({srcObj: saveButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  // if-cms-version-enterprise
								  adviceFunc: 'addToTask'
								  // end-cms-if
								  // if-cms-version-workgroup|standard
								  adviceFunc: 'deleteObjects'
								  // end-cms-if
								 });
			this.modalButtons.appendChild(saveButton);

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
