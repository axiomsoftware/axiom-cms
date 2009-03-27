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


function session_id(){
	return session._id;
}

function task_preview(){
	var pieces = req.data.http_host.split(":");
	var port = pieces[1];
	var domains = app.getDomains(1).filter(function(x){return x != pieces[0];});
	if(domains.length == 0){
		app.log('WARNING: no secondary cms staging domain set.');
	} else if(domains.length > 1){
		app.log('WARNING: multiple secondary cms staging domains found.  Using '+domains[0]);
	}
	var domain = (domains[0] || pieces[0]);

	if(domains[0] && this._task){
		app.log('setting draft ids to '+this._task.getTarget().get_object_ids().toSource()+' on ' +domain);
		session.setDraftIds(this._task.getTarget().get_object_ids().map(function(x){return parseInt(x);}), domain);
	} else {
		app.log('clearing draft ids on '+domain);
		session.setDraftIds([], domain);
	}
	if (port){
		domain += ":"+port;
	}
	res.redirect('http://'+domain+this.getURI());
}

function save_preview(data){
	data = (data || req.data);
	var layer = 2;
	app.deleteDraft(this, layer);
	var previewObj = app.getDraft(this, layer);
	var errors = previewObj.save_as_preview(data);
	if(errors) {
		return errors;
	} else {
		session.setDraftIds([previewObj._id], layer);
		app.log('previewObj.getURI() => '+previewObj.getURI());
		var port = req.data.http_host.split(":")[1];
		return 'http://'+app.getProperties()['draftHost.'+layer]+(port?":"+port:'') + previewObj.getURI();
	}
}

function preview_url(){
	var preview_domain = app.getProperties()['draftHost.2'];
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
