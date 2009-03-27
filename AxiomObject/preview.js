function session_id(){
	return session._id;
}


function save_preview(data){
	data = (data || req.data);
	var layer = 1;
	app.deleteDraft(this, layer);
	var previewObj = app.getDraft(this, layer);
	var errors = previewObj.save_as_preview(data);
	if(errors) {
		return errors;
	} else {
		app.log('previewObj.getURI() => '+previewObj.getURI());
		var port = req.data.http_host.split(":")[1];
		return 'http://'+app.getProperties()['draftHost.'+layer]+(port?":"+port:'') + previewObj.getURI();
	}
}

function preview_url(){
	var preview_domain = app.getProperties()['draftHost.1'];
	var port = req.data.http_host.split(":")[1];
	if(port){
		preview_domain += ":"+port;
	}
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
