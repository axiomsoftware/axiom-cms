axiom.settings = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('SettingsNav')){
			dojo.require("axiom.widget.SettingsNav");
			dojo.require("axiom.widget.GeneralSettings");
			
			axiom.settings.nav = dojo.widget.createWidget('axiom:SettingsNav', {}, dojo.byId('SettingsNav'));
			axiom.settings.general = dojo.widget.createWidget('axiom:GeneralSettings', {}, dojo.byId('General'));
			axiom.settings.nav.registerModule(axiom.settings.general, "General Settings");
		}
	}
}
dojo.addOnLoad(axiom.settings.init);
