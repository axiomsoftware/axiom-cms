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

// All functions in this file are called from the client side

// Returns a script's getCompleted function
function getBatchProgress() {
	var zip = req.data.zip_id;
	var script = req.data.script_id;
	try {
		return this[cmsGlobals.batchScripts[script].getCompleted](zip);
	} catch(e) {
		return {errors: 'An unchecked error occured while querying this action\'s progress: '+e};
	}
}

// Returns a script's getTotal function
function getBatchTotal() {
	var zip = req.data.zip_id;
	var script = req.data.script_id;
	try {
		return this[cmsGlobals.batchScripts[script].getTotal](zip);
	} catch(e) {
		return {errors: 'An unchecked error occured while querying this action\'s total: '+e};
	}
}

// Called to begin a batch script from the front end. Will tell script with script_id to do its thing with objects
function beginBatch() {
	var zip_id = req.data.zip_id;
	var script_id = req.data.script_id;
	if(zip_id && script_id) {
		app.log('Beginning batch action on objects with scriptid '+script_id+' and batchid '+zip_id);

		// Find all the objects to process
		var objects = app.getHits(['File', 'Image'], {cms_batchid:zip_id});

		// This is the actual function call that the progress bar waits on. Nullifies the session on a safe return.
		var response = this[cmsGlobals.batchScripts[script_id].action](objects);
		session.data.batch = null;
		return response;
	}
	return {errors: 'Both script_id and zip_id are required'};
}

// If a batch script has steps, call the next step. A step is a modal that pops up that is developer defined
function batchStep() {
	var zip_id = req.data.zip_id;
	var script_id = req.data.script_id;

	if(zip_id && script_id) {
		// Create our session so we know what step we're on
		if(!session.data.batch) {
			session.data.batch = {
				zip_id: zip_id,
				script_id: script_id,
				step: 0
			}
		};
		var objects = app.getHits(['File', 'Image'], {cms_batchid:zip_id});
		var script = cmsGlobals.batchScripts[script_id];
		var step = parseInt(session.data.batch.step);

		if(script.dialogs && script.dialogs.length && script.dialogs[step]) {
			try {
				// Return the TAL file rendered with the objects to process
				return {
					title: script.dialogs[step].title,
					data: this[script.dialogs[step].template]({hits: objects}).toXMLString()
				};
			} catch(e) {
				return {title: 'Error', data: e.toString()};
			}
		} else {
			return {data: false};
		}
	}
	return {errors: 'Both script_id and zip_id are required'};
}

// Fire the return action (the "callback" defined for this template) after user has filled out whatever on this step's modal
function batchStepAction() {
	var data = req.data.form_data;
	var zip_id = req.data.zip_id;
	var script_id = req.data.script_id;

	if(zip_id && script_id) {
		var objects = app.getFields('_id', ['File', 'Image'], {cms_batchid:zip_id});
		var dialog = cmsGlobals.batchScripts[script_id].dialogs[parseInt(session.data.batch.step)];
		if(dialog && dialog.callback) {
			try {
				// Call the "callback" function of this step and pass the result to the client side.
				var response = this[dialog.callback](data);
				if(!response.errors) {
					session.data.batch.step++;
				}
				return response;
			} catch(e) {
				return {errors: 'An unchecked error occured while processing this batch action: '+e.toString()};
			}
		} else {
			return {errors: 'There is no callback method associated with this template. Please contact your administrator with this error.'};
		}
	}
	return {errors: 'Both script_id and zip_id are required. Please contact your administrator with this error.'};
}