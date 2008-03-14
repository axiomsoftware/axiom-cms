function cms_add() {
	var p = req.data.prototype;
	var folder = this.get(p);
	if (!folder){
		folder = new CMSContentFolder();
		folder.id = p;
		folder.title = p + " Folder";
		root.get('cms').add(folder);
	}

	var child = eval('new '+p+'();');
	folder.add(child);

	child.id = child._id;

	child.setStatus('null');
	if(req.data.task_id){
		var task = app.getHits("CMSTask", {task_id: req.data.task_id}).objects(0,1)[0];
		if(task)
			child._task = new Reference(task);
		else
			app.log("Couldn't associate new "+p+" with task_id "+req.data.task_id+" - couldn't find CMSTask object in db.");
	}
	child._action = "Added";

	return child.cms_edit({add:true});
}
