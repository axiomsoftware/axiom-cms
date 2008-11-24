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

// if-cms-version-enterprise
function archive_tasks(){
	var conn = app.getDbSource('_default').getConnection(false);
	app.getObjects('CMSTask', {status: 'Approved'}).each(function(task){
		var delta = (new Date()).getTime() - task.lastmodified.getTime();
		var archive_period = root.get('cms').archive_period * 86400000;
		if(delta > archive_period){
			task.archive(conn);
		}
	});
}
// end-cms-if