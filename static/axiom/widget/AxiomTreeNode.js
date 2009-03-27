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

dojo.provide("axiom.widget.AxiomTreeNode");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Tree");

dojo.widget.defineWidget(
	"axiom.widget.AxiomTreeNode",
	dojo.widget.TreeNode,
	function(){},
	{
		current_children: [],
	    parentNode: null,
		display_edit: function(e) {
			var url = (this.object.location == '/' ? '' : this.object.location) + '/cms_edit';
			axiom.loadEdit(url);
		},

		update_details: function() {
			if (this.object) {
			    dojo.byId('obj_created').innerHTML = this.object.created;
			 	dojo.byId('obj_last_modified').innerHTML = this.object.last_modified;
			 	dojo.byId('obj_content_type').innerHTML = this.object.prototype;
		    	var task_info = dojo.byId('obj_task_info');
			    if (task_info) {
					task_info.innerHTML = this.object.task_info;
				}
				axiom.showObjectDetail(this.object.location);
			} else {
				axiom.hideObjectDetail();
			}
			if (axiom.selected_node) {
				axiom.selected_node.unMarkSelected();
			}
			this.markSelected();
			axiom.selected_node = this;
		},

		clear_children: function() {
			for (var i = 0; i < this.current_children.length; i++) {
				var child = dojo.widget.byId('Tree_' + this.current_children[i]);
				this.removeNode(child);
			}
			this.current_children = [];
		},

		postCreate: function() {
			if (this.object) {
				if (this.object.task_info != 'None') {
					var img = document.createElement("img");
					img.src = axiom.staticPath + '/axiom/images/lock.gif';
					this.afterLabelNode.appendChild(img);
				}
				if (!this.object.task_editable) {
					this.titleNode.style.color = '#CCC';
				}

				if (!this.object.editable) {
					this.titleNode.style.color = '#CCC';
				}

				if (this.object.editable && this.object.task_editable) {
					dojo.event.kwConnect({srcObj: this.titleNode,
								  srcFunc: 'ondblclick',
								  adviceObj: this,
								  adviceFunc: 'display_edit'});
				}
			}
		}

	}
);

