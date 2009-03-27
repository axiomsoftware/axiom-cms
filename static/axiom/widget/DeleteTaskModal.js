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

dojo.provide("axiom.widget.DeleteTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.DeleteTaskModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		close:function(){
			axiom.closeModal();
		},
		onEnter: function(){
			this.deleteTasks();
		},
		deleteTasks:function(){
			var task_ids = this.getTaskIds(this.taskList);
			this.doTaskAction({ url: axiom.cmsPath + 'delete_tasks', 
								params: {task_ids: task_ids}, 
								message: this.taskListString(task_ids)+"been deleted and all content reverted and unlocked."});
		},
		postCreate:function() {
			this.title.innerHTML = "Delete Tasks";
			var warning = document.createElement('p');
			warning.innerHTML = 'You are about to DELETE the following tasks.  All content changes will be discarded and unlocked.';
			this.mainContent.appendChild(warning);
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}
			var list = document.createElement('textarea');
			list.value = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);

			if(!axiom.isContentContributor){
				var warning2 = document.createElement('p');
				warning2.innerHTML = 'If any of the tasks being deleted are not assigned to you, an email will be sent to the assignee informing them of the deletion.';
				this.mainContent.appendChild(warning2);
			}

			this.modalButtons.innerHTML = '';
			var deleteButton = document.createElement('a');
			deleteButton.className = 'button form-button';
			deleteButton.innerHTML = "Delete";
			dojo.event.kwConnect({srcObj: deleteButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'deleteTasks'});
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
