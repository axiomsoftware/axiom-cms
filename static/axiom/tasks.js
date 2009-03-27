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


axiom.tasks = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('TaskAdd')){
			dojo.require("axiom.widget.TaskAdd");
			dojo.require("axiom.widget.TaskFilter");
			dojo.require("axiom.widget.TaskPanel");
			
			axiom.tasks.taskAdd = dojo.widget.createWidget('axiom:TaskAdd', {appPath:axiom.appPath}, dojo.byId('TaskAdd'));
			axiom.tasks.taskPanel = dojo.widget.createWidget('axiom:TaskPanel', {appPath:axiom.appPath}, dojo.byId('TaskPanel'));
			if(!axiom.isContentContributor){
				axiom.tasks.taskFilter = dojo.widget.createWidget('axiom:TaskFilter', {appPath:axiom.appPath}, dojo.byId('TaskFilter'));
				axiom.tasks.taskFilter.registerTable(axiom.tasks.taskPanel.searchTable);
			}
		}
	},
	cancelDelete: function(url){
		dojo.io.bind({ url: (url == '/'?'':url)+"/cancel_delete",
					   load: function() {axiom.tasks.taskPanel.refreshAll()}
					 });
					   
	}
}
dojo.addOnLoad(axiom.tasks.init);
