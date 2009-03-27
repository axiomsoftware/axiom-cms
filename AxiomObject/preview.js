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
