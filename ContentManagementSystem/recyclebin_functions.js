function restore_objects(data){
	data = data || req.data;
	var msgs = [];
	var filter = new OrFilter([new Filter(f) for each(f in data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
		var item = bag.getChildren()[0];
		var new_location = bag.oldlocation.replace(/\/[^\/]+$/, '');
		var errors = item.save({_location: new_location});
		var restore = function(obj){
			bag._parent.remove(bag);
			obj.publishToLive();
		};
		if(!errors){
			restore(item);
		} else {
			// try readable probably-unique location
			errors = item.save({_location: new_location+'_restored'});
			var new_location_msg = 'Object "'+item.title+'" could not be restored to its original'
												+ ' location because another object is '
												+ 'currently located there.  It has been restored to ';
			if(!errors){
				msgs.push(new_location_msg+new_location+'_restored instead.');
				restore(item);
			} else {
				// try guaranteed unique path
				var time = (new Date()).getTime();
				errors = item.save({_location: new_location+'_'+time});
				if(!errors){
					msgs.push(new_location_msg+new_location+'_'+time+' instead.');
					restore(item);
				} else{
					msgs.push('The server encounted an internal error while trying to restore object "'+item.title+'": '+errors.toSource());
				}
			}
		}
	}
	return msgs.length ? msgs.join("<br/>") : "Objects restored.";
}

function purge_recycled_objects(){
	var filter = new OrFilter([new Filter(f) for each(f in req.data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
			bag.del();
	}
}
