function copy_objects() {
	var data = req.data;
	var objects = data.objects.split(',');
	var filters = objects.map(function(obj){ return new Filter({"_id": obj}); });
	var filter = new AndFilter(new OrFilter(filters), new NativeFilter("cms_status: z OR cms_status: a", "WhitespaceAnalyzer"));
	var objs = app.getObjects([], filter);


	for (var i = 0; i < objs.length; i++) {
		var copy = objs[i].copy("title", data.prefix + objs[i].title);
		var fixed_prefix = data.prefix.replace(/\s+/g, '_').replace(/[^\w\.]+/g, '').toLowerCase();
		var accessname = fixed_prefix + objs[i].id;
		copy.id = accessname;
		copy.cms_lastmodified = new Date();
		if (data.clear_url == "true") {
			var p = objs[i]._prototype;
			var folder = this.get(p);
			if (!folder){
				folder = new CMSContentFolder();
				folder.id = p;
				folder.title = p + " Folder";
				root.get("cms").add(folder);
			}
			var count = 1;
			while (folder.get(copy.id)) {
				copy.id = accessname + "_" + count;
				count++;
			}
			folder.add(copy);
			copy.cms_status = 'a';
		} else {
			var par = objs[i]._parent;
			var count = 1;
			while (par.get(copy.id)) {
				copy.id = accessname + "_" + count;
				count++;
			}
			par.add(copy);
		}
	}
}

/**
 * Delete all given objects
 * @params = req.data.objs - array of ids of objects to be deleted
 */
function delete_objects(){
	app.getObjects([], req.data.objs.map(function(obj){ return "_id: "+obj.id; }).join(" OR ")).invoke('cms_delete');
}

function domain_warning(){
	var host = req.data.http_host.split(':')[0];
	var staging_hosts = app.getDomains(1);
	var preview_hosts = app.getDomains(2);
	var errors = [];

	// if-cms-version-enterprise
	switch(staging_hosts.length){
	case 0: 	errors.push("No staging domains set."); break;
	case 1:		errors.push("Only one domain set for staging layer."); break;
	}

	if(preview_hosts.length === 0){
		errors.push("No preview domains set.");
	}

	var on_staging = false;
	for each(var staging_host in staging_hosts){
		if(staging_host == host) {
			on_staging = true;
			break;
		}
	}

	if(!on_staging){
		errors.push("Accessing CMS on live domain. Axiom CMS Enterprise must be accessed via a staging domain.");
	}

	// end-cms-if
	// if-cms-version-workgroup|standard
	if(staging_hosts.length === 0){
		errors.push("No preview domain");
	} else if(staging_hosts.length > 1) {
		errors.push("Multiple preview domains set.");
	}
	// end-cms-if

	if(errors.length === 0){
		return false;
	} else {
		return new XMLList(['<span class="error_message" style="display:inline">WARNING: </span>'+x for each(x in errors)].join('<br/>'));
	}

}

function delete_tags(){
	var tag_folder = root.get('tagfolder');
	for(prop in req.data){
		if(!prop.match(/^http/)){
			var tag = app.getObjects("CMSTag", {title: prop}, {maxlength: 1})[0];
			if(tag){
				tag_folder.remove(tag);
			}
			else{
				app.log("Couldn't remove non-existant tag: "+prop);
			}
		}
	}
	res.redirect('manage_tags');
}

function getAdminsAndEditors(){
	var users = [];
	var filter = new OrFilter(new Filter({search_roles: "Administrator"}), new Filter({search_roles: "Content Editor"}));
	for each(user in app.getObjects("CMSUser", filter)){
		users.push(user.username);
	}
	return users.toSource();
}

function getUserList(){
	return app.getFields("username", "CMSUser", {}).sort().toSource();
}

function getAllUsers() {
    var users = [];
    var userlist = app.getObjects("CMSUser", "search_roles: Administrator");
    for each(user in userlist) {
        if(user && user.search_roles && user.search_roles.match("Administrator")) {
			users.push(user.first_name + " " + user.last_name);
        }
    }
    return users;
}


function isContentContributor(){
	return session.user.hasRole("Content Contributor");
}

function currentUser(){
	return session.user.username;
}