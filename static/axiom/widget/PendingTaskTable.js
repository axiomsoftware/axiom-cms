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

dojo.provide("axiom.widget.PendingTaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.TaskTable");
dojo.require("axiom.widget.ApproveTaskModal");
dojo.require("axiom.widget.RejectTaskModal");

dojo.widget.defineWidget(
	"axiom.widget.PendingTaskTable", 
	axiom.widget.TaskTable,
	function(){},
	{
		appPath:'',
		data: {},
		numCols: 7,
		selectedRows:{},
		approveButton: null,
		rejectButton: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/PendingTaskTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/PendingTaskTable.css'),
		insertRow: function(task){
			var row_id = task.task_id + 'pending';
			this.results_body.appendChild(this.createRow({id: row_id,
														  cols: [{content: task.task_id,        'class': 'col_task_id' }, 
																 {content: task.name,           'class': 'col_task_name', colspan: '3'},
																 {content: task.objects ? task.objects.length : 0, 'class': 'col_task_items' },
																 {content: this.formatDate(task.due_date),   'class': 'col_due_date' },
																 {content: task.submitter+' on '+this.formatDate(task.lastmodified, true),  'class': 'col_by' }]
														 }));
			this.insertObjectRows(task, row_id);
		},
		onSelect:function(row){
			this.checkButton({}, this.approveButton);
			this.checkButton({}, this.rejectButton);
		},
		onUnselect:function(row){
			this.checkButton({}, this.approveButton);
			this.checkButton({}, this.rejectButton);
		},
		handleResults:function(type, data, req){
			if(this.widget.insertResults(data)){
				var buttons = this.widget.insertButtonRow([{text: "Approve", callback: 'approveTasks'}, {text: "Reject", callback: 'rejectTasks'} ]);
				this.widget.approveButton = buttons[0];
				this.widget.rejectButton = buttons[1];
			}
		},
		approveTasks:function(){
			if(!dojo.html.hasClass(this.approveButton, 'form-button-disabled')){
				var taskList = [];
				var offset = (this['axiom:searchtasktable'] ? 1 : 0);
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[1+offset].innerHTML, name: cells[2+offset].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:ApproveTaskModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		rejectTasks:function(){
			if(!dojo.html.hasClass(this.rejectButton, 'form-button-disabled')){
				var taskList = [];
				var offset = (this['axiom:searchtasktable'] ? 1 : 0);
				for(var id in this.selectedRows){
					var cells = dojo.byId(id).getElementsByTagName('td');
					taskList.push({task_id: cells[1+offset].innerHTML, name: cells[2+offset].innerHTML});
				}
				axiom.openModal({widget: dojo.widget.createWidget("axiom:RejectTaskModal", {taskList:taskList, staticPath: axiom.staticPath})});
			}
		},
		postCreate:function() {
			this.tablewrap.style.display = 'block';
			this.searchUrl = this.appPath+ 'cms/my_pending_tasks';
			this.search();
		}
	}
);
