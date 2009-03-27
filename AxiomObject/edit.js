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


function preprocess_data(data){
	var schema = this.getSchema();
	for(var i in data){
		if (schema[i]) {
			if(data[i] === '' && schema[i].type != 'string'){
				data[i] = null;
			}
		}
	}
	if(data.ax_id){
		// workaround for IE bug with name||id = "id" busting things
		data.id = data.ax_id;
		delete data.ax_id;
	}
	if(data['_location'] === ''){
		var folder = app.getHits("CMSContentFolder", {id: this._prototype}).objects(0,1)[0];
		if(!folder){
			folder = root.get('cms');
		}
		data['_location'] = folder.getPath();
	}
	if(this._action != "Added"){
		data['_action'] = 'Edited';
	}
	if(data['_task'] == 'BYPASS') {
		data['_task'] = null;
	}

	return data;
}

function calculateStatus(){
	if(this.getPath().match(/^\/cms/)){
		this.cms_status = 'a';
	}
	else{
		this.cms_status = 'z';
	}
}

function save(data){

	var bypass = false;
	if (req.data['_task'] == "BYPASS") {
		bypass = true;
	}

	var save_obj = function(data){
		data = (data || req.data);

		if(typeof this.cmsSaveAdvice == "function")
			this.cmsSaveAdvice(data);

		data = this.preprocess_data(data);

		var previous_task = this._task;
		data.cms_lastmodified = new String((new Date()).getTime());

		var action = this.cms_status == 'null' ? "Added" : "Edited";
	    var redir_parent = this._parent;
	    var redir_id = this.id;
		var errors = this.edit(data);

		if(!errors){
			this.calculateStatus();

			var conn = app.getDbSource("_default").getConnection(false);
			var audit_data = {username:  session.user.username,
							  object_id: this._id,
							  task_id:   this._task ? this._task.getTarget().task_id : null,
							  uri:       this.getURI(),
							  title:     this.title,
							  prototype: this._prototype,
							  action:    action};

			if(this._task && (action == "Added" || !previous_task || (previous_task.getTarget().task_id != this._task.getTarget().task_id))){
				audit_data.added_to_task = 'TRUE';
			}
			auditLogObjectAction(audit_data, conn);
			// Creates a cms redirect object.
		    if (data['_current'] == 'on' && this._parent != redir_parent) {
			res.commit();
			var redir = new CMSRedirect();
			redir._task = this._task;
			redir._action = this._action;
			redir.title = this.title;
			redir.id = redir_id;
			redir.url = this.getURI();
			app.log(redir_parent.getURI());
			redir_parent.add(redir);
			
			redir.__node__.setLayer(1);
			if (bypass) {
			    redir.publishToLive();
			}
			app.log("_id: " + redir._id);
			var redir_audit_data = {username:  session.user.username,
					  object_id: redir._id,
					  task_id:   redir._task ? redir._task.getTarget().task_id : null,
					  uri:       redir.getURI(),
					  title:     redir.title,
					  prototype: redir._prototype,
					  action:    action};

			if(redir._task && (action == "Added" || !previous_task || (previous_task.getTarget().task_id != redir._task.getTarget().task_id))){
			    redir_audit_data.added_to_task = 'TRUE';
			}
			auditLogObjectAction(redir_audit_data, conn);
		    }
		} else {
			app.log(errors.toSource());
		}
		return errors;
 	};

	var errors = save_obj.call(app.getDraft(this, 1), data);

	if (bypass) {
		this.publishToLive();
	}

	return errors;
}

function save_as_preview(data){
	data = this.preprocess_data(data);
	return this.edit(data);
}
