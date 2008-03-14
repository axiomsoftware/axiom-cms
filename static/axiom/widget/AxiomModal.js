/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.AxiomModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.AxiomModal", 
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		staticPath:'',
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.html'),
		templateCssPath: new dojo.uri.dojoUri('../axiom/widget/resources/AxiomModal.css'),
		close:function(){
			axiom.closeModal();
		},
		okCallback:function(){
			this.close();
		},
		getTaskIds: function(){
			var task_ids = [];
			for(var i in this.taskList){
				task_ids.push(this.taskList[i].task_id);
			}
			return task_ids;
		},
		doTaskAction:function(data){
			dojo.io.bind({ url: data.url,
						   contentType: 'text/json',
						   method: 'post',
						   postContent: dojo.json.serialize(data.params),
						   load: function(){ 
							   axiom.showMessage(data.message);
							   if(typeof data.callback == 'function') 
								   data.callback();
							   else
								   axiom.tasks.taskPanel.refreshAll();
						   }
						 });
			axiom.closeModal();
		},
		taskListString:function(tasks){
			var msg;
			if(tasks.length > 2){
				msg = "Tasks "+tasks.slice(0, tasks.length-1).concat("and " +tasks[tasks.length-1]).join(', ')+" have ";
			} else if(tasks.length == 2){
				msg = "Tasks "+tasks[0] + " and " + tasks[1]+" have ";
			}else {
				msg = "Task "+tasks[0]+" has ";
			}
			return msg;
		},
		postCreate:function() {
			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_edit.gif';
			this.mainContent.innerHTML = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla posuere. Donec vitae dolor. Nullam tristique diam non turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum accumsan nisl.";
		}
	}
);
