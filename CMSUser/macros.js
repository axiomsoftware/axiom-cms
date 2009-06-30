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


this.editwrapper = function(){
	if(req.data.password && req.data.password != '')
		req.data.password = req.data.password.md5();
	else
		delete req.data.password;
		
	if(req.data.username) {
		if(req.data.username.length > 3) {
			if(req.data.username.toLowerCase() != 'system') {
				var users = app.getHitCount('CMSUser', {username:req.data.username}, {maxlength:1});
				if(users) {
					return {errors: 'This username is already in use.'};
				} else {
					var objs = app.getObjects(root.get('cms').getSearchablePrototypes(),
						new AndFilter({cms_status:'z'}, new OrFilter({cms_createdby: this.username}, {cms_lasteditedby: this.username}))
					);

					for each(obj in objs) {
						if(obj.cms_createdby.indexOf(this.username) > -1) {
							obj.cms_createdby = obj.cms_createdby.replace(this.username, req.data.username);
						}
						if(obj.cms_lasteditedby.indexOf(this.username) > -1) {
							obj.cms_lasteditedby = obj.cms_lasteditedby.replace(this.username, req.data.username);
						}
					}
				}
			} else {
				return {errors: '"System" is a reserved username.'}
			}
		} else {
			return {errors: 'Username must be at least three characters long'};
		}
	}
	// Log out a disabled user if it is logged in
	if(req.data.disabled == 'true') {
		for each (var session in app.getSessions()) {
			if (session.user && session.user.username == this.username) {
				session.logout();
			}
		}
	};
	this.edit(req.data);
}

function editprofile(){
	var errors = {};
	var data = {};
	if(req.data.first_name) {
		data.first_name = req.data.first_name;
	}
	if(req.data.last_name) {
		data.last_name = req.data.last_name;
	}
	if(req.data.email) {
		data.last_name = req.data.email;
	}
	if(req.data.password && req.data.password != '') {
		data.password = req.data.password.md5();
	}
	this.edit(data);
}

this.setPassword = function(pw) {
    this.password = pw.md5();
}

this.setUsername = function(uname) {
    this.username = uname;
}

this.setRoles = function(r) {
    if (typeof r == "string") {
	this.roles = new MultiValue(r);
    } else if (r instanceof Array) {
	for (var i in r) {
	    if (this.roles) {
		this.roles = this.roles.concat(new MultiValue(r[i]));
	    } else {
		this.roles = new MultiValue(r[i]);
	    }
	}
    }
}

this.addRole = function(role) {
    if (this.roles) {
	this.roles = this.roles.concat(new MultiValue(role));
    } else {
	this.roles = new MultiValue(role);
    }
}

function getUsername() {
    return this.username;
}

function getRoles() {
    var r = [];
    for (var i = 0; (this.roles && (i < this.roles.length)); i++) {
		r.push(this.roles[i]);
    }
    return r;
}

function hasRole(role) {
    return this.roles.contains(role);
}

function genSearchFields(){
	return [ (this.username || ''),
			 (this.first_name || ''),
			 (this.last_name || '') ].join(' ');
}

function rolesString(){
	var result = [];
	for(var i=0; i<this.roles.length; i++){
		result.push(this.roles[i]);
	}
	return result.join(' ');
}

function getLatestActivity(max) {
    max = max || 5;
    var prototypes = this.getSearchablePrototypes();
    return app.getHits(prototypes, {lastmodifiedby:this.username}, {sort:{cms_lastmodified:'desc'}}).objects(0, max).map(
	function(e) {
	    return {
		not_external: !(e.getURI().search("^/cms")),
		href: e.getURI(),
		lastmodified: e.cms_lastmodified.format("E MMM dd yyyy, hh:mm a"),
		title: e.title
	    };
	}
    );
}

function addTimestamp(d) {
    if (!d) {
	d = new Date().getTime();
    }

    if (!(this.login_timestamps) || this.login_timestamps.length == 0) {
	this.login_timestamps = new MultiValue(d);
    } else {
	this.login_timestamps = this.login_timestamps.concat(new MultiValue(d));
    }
}