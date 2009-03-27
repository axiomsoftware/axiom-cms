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


function cms_add() {
	var p = req.data.prototype;
	var folder = this.get(p);
	if (!folder){
		folder = new CMSContentFolder();
		folder.id = p;
		folder.title = p + " Folder";
		root.get('cms').add(folder);
	}

	var child = eval('new '+p+'();');
	folder.add(child);

	child.id = child._id;

	child.cms_status = 'null';
	if(req.data.task_id){
		var task = app.getHits("CMSTask", {task_id: req.data.task_id}).objects(0,1)[0];
		if(task)
			child._task = new Reference(task);
		else
			app.log("Couldn't associate new "+p+" with task_id "+req.data.task_id+" - couldn't find CMSTask object in db.");
	}
	child._action = "Added";

	return child.cms_edit({add:true});
}
