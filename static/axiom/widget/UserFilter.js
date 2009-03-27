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
 * Copyright Axiom
 * Thomas Mayfield
 */

dojo.provide("axiom.widget.UserFilter");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.ContentFilter");

dojo.widget.defineWidget(
	"axiom.widget.UserFilter",
	axiom.widget.ContentFilter,
	function(){},
	{
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/UserFilter.html'),
		prototypeList: ["CMSUser"],
		sortObj: [{last_name: 'asc'}, {first_name:'asc'}],
		getPrototype:function() {
			return "CMSUser";			
		},
		getKeywords:function(){
			return this.keywordInput.value + (this.rolesInput.value != 'All'?' search_roles:"'+this.rolesInput.value+'"':'');
		},
		reset:function(){
			this.rolesInput.value = "All";
			this.keywordInput.value = "";
		},
	 	showSearch: function(){
			dojo.widget.byId('EditBody').hide();
			dojo.widget.getWidgetsByType('UserTable')[0].show(); 
		},
		postCreate:function() {
			dojo.event.kwConnect({       srcObj: this.keywordInput,
										 srcFunc:'onkeydown',
										 adviceObj: this,
										 adviceFunc: function(evt){  
											 if(evt.keyCode == 13){
												 this.showSearch();
												 this.search(evt, "CMSUser", this.getKeywords()); 
											 }
										 }
								 });
			dojo.event.kwConnect({	     srcObj:this.searchButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:function(evt){ 
											 this.showSearch();
											 this.search(evt, "CMSUser", this.getKeywords()); 
										 }
								 });

			dojo.event.kwConnect({	     srcObj:this.resetButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:'reset'});

		}
	}
);
