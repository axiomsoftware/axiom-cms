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
		scheduleInput: null,
		scheduleDate: null,
		scheduleHour: null,
		scheduleMinute: null,
		scheduleMeridiem: null,
		validateErrorField: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/SubmitTaskModal.css'),
		close:function(){
			axiom.closeModal();
		},
		onEnter: function(){
			this.submitTasks();
		},
		submitTasks:function(){
			var task_ids = this.getTaskIds();

			if (this.publishInput) {
				if (this.publishInput.checked) {
					this.doTaskAction({url: axiom.cmsPath + 'approve_tasks',
									   params: {task_ids: task_ids},
									   message: this.taskListString(task_ids)+"been approved and published."});
				}
			}

			if (this.scheduleInput) {
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
									   params: {task_ids: task_ids, schedule_date: schedule_date.valueOf()},
									   message: this.taskListString(task_ids)+"been scheduled for publish."});
				}
			}


			if(axiom.isContentContributor || this.submitInput.checked){
				if(this.userSelect.value != "-- Choose One --"){
					this.doTaskAction({url: axiom.cmsPath + 'submit_tasks',
									   params: {task_ids: task_ids,
												assignee: this.userSelect.value},
									   message: this.taskListString(task_ids)+"been submitted for approval."});
				} else {
					this.validateErrorField.style.display = 'block';
					this.validateErrorField.innerHTML = 'Please select a user.';
				}
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

				var publishLabel = document.createElement('label');
				publishLabel.htmlFor = 'publish';
				publishLabel.innerHTML = "Publish to website";
				holder.appendChild(publishLabel);

				holder.appendChild(document.createElement('br'));

				var scheduleHolder = document.createElement('div');
				dojo.html.addClass(scheduleHolder, 'submit-schedule');

				var scheduleInput;
				if(dojo.render.html.ie){
					scheduleInput = document.createElement('<input type="radio" id="schedule" value="schedule" name="submitOption"/>');
				} else{
					scheduleInput = document.createElement('input');
					scheduleInput.type = 'radio';
					scheduleInput.value = 'schedule';
					scheduleInput.id = 'schedule';
					scheduleInput.name = 'submitOption';
				}
				holder.appendChild(scheduleInput);
				this.scheduleInput = scheduleInput;
				var scheduleLabel = document.createElement('label');
				scheduleLabel.htmlFor = 'schedule';
				scheduleLabel.innerHTML = "Publish at this date and time:";
				holder.appendChild(scheduleLabel);
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

				holder.appendChild(document.createElement('br'));
				holder.appendChild(validateErrorField);

				var submitInput;
				if(dojo.render.html.ie){
					submitInput = document.createElement('<input type="radio" id="submit" value="submitOption" name="submitOption"/>');
				} else {
					submitInput = document.createElement('input');
					submitInput.type = 'radio';
					submitInput.value = 'submit';
					submitInput.id = 'submitOption';
					submitInput.name = 'submitOption';
				}
				holder.appendChild(submitInput);
				this.submitInput = submitInput;
				var submitLabel = document.createElement('label');
				submitLabel.htmlFor = 'submitOption';
				submitLabel.innerHTML = "Submit for approval to:";
				holder.appendChild(submitLabel);
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
