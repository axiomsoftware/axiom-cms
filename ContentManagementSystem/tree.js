function tree() {
	var nodeid = req.data.nodeid;
	node = app.getHits([],{_id:nodeid}).objects(0,1)[0];
	var prototypes = this.getSearchablePrototypes();
	var cms_prototypes = ['ContentManagementSystem','CMSContentFolder'];
	var tree_prototypes = Array.union(prototypes,cms_prototypes);

	var children = node.getChildren(tree_prototypes,{},{sort:{cms_lastmodified:'desc'}}).map(function(obj){
		return {
			_id: obj._id,
			title: obj.title ? obj.title: 'Untitled Object',
			location: obj.getURI(),
			prototype: obj.getPrettyName().toString() ? obj.getPrettyName().toString() : obj._prototype,
			hasChildren: obj.hasChildren(),
			created: obj.cms_createdby,
			last_modified: obj.cms_lasteditedby,
			refs: obj.ref_list().*.toXMLString(),
			// if-cms-version-enterprise
 			task_editable: obj.task_editable(),
			task_info: obj._task ? obj._task.getTarget().task_id + ' - ' + obj._task.getTarget().name + ' - ' + obj._task.getTarget().status : 'None',
			// end-cms-if
			editable: obj.editable()
		}
	});
	return children.toSource();
}
