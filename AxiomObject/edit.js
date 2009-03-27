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
			redir.title = this.title;
			redir.id = redir_id;
			redir.url = this.getURI();
			app.log(redir_parent.getURI());
			redir_parent.add(redir);
			
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
}

function save_as_preview(data){
	data = this.preprocess_data(data);
	return this.edit(data);
}
