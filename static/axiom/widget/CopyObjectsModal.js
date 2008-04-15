/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.CopyObjectsModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.CopyObjectsModal", 
	axiom.widget.AxiomModal,
	function(){},
	{
		taskField: null,
		errorField: null,
		prefixField: null,
		clearUrlField: null,
		objects: [],
		objectIds: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/CopyObjectsModal.css'),
		close:function(){
			axiom.closeModal();
		},
		addToTask:function(){
			if(this.taskField.value != "--Choose One--"){
				var task_id = this.taskField.value.match(/^\d*/)[0];
				var message; 
				if(this.objects.length < 2 ){
					message = this.objects[0].title + ' has been added to task ' + task_id + ' for copying.';
				} else {
					message = this.objects.length +' content objects have been added to task '+ task_id + ' for copying.';
				}
				this.doTaskAction({url:      'add_copy_to_task',  
								   params:   {objects: this.objects, task_id: task_id, prefix: this.prefixField.value, clear_url: this.clearUrlField.checked.toString()},
								   message:  message,
								   callback: function(){axiom.cfilter.search()}
								  });
				
			} else{
				this.errorField.style.display = 'block';
				this.errorField.innerHTML = "Please select a task before proceeding.";
			}
		},
		copyObjects: function(){
			var widget = this;
			var message;
			if(this.objects.length < 2 ){
				message = this.objects[0].title + ' has been copied.';
			} else {
				message = this.objects.length +' content objects have been copied.';
			}
			
			dojo.io.bind({ url: axiom.cmsPath + 'copy_objects',
						   method: 'post',
						   content: {objects: this.objectIds.join(','), prefix: this.prefixField.value, clear_url: this.clearUrlField.checked.toString()},
						   load: function() { 
							   widget.close();
							   axiom.showMessage(message)
							   axiom.cfilter.search();
						   },
						   error: function() { axiom.openModal({content: "Error copying objects."}) }
						 });
		},
		postCreate:function() {
			// if-cms-version-enterprise
			this.title.innerHTML = "Add Content to Task for Copying";
			// end-cms-if
			// if-cms-version-workgroup|standard
			this.title.innerHTML = "Copy Objects";
			// end-cms-if

			var prefix_label = document.createElement('label');
			prefix_label.innerHTML = 'Copy Prefix: ';
			this.mainContent.appendChild(prefix_label);
			
			var prefix_field = document.createElement('input');
			prefix_field.type = 'text';
			prefix_field.className = 'copy-prefix';
			prefix_field.value = 'Copy of ';
			this.mainContent.appendChild(prefix_field);
			this.prefixField = prefix_field;

			var clear_url_label = document.createElement('label');
			clear_url_label.innerHTML = 'Clear Location: ';
			this.mainContent.appendChild(clear_url_label);

			var clear_url_field = document.createElement('input');
			clear_url_field.type = 'checkbox';
			clear_url_field.className = 'clear-url';
			clear_url_field.checked = 'true';
			this.mainContent.appendChild(clear_url_field);
			this.clearUrlField = clear_url_field;

			var textList = [];
			for(var i in this.objects){
				this.objectIds.push(this.objects[i].id);
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
			var info = document.createElement('div');
			info.innerHTML = "The content listed above will be copied."
			this.mainContent.appendChild(info);
			// end-cms-if

			this.modalButtons.innerHTML = '';
			var saveButton = document.createElement('a');
			saveButton.className = 'button form-button';
			// if-cms-version-enterprise
			saveButton.innerHTML = "Save";
			// end-cms-if
			// if-cms-version-personal|standard
			saveButton.innerHTML = "Copy";
			// end-cms-if

			dojo.event.kwConnect({srcObj: saveButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  // if-cms-version-enterprise
								  adviceFunc: 'addToTask'
								  // end-cms-if
								  // if-cms-version-workgroup|standard
								  adviceFunc: 'copyObjects'
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

			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_copy.gif';
		}
	}
);
