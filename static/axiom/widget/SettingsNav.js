/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.SettingsNav");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.SettingsNav",
	dojo.widget.HtmlWidget,
	function(){},
	{
		modules: {},
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SettingsNav.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/SettingsNav.css'),
		registerModule: function(widget, name){
			this.modules[name] = widget;
			var item = document.createElement('li');
			var link = document.createElement('a');
			link.innerHTML = name;
			dojo.event.kwConnect({srcObj: link,
								  srcFunc: 'onclick',
								  adviceObj: widget,
								  adviceFunc: 'show'});
			link.href= "javascript:void(0);";
			item.appendChild(link);
			this.modulesList.appendChild(item);
		},
		saveAll: function(){
			for(var name in this.modules)
				this.modules[name].save();
		}
	}
);
