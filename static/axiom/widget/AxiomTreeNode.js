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
				var ref_box = dojo.byId('referenced_box');
				if (this.object.refs.match(/^\s*$/)) {
					ref_box.style.display = 'none';
				} else {
					ref_box.innerHTML = this.object.refs;
					ref_box.style.display = 'block';
				}
				axiom.showObjectDetail();
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
				// if-cms-version-enterprise
				if (this.object.task_info != 'None') {
					var img = document.createElement("img");
					img.src = axiom.staticPath + '/axiom/images/lock.gif';
					this.afterLabelNode.appendChild(img);
				}
				if (!this.object.task_editable) {
					this.titleNode.style.color = '#CCC';
				}
				// end-cms-if

				if (!this.object.editable) {
					this.titleNode.style.color = '#CCC';
				}

				// if-cms-version-standard
				if (this.object.editable) {
				// end-cms-if
				// if-cms-version-enterprise
				if (this.object.editable && this.object.task_editable) {
				// end-cms-if
					dojo.event.kwConnect({srcObj: this.titleNode,
								  srcFunc: 'ondblclick',
								  adviceObj: this,
								  adviceFunc: 'display_edit'});
				}
			}
		}

	}
);

