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
 *	Allows for application specific scripts to be run on batch uploads. A "script" is an action that runs
 *	on all objects returned from a batch upload. If the user selects a script from the dropdown in the batch
 *	upload form, that script will get passed an ARRAY of all the objects. The script is then free to do whatever
 *	action on the objects individually or as a whole. Note that every object passed to your script is marked
 *	with a unique cms_batchid property.
 *	
 *	A script example:() {
 *	registerBatchScript(
 *		{
 *			id:	'cool-script-id-1',				// ID of your script. Only used for identification, not seen by user.
 *			title: 'Cool Title',				// Title of script which is displayed anywhere the script is selectable.
 *			description: 'Cool Description',	// Description of what your script does, visible to the user.
 *		 	action: function(objects) {
 *				// The actual script itself. Receives array of all objects to act upon. Note that it only runs once.
 *				// You can put anything here to do to the objects. If script errors you can return {errors: 'Error description'}
 *				// and the user will see it. Otherwise it does not need to return anything.
 *			},
 *			getTotal: function(cms_batchid) {
 *				return n;
 *				// Return the total number of objects your script is going to affect. 
 *				// Note that you do not need to run the action method on every object passed in. If you only want to affect images for
 *				// example, you can count only the images and return that number. The easiest way to count the total is
 *				// app.getHitCount('PrototypeName', {cms_batchid: cms_batchid});
 *				// The user interface locks control until this script returns getCompleted and getTotal as the same value! So make sure
 *				// your logic is right!
 *			},
 *			getCompleted: function(cms_batchid) {
 *				return n;
 *				// This function needs to return how many objects your script has processed. It gets passed the unique cms_batchid
 *				// which every object in the batch upload form will have. See above note about why you need to provide this function
 *				// instead of just assuming your script will affect every object in the batch upload form
 *			}
 *		}
 *	);
 */
function registerBatchScript(script) {
	if (!cmsGlobals.batchScripts) {
		cmsGlobals.batchScripts = {};
	}

	cmsGlobals.batchScripts[script.id] = script;
}

function unregisterBatchScriptById(id) {
	if (!cmsGlobals.batchScripts) {
		cmsGlobals.batchScripts = {};
	}
	delete cmsGlobals.batchScripts[id];
}