/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.ReportGenerator");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ReportGenerator",
	dojo.widget.HtmlWidget,
	function(){},
	{
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ReportGenerator.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ReportGenerator.css'),
		hideAll: function(){
			if(this.taskReport)
				this.taskReport.style.display = 'none';
			if(this.lockedContentReport)
				this.lockedContentReport.style.display = 'none';
			if(this.archivedTaskReport)
				this.archivedTaskReport.style.display = 'none';
			if(this.objectActionReport)
				this.objectActionReport.style.display = 'none';
			if(this.usersReport)
				this.usersReport.style.display = 'none';
		},
		showTaskReport:function(){
			this.reportSelect.selectedIndex = 1;
			this.hideAll();
			this.taskReport.style.display = 'block';
		},
		showLockedContentReport:function(){
			this.reportSelect.selectedIndex = 3;
			this.hideAll();
			this.lockedContentReport.style.display = 'block';
		},
		showArchivedTaskReport:function(){
			this.reportSelect.selectedIndex = 2;
			this.hideAll();
			this.archivedTaskReport.style.display = 'block';
		},
		showObjectActionReport:function(){
			this.reportSelect.selectedIndex = 4;
			this.hideAll();
			this.objectActionReport.style.display = 'block';
		},
		showUsersReport:function(){
			this.reportSelect.selectedIndex = 5;
			this.hideAll();
			this.usersReport.style.display = 'block';
		},
		selectReport: function(){
			this.hideAll();
			var selected = this.reportSelect.value;
			if(selected != '--Choose One--'){
				this[selected].style.display = 'block';
			}
		},
		postCreate:function() {
			this.afterDatePicker = dojo.widget.createWidget('DropdownDatePicker', {inputName: 'afterDate',displayFormat:'MM/dd/yyyy'}, this.afterDate);
			this.afterDatePicker.inputNode.style.width="60px";
			
			this.beforeDatePicker = dojo.widget.createWidget('DropdownDatePicker', {inputName: 'beforeDate',displayFormat:'MM/dd/yyyy'}, this.beforeDate);
			this.beforeDatePicker.inputNode.style.width="60px";
			
			if(axiom.isContentContributor){
				this.usersReportOption.style.display = 'none';
			}

			for(var i in axiom.allUsers){
				var opt = document.createElement('option');
				opt.value = axiom.allUsers[i];
				opt.innerHTML = axiom.allUsers[i];
				this.assignee.appendChild(opt);
				this.owner.appendChild(opt.cloneNode(true));
			}

			dojo.event.kwConnect({ srcObj:  this.reportSelect,
								   srcFunc: 'onchange',
								   adviceObj: this,
								   adviceFunc: 'selectReport'});
		}
	}
);
