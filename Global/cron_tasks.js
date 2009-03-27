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

function publish_scheduled_tasks(){
	var current = new Date();
	var start = new Date(current.valueOf());
	start.setMinutes(current.getMinutes() - 10);
	var end = new Date(current.valueOf());
	end.setMinutes(current.getMinutes() + 10);
	var filter = new NativeFilter("publish_date:["+start.timeValue()+" TO "+end.timeValue()+"]");
	var conn = app.getDbSource('_default').getConnection(false);	
	var task_groups = app.getObjects("CMSTask",filter,{layer:1}).inject({},
		function(table, task){
			app.log("Publishing Items from Task: " + task.name);
			for each(var obj in app.getSources(task, [], new NativeFilter("cms_status: a OR cms_status: z","WhitespaceAnalyzer"),{layer:1})){
				app.log("Publishing Item: " + obj.getPath());
				obj.task_approved();
			}
			task.status = "Approved";
			task.publish_date = null;

			var submitter = task.submitter ? task.submitter.getTarget() : app.getHits("CMSUser",{username:task.admin_actor},{layer:1}).objects(0,1)[0];
			if(table[submitter.username])
				table[submitter.username].tasks.push(task)
			else
				table[submitter.username] = {tasks: [task], submitter: submitter};

			auditLogTaskAction({task_id: task.task_id,
								username: task.admin_actor,
								action: 'Approved'},
								conn);
			return table;

		});

	root.get('cms').scheduleNotification(task_groups);

}
