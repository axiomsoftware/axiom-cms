/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.RescheduleTaskModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.RescheduleTaskModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		publishInput: null,
		scheduleInput: null,
		scheduleDate: null,
		scheduleHour: null,
		scheduleMinute: null,
		scheduleMeridiem: null,
		validateErrorField: null,
		taskList: [],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/RescheduleTaskModal.css'),
		close:function(){
			axiom.closeModal();
		},
		onEnter: function(){
			this.rescheduleTasks();
		},
		rescheduleTasks:function(){
			var task_ids = this.getTaskIds();

			if (this.publishInput) {
				if (this.publishInput.checked) {
					this.doTaskAction({url: axiom.cmsPath + 'approve_tasks',
									   params: {task_ids: task_ids},
									   message: this.taskListString(task_ids)+"been published."});
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
									   message: this.taskListString(task_ids)+"been rescheduled for publish."});
				}
			}

		},
		postCreate:function() {

			// title and task list
			this.title.innerHTML = "Reschedule Tasks";
			var textList = [];
			for(var i in this.taskList){
				textList.push(this.taskList[i].task_id + ' - ' + this.taskList[i].name);
			}
			var list = document.createElement('textarea');
			list.value = textList.join("\n");
			list.setAttribute('readonly', true);
			this.mainContent.appendChild(list);

			// submit options
			var holder = document.createElement('div');
			dojo.html.addClass(holder, 'selectLabel');
			var label = document.createElement('label');
			label.setAttribute('for', 'assignee');

			var validateErrorField = document.createElement('div');
			validateErrorField.className = 'error_message';
			this.validateErrorField = validateErrorField;

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
				publishInput.checked = true;
				publishInput.name = 'submitOption';
			}
			holder.appendChild(publishInput);
			this.publishInput = publishInput;
			holder.appendChild(document.createTextNode("Publish to website now"));

			holder.appendChild(document.createElement('br'));

			var scheduleHolder = document.createElement('div');
			dojo.html.addClass(scheduleHolder, 'reschedule');

			var scheduleInput;
			if(dojo.render.html.ie){
				scheduleInput = document.createElement('<input type="radio" value="schedule" name="submitOption"/>');
			} else{
				scheduleInput = document.createElement('input');
				scheduleInput.type = 'radio';
				scheduleInput.value = 'schedule';
				scheduleInput.name = 'submitOption';
			}
			holder.appendChild(scheduleInput);
			this.scheduleInput = scheduleInput;
			holder.appendChild(document.createTextNode("Publish at this date and time:"));
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


			this.mainContent.appendChild(holder);

			// submit button
			this.modalButtons.innerHTML = '';
			var rescheduleButton = document.createElement('a');
			rescheduleButton.className = 'button form-button';
			rescheduleButton.innerHTML = "Reschedule";
			dojo.event.kwConnect({srcObj: rescheduleButton,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'rescheduleTasks'});
			this.modalButtons.appendChild(rescheduleButton);

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
