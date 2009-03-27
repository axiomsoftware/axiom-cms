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


function task_editable(){
	var task = this._task ? this._task.getTarget() : false;
	var editable = this.editable();
	if(editable && session.user.hasRole("Content Contributor") && task && task.assignee && task.assignee.getTarget().username != session.user.username){
		editable = false;
	}
	return editable;
}

function syncToLive(){
	app.deleteDraft(this, 1);
}

function publishToLive(){
	app.saveDraft(this);
}

function task_approved() {
	if (this._action == "Deleted") {
		this.cms_delete();
	} 
	this._action = null;
	this._task = null;

	this.publishToLive();
}
