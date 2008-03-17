/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.GeneralSettings");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.GeneralSettings",
	dojo.widget.HtmlWidget,
	function(){},
	{
		modules: {},
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/GeneralSettings.html'),
		//templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/GeneralSettings.css'),
		loadSettings: function(evt,data,req){
			this.widget.content.innerHTML = data;
		},
		save: function(){
			if(axiom.validateForm('general_settings')){
				axiom.submitEdit({edit_url: axiom.cmsPath+'save', 
								  form_id: 'general_settings',
								  callback: function() { window.close() },
								  submit_all: true});
			}
		},
		postCreate: function(){
			dojo.io.bind({ url:         'general_settings',
						   load:        this.loadSettings,
						   widget:      this});
						 
		}
	}
);
