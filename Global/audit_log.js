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


function auditLogTaskAction(data, conn){
	var stmt;
	var exception = false;
	try{
		stmt = conn.createStatement();
		stmt.execute("INSERT INTO AuditLog_TaskActions (task_id, username, action) VALUES( "+
					 data.task_id+",'"+
					 data.username+"','"+
					 data.action+"')");
	}catch(e){
		app.log(e);
	} finally{
		if(stmt){
			stmt.close();
		}
	}
}

function auditLogObjectAction(data, conn){
	var sql = "INSERT INTO AuditLog_ObjectActions (task_id, object_id, username, action, title, uri, prototype, added_to_task) VALUES( "+
		(data.task_id || 'null')+","+
		data.object_id+",'"+
		data.username+"','"+
		data.action+"','"+
		(data.title||'').replace(/'/g,"''")+"','"+  //')
		data.uri+"','"+
		data.prototype+"',"+
		(data.added_to_task || 'FALSE')+")";
	var stmt;
	try{
		stmt = conn.createStatement();
		stmt.execute(sql);
	} catch(e){
		app.log(e);
	} finally{
		if(stmt){
			stmt.close();
		}
	}
}

