/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


axiom.settings = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('SettingsNav')){
			dojo.require("axiom.widget.SettingsNav");
			dojo.require("axiom.widget.GeneralSettings");
			dojo.require("axiom.widget.SEOSettings");
		    dojo.require("axiom.widget.AnalyticsSettings");

			axiom.settings.nav = dojo.widget.createWidget('axiom:SettingsNav', {}, dojo.byId('SettingsNav'));

			axiom.settings.general = dojo.widget.createWidget('axiom:GeneralSettings', {}, dojo.byId('General'));
			axiom.settings.nav.registerModule(axiom.settings.general, "General");

			axiom.settings.seo = dojo.widget.createWidget('axiom:SEOSettings', {}, dojo.byId('SEO'));
			axiom.settings.nav.registerModule(axiom.settings.seo, "SEO");

			axiom.settings.analytics = dojo.widget.createWidget('axiom:AnalyticsSettings', {}, dojo.byId('Analytics'));
			axiom.settings.nav.registerModule(axiom.settings.analytics, "Analytics");

			axiom.settings.nav.showWidget("General");
		}
	}
};
dojo.addOnLoad(axiom.settings.init);
