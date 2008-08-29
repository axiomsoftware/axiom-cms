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
		visible_module: '',
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SettingsNav.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/SettingsNav.css'),
		registerModule: function(widget, name){
			var item = document.createElement('li');
			var link = document.createElement('a');
			link.innerHTML = name;
			dojo.event.kwConnect({srcObj: item,
								  srcFunc: 'onclick',
								  adviceFunc: function(){axiom.settings.nav.showWidget(name);}
								 });
			link.href= "javascript:void(0);";
			item.appendChild(link);
			this.modules[name] = {widget:widget, nav: item};
			this.modulesList.appendChild(item);
		},
		showWidget: function(name){
			for(var i in this.modules){
				this.modules[i].widget.hide();
				dojo.html.removeClass(this.modules[i].nav, 'active');

			}
			dojo.html.addClass(this.modules[name].nav, 'active');
			this.visible_module = name;
			this.modules[name].widget.show();
			axiom.showMessage('');

		},
		saveAll: function(){
			for(var name in this.modules) {
				if (this.visible_module == name) {
					this.modules[name].widget.save();
				}
			}
		}
	}
);
