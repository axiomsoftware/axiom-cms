function preprocess_data(data){
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
		this.setStatus('a');
	}
	else{
		this.setStatus('z');
	}
}

function save(data){
	// if-cms-version-enterprise
	var save_obj = function(data){
	// end-cms-if
		data = (data || req.data);

		if(typeof this.cmsSaveAdvice == "function")
			this.cmsSaveAdvice(data);

		data = this.preprocess_data(data);

		var previous_task = this._task;
		data.cms_lastmodified = new String((new Date()).getTime());

		var action = this._status == 'null' ? "Added" : "Edited";
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
		} else {
			app.log(errors.toSource());
		}
		return errors;
	// if-cms-version-enterprise
 	}
	return save_obj.call(app.getDraft(this, 1), data);
	// end-cms-if
}

function save_as_preview(data){
	data = this.preprocess_data(data);
	return this.edit(data)
}