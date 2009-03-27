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
		publishInput: null,
		scheduleInput: null,
		scheduleDate: null,
		scheduleHour: null,
		scheduleMinute: null,
		scheduleMeridiem: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath: new dojo.uri.dojoUri('../axiom/widget/resources/ApproveTaskModal.css'),
		close:function(){
			axiom.closeModal();
		},
		onEnter:function(){
			this.approveTasks();
		},
		approveTasks:function(){
			var task_ids = this.getTaskIds();
			var description = this.descriptionField.value;

			if (this.publishInput.checked) {
				this.doTaskAction({url: axiom.cmsPath + 'approve_tasks',
								   params: {task_ids: task_ids,
											description: description },
								   message: this.taskListString(task_ids)+"been approved and published."});
			}

			if (this.scheduleInput.checked) {
				var schedule_date = this.scheduleDate.getDate();
				if (this.scheduleMeridiem.value == "AM") {
					if (this.scheduleHour.value == '12') {
						schedule_date.setHours(0);
					} else {
						schedule_date.setHours(parseInt(this.scheduleHour.value));
					}
				} else {
					if (this.scheduleHour.value == '12') {
						schedule_date.setHours(12);
					} else {
						schedule_date.setHours(parseInt(this.scheduleHour.value) + 12);
					}
				}
				schedule_date.setMinutes(parseInt(this.scheduleMinute.value));
				this.doTaskAction({url: axiom.cmsPath + 'schedule_tasks',
								   params: {task_ids: task_ids, schedule_date: schedule_date.valueOf(), description: description},
								   message: this.taskListString(task_ids)+"been scheduled for publish."});
			}


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

			var action_title = document.createElement('div');
			action_title.innerHTML = 'Select an action: ';
			action_title.className = 'section-title';
			holder.appendChild(action_title);
			var publishInput;
			if(dojo.render.html.ie){
				publishInput = document.createElement('<input type="radio" id="publish" value="publish" checked="true" name="submitOption"/>');
			} else{
				publishInput = document.createElement('input');
				publishInput.type = 'radio';
				publishInput.value = 'publish';
				publishInput.id = 'publish';
				publishInput.checked = true;
				publishInput.name = 'submitOption';
			}
			holder.appendChild(publishInput);
			this.publishInput = publishInput;
			var publish_label = document.createElement('label');
			publish_label.innerHTML = "Approve and Publish to website now";
			publish_label.htmlFor = 'publish';
			holder.appendChild(publish_label);

			holder.appendChild(document.createElement('br'));

			var scheduleHolder = document.createElement('div');
			dojo.html.addClass(scheduleHolder, 'approve-schedule');

			var scheduleInput;
			if(dojo.render.html.ie){
				scheduleInput = document.createElement('<input type="radio" id="schedule" value="schedule" name="submitOption"/>');
			} else{
				scheduleInput = document.createElement('input');
				scheduleInput.type = 'radio';
				scheduleInput.id = 'schedule';
				scheduleInput.value = 'schedule';
				scheduleInput.name = 'submitOption';
			}
			holder.appendChild(scheduleInput);
			this.scheduleInput = scheduleInput;
			var schedule_label = document.createElement('label');
			schedule_label.htmlFor = 'schedule';
			schedule_label.innerHTML = "Approve and Publish at this date and time:";
			holder.appendChild(schedule_label);
			holder.appendChild(document.createElement('br'));
			scheduleHolder.appendChild(document.createTextNode("Date: "));
			var dateInput;
			if(dojo.render.html.ie){
				dateInput = document.createElement('<input type="text" name="publishdate"/>');
			} else {
				dateInput = document.createElement('input');
				dateInput.type = 'text';
				dateInput.name = 'publishdate';
			}
			scheduleHolder.appendChild(dateInput);
			this.scheduleDate = dojo.widget.createWidget('DropdownDatePicker', {value:'today'}, dateInput);
			this.scheduleDate.inputNode.className = 'submit-date';
			this.scheduleDate.inputNode.readOnly = true;
			scheduleHolder.appendChild(document.createElement('br'));

			var hour = document.createElement('select');
			var hours = ['12','1','2','3','4','5','6','7','8','9','10','11'];
			for (var i = 0; i < hours.length; i++) {
				var opt = document.createElement('option');
				opt.value = hours[i];
				opt.innerHTML = hours[i];
				hour.appendChild(opt);
			}
			scheduleHolder.appendChild(document.createTextNode("Time: "));
			dojo.html.addClass(hour, 'submit-time');
			scheduleHolder.appendChild(hour);
			this.scheduleHour = hour;

			scheduleHolder.appendChild(document.createTextNode(" :"));
			var minute = document.createElement('select');
			var minutes = ['00','15','30','45'];
			for (var j = 0; j < minutes.length; j++) {
				var opt = document.createElement('option');
				opt.value = minutes[j];
				opt.innerHTML = minutes[j];
				minute.appendChild(opt);
			}
			dojo.html.addClass(minute, 'submit-time');
			scheduleHolder.appendChild(minute);
			this.scheduleMinute = minute;

			var meridiem = document.createElement('select');
			var values = ['AM','PM'];
			for (var k = 0; k < values.length; k++) {
				var opt = document.createElement('option');
				opt.value = values[k];
				opt.innerHTML = values[k];
				meridiem.appendChild(opt);
			}
			dojo.html.addClass(meridiem, 'submit-time');
			scheduleHolder.appendChild(meridiem);
			this.scheduleMeridiem = meridiem;
			holder.appendChild(scheduleHolder);

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
