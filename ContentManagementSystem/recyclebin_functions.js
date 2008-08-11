function restore_objects(data){
	data = data || req.data;
	var filter = new OrFilter([new Filter(f) for each(f in data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
		var item = bag.getChildren()[0];
		var oldlocation = bag.oldlocation.replace(/\/[^\/]+$/, '');
		var errors = item.save({_location: oldlocation});
		if(!errors){
			bag._parent.remove(bag);
		} else {
			app.log(errors);
		}
	}
}

function purge_recycled_objects(){
	data = data || req.data;
	var filter = new OrFilter([new Filter(f) for each(f in data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
			bag._parent.remove(bag);
	}
}