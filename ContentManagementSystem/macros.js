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
	    var par = null;
		if (data.clear_url == "true") {
			var p = objs[i]._prototype;
			var folder = this.get(p);
			if (!folder){
				folder = new CMSContentFolder();
				folder.id = p;
				folder.title = p + " Folder";
				root.get("cms").add(folder);
			}
		    par = folder;

			copy.cms_status = 'a';
		} else {
			par = objs[i]._parent;
			copy.cms_status = 'z';
		}
	    var count = 1;
	    while (par.get(copy.id)) {
		copy.id = accessname + "_" + count;
		count++;
	    }
	    par.add(copy);
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

	if(staging_hosts.length === 0){
		errors.push("No preview domain");
	} else if(staging_hosts.length > 1) {
		errors.push("Multiple preview domains set.");
	}

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

function isContentEditor(){
	return session.user.hasRole("Content Editor");
}

function isAdministrator(){
	return session.user.hasRole("Administrator");
}

function currentUser(){
	return session.user.username;
}

function currentUserFullName(){
	var user = session.user;
	if (user.first_name && user.last_name) {
		return user.first_name + " " + user.last_name;
	}
	if (user.first_name && !user.last_name) {
		return user.first_name;
	}
	return user.username;
}


function childCountById() {
    var ids = req.get("ids");
    var counts = {};

    for (var id in ids) {
	counts[id] = app.getObjects([], {_id:id})[0].getChildCount();
    }

    return counts;
}