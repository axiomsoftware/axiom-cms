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
