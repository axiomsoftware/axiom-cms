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

dojo.provide("axiom.widget.DropdownLocationField");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.LocationField");

dojo.widget.defineWidget(
	"axiom.widget.DropdownLocationField",
	axiom.widget.LocationField,
	function(){},
	{
		appPath:'',
		parentHref:'',
		objectId:'',
		initialValue:'',
		href:'',
		pathField:null,
		idField:null,
		browseButton:null,
		remote:null,
		dialog:null,
		parentTypes: {},
		paths: [],
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/DropdownLocationField.html'),
		postCreate:function() {
			this.initialText = this.objectId;
			this.currentText = this.objectId;
			//this.pathField.value = this.initialValue.match(/^\/cms/)?'':this.initialValue;
			for(var i in this.paths){
				var opt = document.createElement('option');
				opt.innerHTML = this.paths[i];
				opt.value = this.paths[i];
				if(this.initialValue == this.paths[i])
					opt.selected = 'true';
				this.pathField.appendChild(opt);
			}
			this.idField.value = this.objectId;
			dojo.event.kwConnect({ srcObj:this.clearButton,
					       srcFunc:'onclick',
					       adviceObj:this,
					       adviceFunc:'clearLocation'});         
			dojo.event.kwConnect({ srcObj:this.idField,
					       srcFunc:'onkeyup',
					       adviceObj:this,
					       adviceFunc:'scrub'});
			dojo.event.kwConnect({ srcObj:this.idField,
					       srcFunc:'onblur',
					       adviceObj:this,
					       adviceFunc:'blurScrub'});
		}
	}
);
