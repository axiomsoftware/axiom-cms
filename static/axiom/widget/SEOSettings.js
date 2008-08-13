/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.SEOSettings");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.GeneralSettings");

dojo.widget.defineWidget(
	"axiom.widget.SEOSettings",
	axiom.widget.GeneralSettings,
	function(){},
	{

		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SEOSettings.html'),
		save: function(){
			dojo.io.bind({url: 'foozle',//axiom.cmsPath+'save',
						  formNode: 'seo_settings',
						  load: function() { axiom.showMessage("Settings saved."); },
						  error: function(){ },
						  method: "post",
						  transport: "IframeTransport"
						 });
		},
		postCreate: function(){
			dojo.io.bind({ url:         'robot_settings',
						   load:        this.loadSettings,
						   widget:      this});

		}
	}
);
