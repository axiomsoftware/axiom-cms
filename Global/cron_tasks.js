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


function cms_cleanup(){
	app.log('Cleaning up objects with null status...');
	var ms_to_hours = 1000*60*60;
	var now = (new Date()).getTime();
	var cleanup = cmsGlobals.props.cleanup;

	var expiration_time;
	if(cleanup && cleanup.@interval){
		expiration_time = parseInt(cleanup.@interval, 10);
		if(!expiration_time){
			app.log("Could not parse interval for cms cleanup - defaulting to 72 hours.");
			expiration_time = 72;
		}
	} else {
		//default to three days
		expiration_time =  72;
	}

	var for_removal = [obj for each(obj in app.getObjects([], "cms_status: null")) if(expiration_time < Math.floor((now - obj.lastmodified().getTime()) / ms_to_hours)) ];

	// advice hook
	if(typeof ContentManagementSystem.cmsCleanupAdvice == 'function'){
		ContentManagementSystem.cmsCleanupAdvice(for_removal);
	}

	for each(obj in for_removal){
		obj._parent.remove(obj);
	}

	app.log('Removed '+for_removal.length+' objects with null status.');
}

