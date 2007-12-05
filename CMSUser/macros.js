this.editwrapper = function(){
	if(req.data.password && req.data.password != '')
		req.data.password = req.data.password.md5();
	else
		delete req.data.password;
	this.edit(req.data);
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