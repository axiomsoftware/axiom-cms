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
Dan Pozmanter, Thomas Mayfield
*/

dojo.provide("axiom.widget.ContentAdd");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ContentAdd",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		prototypes:{},
		myTasks:[],
		//addPrototypeList:null,
		addButton:null,
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ContentAdd.html'),
		getPrototype:function() {
			return this.addPrototypeList.value;
		},
		setPrototype:function(prototype) {
			this.addPrototypeList.value = prototype;
		},
		addObject:function() { //"add" is apparently a built-in Dojo widget method
			if(axiom.isDirty()){
				axiom.saveDialog(function(){ 
					axiom.dirtyProps = {};
					axiom.cadd.addObject()
				});
			} else{
				var p = this.getPrototype();
				if(p != "All" && p){
					var task = p;
					if(this.addToTaskList){
						task += !this.addToTaskList.value.match(/Choose One/i) ? '&task_id='+this.addToTaskList.value : '';
					}
					axiom.loadEdit(this.appPath + 'cms/cms_add?prototype='+task);
				} else {
					axiom.openModal({content:"Please choose a content type before proceeding"});
				}
			}
		},
		postCreate:function() {
			this.addPrototypeList.innerHTML = '';
			var first = document.createElement('option');
			first.value = 'All';
			first.innerHTML = '-- Choose One --';
			first.setAttribute('selected', 'selected');
			this.addPrototypeList.appendChild(first);
			for (var p in this.prototypes) {
				var option = document.createElement('option');
				option.value = p;
				option.innerHTML = this.prototypes[p]; 
				this.addPrototypeList.appendChild(option);
			}
			
			dojo.event.kwConnect({ srcObj:this.addButton,
								   srcFunc:'onclick',
								   adviceObj:this,
								   adviceFunc:'addObject'});
		}
	}
);
