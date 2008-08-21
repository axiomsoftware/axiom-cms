/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.SEOSettings");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.io.IframeIO");
dojo.require("axiom.widget.GeneralSettings");

dojo.widget.defineWidget(
	"axiom.widget.SEOSettings",
	axiom.widget.GeneralSettings,
	function(){},
	{

		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SEOSettings.html'),
		save: function(){
			dojo.io.bind({url: 'upload_seo_files',
						  formNode: dojo.byId('seo_settings'),
						  load: function() {
							  axiom.showMessage("Files saved.");
							  this.widget.reload();
						  },
						  error: function(e,t){ axiom.showMessage(t.message); },
						  mimetype: 'text/html',
						  method: "post",
						  widget: this,
						  transport: "IframeTransport"
						 });
			this.content.innerHTML = '<div style="width:100%;text-align:center;padding:25px 0;">'
									 + 'Loading...<br/><img src="'+axiom.staticPath + '/axiom/images/ajax-loader.gif" '
									 + 'alt="Loading..." /></div>';
		},
		reload: function(){
			dojo.io.bind({ url:         'robot_settings',
						   load:        this.loadSettings,
						   nocache: true,
						   widget:      this});
		},
		postCreate: function(){
			this.reload();
		}
	}
);
