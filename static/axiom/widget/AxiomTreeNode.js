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

		postCreate: function() {
			dojo.event.kwConnect({srcObj: this.titleNode,
								  srcFunc: 'ondblclick',
								  adviceObj: this,
								  adviceFunc: 'display_edit'});
		}

	}
);

