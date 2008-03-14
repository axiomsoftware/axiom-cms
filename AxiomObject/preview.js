function session_id(){
	return session._id;
}

// if-cms-version-enterprise
function task_preview(){
	var domains = app.getDomains(1).filter(function(x){return x != req.data.http_host;});
	if(domains.length == 0){
		app.log('WARNING: no secondary cms staging domain set.');
	} else if(domains.length > 1){
		app.log('WARNING: multiple secondary cms staging domains found.  Using '+domains[0]);
	}
	var domain = (domains[0] || req.data.http_host)

	if(domains[0] && this._task){
		app.log('setting draft ids to '+this._task.getTarget().get_object_ids().toSource()+' on ' +domain);
		session.setDraftIds(this._task.getTarget().get_object_ids().map(function(x){return parseInt(x)}), domain);
	} else {
		app.log('clearing draft ids on '+domain);
		session.setDraftIds([], domain);
	}
	res.redirect('http://'+domain+this.getURI());
}
// end-cms-if

function save_preview(data){
	data = (data || req.data);
	// if-cms-version-enterprise
	var layer = 2;
	// end-cms-if
	// if-cms-version-workgroup|standard
	var layer = 1;
	// end-cms-if
	app.deleteDraft(this, layer);
	var previewObj = app.getDraft(this, layer);
	var errors = previewObj.save_as_preview(data);
	if(errors) {
		return errors;
	} else {
		// if-cms-version-enterprise
		session.setDraftIds([previewObj._id], layer);
		// end-cms-if
		app.log('previewObj.getURI() => '+previewObj.getURI());
		return 'http://'+app.getProperties()['draftHost.'+layer] + previewObj.getURI();
	}
}

function preview_url(){
	// if-cms-version-enterprise
	var preview_domain = app.getProperties()['draftHost.2'];
	// end-cms-if
	// if-cms-version-workgroup|standard
	var preview_domain = app.getProperties()['draftHost.1'];
	// end-cms-if
	if(preview_domain)
		return 'http://'+preview_domain + this.getURI();
	else
		return this.getURI();
}


function previewable(){
	var previewable = cmsGlobals.props..prototype.(@name == this._prototype).@previewable;
	if(previewable && previewable != 'false')
		return true;
	return false;
}
