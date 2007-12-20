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
 			// if-cms-version-enterprise
			this.reportSelect.selectedIndex = 4;
			// end-cms-if
			// if-cms-version-workgroup
			this.reportSelect.selectedIndex = 1;
			// end-cms-if
			this.hideAll();
			this.objectActionReport.style.display = 'block';
		},
		showUsersReport:function(){
			// if-cms-version-enterprise
			this.reportSelect.selectedIndex = 5;
			// end-cms-if
			// if-cms-version-workgroup
			this.reportSelect.selectedIndex = 2;
			// end-cms-if
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

			// if-cms-version-enterprise
			for(var i in axiom.allUsers){
				var opt = document.createElement('option');
				opt.value = axiom.allUsers[i];
				opt.innerHTML = axiom.allUsers[i];
				this.assignee.appendChild(opt);
				this.owner.appendChild(opt.cloneNode(true));
			}
			// end-cms-if

			dojo.event.kwConnect({ srcObj:  this.reportSelect,
								   srcFunc: 'onchange',
								   adviceObj: this,
								   adviceFunc: 'selectReport'});
		}
	}
);
