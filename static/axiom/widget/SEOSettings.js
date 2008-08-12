/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.SEOSettings");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.SEOSettings",
	dojo.widget.HtmlWidget,
	function(){},
	{
		modules: {},
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SEOSettings.html'),
		loadSettings: function(evt,data,req){
			for(var i in data){
				this.widget.makeRobotField(i, data[i]);
			}
		},
		makeRobotField: function(name, list){
				var fieldset = document.createElement('fieldset');
				fieldset.innerHTML = '<label>'+(name=='__all__'?'All Robots':name)+': </label><textarea name="'+name+'">'
										 +list.join('\n')+'</textarea>';
				this.robot_content.appendChild(fieldset);

		},
		save: function(){
			if(axiom.validateForm('general_settings')){
// 				axiom.submitEdit({edit_url: axiom.cmsPath+'save',
// 								  form_id: 'general_settings',
// 								  callback: function() { window.close(); },
// 								  submit_all: true});
			}
		},
		showNewRobot: function(){
			this.new_robot_field.value = '';
			this.new_robot_wrapper.style.display = 'block';
		},
		enterOnNewRobotHandler: function(evt){
			if(evt.keyCode == 13){
				this.newRobot();
			}
		},
		newRobot: function(){
				this.makeRobotField(this.new_robot_field.value, []);
				this.new_robot_wrapper.style.display = 'none';
		},
		postCreate: function(){
 			dojo.io.bind({ url:         'robot_settings',
 						   load:        this.loadSettings,
						   mimetype: 'text/json',
 						   widget:      this});

		}
	}
);
