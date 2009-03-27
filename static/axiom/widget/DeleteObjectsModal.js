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
		onEnter: function(){
			this.deleteObjects();
		},
		addToTask:function(){
			if(this.taskField.value){
				var task_id = this.taskField.value;
				var message;
				if(this.objects.length < 2 ){
					if (task_id == 'BYPASS') {
						message = this.objects[0].title + ' has been deleted.';
					} else {
						message = this.objects[0].title + ' has been added to task ' + task_id + ' for deletion.';
					}
				} else {
					if (task_id == 'BYPASS') {
						message = this.objects.length + ' content objects have been deleted.';
					} else {
						message = this.objects.length + ' content objects have been added to task '+ task_id + ' for deletion.';
					}
				}
				this.doTaskAction({url: axiom.cmsPath + 'add_to_delete_task',
								   params:   {objects: this.objects, task_id: task_id},
								   message:  message,
								   callback: function(){axiom.cfilter.search();}
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
				message = this.objects.length + ' content objects have been deleted.';
			}

			dojo.io.bind({ url: axiom.cmsPath + 'delete_objects',
						   method: 'post',
						   contentType: 'text/json',
						   postContent: dojo.json.serialize({objs: this.objects}),
						   load: function() {
							   widget.close();
							   axiom.showMessage(message);
							   axiom.cfilter.search();
						   },
						   error: function() { axiom.openModal({content: "Error deleting objects."}); }
						 });
		},
		postCreate:function() {
			this.title.innerHTML = "Delete Objects";

		    var table = document.createElement("table");
		    table.setAttribute("id", "Delete");
		    var thead = document.createElement("thead");
		    var thead_tr = document.createElement("tr");
		    var th_title = document.createElement("th");
		    th_title.setAttribute("width", "60%");
		    th_title.setAttribute("class", "title");
		    th_title.appendChild(document.createTextNode("Title"));
		    var th_affected = document.createElement("th");
		    th_affected.setAttribute("class", "affected");
		    th_affected.appendChild(document.createTextNode("Attached Objects (count)*"));
		    thead_tr.appendChild(th_title);
		    thead_tr.appendChild(th_affected);
		    thead.appendChild(thead_tr);
		    table.appendChild(thead);
		    var tbody = document.createElement("tbody");

			var textList = [];
			for(var i in this.objects){
			    var o = this.objects[i];
			    var tr = document.createElement("tr");
			    var td_title = document.createElement("td");
			    td_title.setAttribute("class", "title");
			    td_title.innerHTML = o.title;
			    var td_affected = document.createElement("td");
			    td_affected.setAttribute("class", "affected");
			    td_affected.innerHTML = o.num_children;
			    tr.appendChild(td_title);
			    tr.appendChild(td_affected);
			    tbody.appendChild(tr);
			}
		    table.appendChild(tbody);
		    this.mainContent.appendChild(table);
		    var note = document.createElement("p");
		    note.appendChild(document.createTextNode("* Attached objects will be automatically detached, but will not be removed from the CMS"));
		    note.setAttribute("class", "note");
		    this.mainContent.appendChild(note);

			var warning = document.createElement('div');
			warning.innerHTML = "Are you sure you want to delete the selected content listed above?";
			this.mainContent.appendChild(warning);

			this.modalButtons.innerHTML = '';
			var saveButton = document.createElement('a');
			saveButton.className = 'button form-button';
			saveButton.innerHTML = "Delete";

			dojo.event.kwConnect({srcObj: saveButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'deleteObjects'
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
