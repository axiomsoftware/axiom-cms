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

/**
 * Tab registration for the CMS.
 *
 * Add application specific tabs to the cms by overriding this stub method.
 * Should return a list of objects with the following properties:
 *       href             -> location of the tab content
 *       title            -> link title
 *       highlight_action -> name of the action upon which this tab should be highlighted
 *       roles            -> array of roles which have access to the tab
 *
 */
function registerTab(tab, index) {
	if (!cmsGlobals.cmsTabs) {
		cmsGlobals.cmsTabs = [];
    }
    cmsGlobals.cmsTabs.insert(tab, index);
}

function unregisterTabByTitle(title) {
	if (!cmsGlobals.cmsTabs) {
		cmsGlobals.cmsTabs = [];
	}

    var tabs = cmsGlobals.cmsTabs;
    var index = 0;

    for (var p in tabs) {
	var tab = tabs[p];
	if (tab.title == title) {
	    tabs.remove(index);
	}
	index++;
    }
}

/**
 *	Allows for application specific scripts to be run on batch uploads. A "script" is any developer-defined function that runs
 *	on objects in a batch upload. For example, a script could take all images assets and turn them into zip files. A script
 *  can also have modal dialog boxes associated with it to get user input. For example you could ask the user what to name their 
 *  zip files before making them. 
 * 
 *  If the user selects a script from the dropdown in the batch upload form, that script will get passed an HITS OBJECT of all the
 *  objects. The script is then free to do whatever action on the objects individually or as a whole. Note that every object passed
 *  to your script is marked with the same "cms_batchid" property, which is unique to that batch upload.
 *	
 *  // Skeleton of a script:
 *	registerBatchScript({
 *		title: 'title',		// Script title
 *		description:'desc',	// Script description
 *		dialogs: [			// OPTIONAL array of modal information. Modals appear before progress bar.
 *			{
 *				title: 'title',		// Title of the modal
 *				template: 'tal',	// TAL file that is loaded in modal. If set to 'example' it will load YourApp/ContentManagementSystem/example.tal
 *				callback: 'func'	// Name of callback function. This function will get passed an array of all inputs' and textareas' 
 * 									// 		data in the template, in this format: [{name:'', id:'', value:''}, {...}]
 *									//		The function should be defined in a JS file, such as YourApp/ContentManagementSystem/someFunctions.js. It 
 *									//		should return true when done, or {error: 'Error description'} to tell the user they missed an input or such.
 *			}, 
 *			{
 *									// Additional modals if desired
 *			}
 *		],
 *		action: 'action',
 * 										// Name of "action" function. This is what the progress bar waits on. Gets passed a HITS OBJECT
 * 										// of all assets in the batch upload. If script errors you can return {errors: 'Error description'}
 *		getCompleted: 'getCompleted',
 * 										// This function needs to return how many objects your script has processed (integer). It gets passed the unique cms_batchid
 *										// which every asset in the batch upload form will have. So app.getHits(['File', 'Image'], {cms_batchid: id}) will return all
 *										// assets in this job. It's up to you to determine how to count completed files. Function is called once every second when
 *										// the progress bar is showing. 
 *		getTotal: 'getTotal',
 * 										// This function should return the total number of objects your script is going to affect (integer).
 *										// Note that you do not need to run the action method on every object passed in. If you only want to affect images for
 *										// example, you can count only the images and return that number. The easiest way to count the total is
 *										// app.getHitCount(['File', 'Image'], {cms_batchid: cms_batchid});
 *										// The progress bar locks control until this script returns getCompleted and getTotal as the same value! So make sure
 *										// your logic is right!
 *	});
 */
function registerBatchScript(script) {
	if (!cmsGlobals.batchScripts) {
		cmsGlobals.batchScripts = {};
	}

	script.id = new Date().getTime();
	cmsGlobals.batchScripts[script.id] = script;
}

function unregisterBatchScriptById(id) {
	if (!cmsGlobals.batchScripts) {
		cmsGlobals.batchScripts = {};
	}
	delete cmsGlobals.batchScripts[id];
}