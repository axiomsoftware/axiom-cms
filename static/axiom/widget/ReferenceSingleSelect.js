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
  Thomas Mayfield, Dan Pozmanter
*/

dojo.provide("axiom.widget.ReferenceSingleSelect");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ReferenceSingleSelect",
	dojo.widget.HtmlWidget,
	function(){},
	{
		objectHref:'',
		appPath:'',
		refTitle:'',
		refPath:'',
		id:'_',
		addButton:null,
		clearButton:null,
		pathField:null,
		titleField:null,
		dialog:null,
		targetTypes: {},
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ReferenceSingleSelect.html'),
		exit:function(widget) {
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				this.dialog.hide();
			} else {
				widget.remote.close();
			}
		},
		addLocation:function(widget, value) {
			widget.pathField.value = value[1].path;
			widget.titleField.value = value[0];
			axiom.dirtyProps[widget.pathField.name] = true;
		},
		clear:function() {
			this.pathField.value = '';
			this.titleField.value = '';
			axiom.dirtyProps[this.pathField.name] = true;
		},
		browse:function() {
			var path = this.objectHref;
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				axiom.browsetable.multiple = false;
				axiom.browsetable.property = this.id;
				axiom.browsetable.defaultValue = this.pathField.value;
				axiom.browsetable.defaultValues = [];
				axiom.browsetable.setCallBack = this.addLocation;
				axiom.browsetable.exitCallBack = this.exit;
				axiom.browsetable.callingWidget = this;
				axiom.browsetable.searchURL = path + "potentialTargets";
				axiom.browsecfilter.setTargetTypes(this.targetTypes);
				axiom.browsecfilter.reset();
				axiom.browsecfilter.search(null, null, null, 12);
				this.dialog.show();
			} else {
				this.remote = window.open(this.appPath + '/cms/browse?property='+this.id+'&path='+path);
				this.remote.multiple = false;
				this.remote.property = this.id;
				this.remote.browsePath = path;
				this.remote.setCallBack = this.addLocation;
				this.remote.exitCallBack = this.exit;
				this.remote.callingWidget = this;
			}
		},
		initialize:function(){            
			this.pathField.name = this.id;
			this.pathField.value = this.refPath;
			this.titleField.value = this.refTitle;
			dojo.event.kwConnect({
						     srcObj:this.addButton,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'browse'});
			dojo.event.kwConnect({
						     srcObj:this.clearButton,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'clear'});
		}
	}
);
