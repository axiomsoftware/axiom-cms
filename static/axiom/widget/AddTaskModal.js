/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.AddTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.EditTaskModal");

dojo.widget.defineWidget(
	"axiom.widget.AddTaskModal",
	axiom.widget.EditTaskModal,
	function(){},
	{
		appPath:    '',
		staticPath: '',
		prototype:  '',
		selectNode: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/EditTaskModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/EditTaskModal.css'),
		editCallback:function(evt,data,req){
			axiom.lastTaskID++; 
			axiom.loadEdit(this.widget.appPath + 'cms/cms_add?prototype='+this.widget.prototype+'&task_id='+data.task_id);
			this.widget.close();
		},
		onEnter:function(){
			this.saveTask();
		},
		saveTask:function(){
			var widget = this;
			if(axiom.validateForm('edit-task')){
				dojo.io.bind({url:axiom.cmsPath+'add_task',
							  contentType: 'text/json',
							  mimetype: 'text/javascript',
							  method: 'post',
							  preventCache: true,
							  postContent: dojo.json.serialize(axiom.getFormData('edit-task', true)),
							  load: this.editCallback,
							  error: this.onError,
							  widget: widget
							 });
			}
		},
		onError:function(){
			axiom.openModal({content: "Error while saving task."});
		},
		postCreate:function() {
			this.title.innerHTML = 'Add Task';
			this.idRow.style.display = 'none';
			for(var i in axiom.allUsers){
				var opt = document.createElement('option');
				opt.innerHTML = axiom.allUsers[i];
				opt.value = axiom.allUsers[i];
				if(axiom.currentUser == axiom.allUsers[i])
   					opt.setAttribute('selected', true);
				this.assigneeField.appendChild(opt);
			}
			this.datePicker = dojo.widget.createWidget('DropdownDatePicker', {inputName:'due_date'}, this.datePickerNode);
			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_add.gif';
			this.nameField.value = axiom.currentUserFullName + "'s Task " + parseInt(axiom.lastTaskID + 1);
		}
	}
);
