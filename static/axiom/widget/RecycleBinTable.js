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

dojo.provide("axiom.widget.RecycleBinTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.UserTable");

dojo.widget.defineWidget(
	"axiom.widget.RecycleBinTable",
	axiom.widget.UserTable,
	function(){},
	{
		appPath:'',
		data: {},
		numCols: 3,
		buttonData: [{text: "Restore", callback:"restoreObjects"}, {text: "Delete", callback:"deleteObjects"}],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinTable.html'),
		insertRow: function(item){
			var row_id = item._id;
			var row = this.createRow(
				{id: row_id,
				 cols: [
				     {content: (item.title || 'No Title'), 'class': 'col_title' },
				     {content: (item.location || 'No Location'), 'class': 'col_location' }
				 ]
				});
			this.results_body.appendChild(row);
		},
		getSelectedObjects: function(){
			var objects = [];
			for(var id in this.selectedRows){
				objects.push({_id: id});
			}
			return objects;
		},
		submitObjects: function(url, callback, error_callback){
			dojo.io.bind({url: url,
						  method: 'post',
						  contentType: 'text/json',
						  load: callback,
						  error: error_callback,
						  postContent: dojo.json.serialize({objects: this.getSelectedObjects()})
						 });
		},
		restoreObjects: function(){
			if(!dojo.html.hasClass(this.buttons[0], 'form-button-disabled')){
				this.submitObjects('restore_objects', function(evt,text,res){ axiom.showMessage(text); recyclebin.cfilter.search(); });
			}
		},
		deleteObjects: function(){
			if(!dojo.html.hasClass(this.buttons[1], 'form-button-disabled')){
				axiom.openModal({content: "Permanently delete these objects?",
								 callback: function(){
									 recyclebin.ctable.submitObjects('purge_recycled_objects',
																		   function(evt,text,res){
																			   axiom.showMessage(text);
																			   recyclebin.cfilter.search();
																		   });
								 },
								 confirmdialog: true});
			}
		},
		toggleButtons: function(){
			this.checkButton([], this.buttons[0]);
			this.checkButton([], this.buttons[1]);
		},
		onSelect:function(row){
			this.toggleButtons();
		},
		onUnselect:function(row){
			this.toggleButtons();
		},
		insertNoObjectsRow: function(){
			dojo.require('axiom.widget.TaskTable');
			axiom.widget.TaskTable.prototype.insertNoObjectsRow.call(this, "No objects in recycle bin.");
		},
		postCreate:function() {
			this.ajaxLoader.src = axiom.staticPath + '/axiom/images/ajax-loader.gif';
			this.tablewrap.style.display = 'block';

			dojo.event.kwConnect({srcObj: this.pagination_input,
								  srcFunc: 'onkeypress',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});

			dojo.event.kwConnect({srcObj: this.pagination_button,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});


		}
	}
);
