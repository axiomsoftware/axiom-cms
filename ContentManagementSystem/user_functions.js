function delete_users(){
	for each(var id in req.data.users){
		var user = app.getHits("CMSUser", {_id: id},{maxlength: 1}).objects(0,1)[0];
		user._parent.remove(user);
	}
}