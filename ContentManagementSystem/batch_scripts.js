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

// Returns a script getCompleted function
function getBatchProgress() {
	var zip = req.data.zip_id;
	var script = req.data.script_id;
	try {
		return cmsGlobals.batchScripts[script].getCompleted(zip);
	} catch(e) {
		return {errors: 'Could not find a script with id '+script};
	}
}

// Returns a script's getTotal function
function getBatchTotal() {
	var zip = req.data.zip_id;
	var script = req.data.script_id;
	try {
		return cmsGlobals.batchScripts[script].getTotal(zip);
	} catch(e) {
		return {errors: 'Could not find a script with id '+script};
	}
}

// Called to begin a batch script from the front end. Will tell script with script_id to do its thing with objects where cms_batchid=zip_id
function beginBatch() {
	var zip = req.data.zip_id;
	var script = req.data.script_id;
	if(zip && script) {
		app.log('Beginning batch process with scriptid '+script+' and batchid '+zip);
		var cms = root.get('cms');
		var objects = app.getObjects(['File', 'Image'], {cms_batchid:zip});
		return cmsGlobals.batchScripts[script].action(objects);
	}
	return {errors: 'Both script_id and zip_id are required'};
}