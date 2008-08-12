axiom.settings = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('SettingsNav')){
			dojo.require("axiom.widget.SettingsNav");
			dojo.require("axiom.widget.GeneralSettings");
			dojo.require("axiom.widget.SEOSettings");

			axiom.settings.nav = dojo.widget.createWidget('axiom:SettingsNav', {}, dojo.byId('SettingsNav'));

			axiom.settings.general = dojo.widget.createWidget('axiom:GeneralSettings', {}, dojo.byId('General'));
			axiom.settings.nav.registerModule(axiom.settings.general, "General");

			axiom.settings.seo = dojo.widget.createWidget('axiom:SEOSettings', {}, dojo.byId('SEO'));
			axiom.settings.nav.registerModule(axiom.settings.seo, "SEO");

			axiom.settings.nav.showWidget("General");
		}
	}
};
dojo.addOnLoad(axiom.settings.init);
