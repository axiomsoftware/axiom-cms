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


function tree() {
	var nodeid = req.data.nodeid;
	node = app.getHits([],{_id:nodeid}).objects(0,1)[0];
	var prototypes = this.getSearchablePrototypes();
	var cms_prototypes = ['ContentManagementSystem','CMSContentFolder'];
	var tree_prototypes = Array.union(prototypes,cms_prototypes);
    var cms_filter = new OrFilter({cms_status:"z"},{cms_status:"a"});
    var children = node.getChildren(tree_prototypes, cms_filter,{sort:{cms_lastmodified:'desc'}}).map(function(obj){
		return {
			_id: obj._id,
			title: obj.title ? obj.title: 'Untitled Object',
			icon_uri: obj.getTreeIconURI(),
			location: obj.getURI(),
			prototype: obj.getPrettyName().toString() ? obj.getPrettyName().toString() : obj._prototype,
		    hasChildren: (obj.getChildCount([],cms_filter)>0),
			created: obj.cms_createdby,
			last_modified: obj.cms_lasteditedby,
			refs: obj.ref_list().*.toXMLString(),
 			task_editable: obj.task_editable(),
			task_info: obj._task ? obj._task.getTarget().task_id + ' - ' + obj._task.getTarget().name + ' - ' + obj._task.getTarget().status : 'None',
			editable: (obj.cms_editForm && obj.editable())
		}
	});
	return children.toSource();
}
