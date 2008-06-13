function task_report(){
	var filters = [];
	if(req.data.assignee && req.data.assignee != "All Assignees"){
		filters.push(new NativeFilter('assignee_searchable: '+req.data.assignee));
	}
	if(req.data.status && req.data.status != "All Statuses"){
		filters.push(new Filter({status:req.data.status}));
	}
	if(req.data.keywords){
		filters.push(new NativeFilter('task_searchable_content: '+req.data.keywords));
	}

	var before, after;
	if(req.data.beforeDate){
		before = new Date(req.data.beforeDate);
	}
	if(req.data.afterDate){
		after = new Date(req.data.afterDate);
	}

	if(before || after){
		filters.push(new NativeFilter('due_date: [' + (after || new Date(0)).dateValue() +' TO '+ (before || new Date(2100,0,0)).dateValue() +']'));
	}

	var filter = filters.length ? new AndFilter(filters) : {};
	res.setContentType('text/csv');
	res.setHeader("Content-disposition", "attachment; filename=task_report.csv" );
	res.write("Task ID,Task Name,Due Date,Task Status,Objects in Task,Task Description,Task Created,Current Assignee,Submitted,Approved,Approval Comments,Rejected,Reason for Rejection\n");
	res.write(app.getObjects("CMSTask", filter).map(function(task){
		return [task.task_id,
				task.name,
				task.due_date,
				task.status,
				app.getSources(task).length,
				task.description,
				task._created.toCSVString() + ' by ' + task.creator,
				task.assignee_searchable,
				task.status == 'Pending' ? (task.lastmodified().toCSVString() + ' by ' + task.submitter_searchable ): '',
				task.status == 'Approved' ? (task.lastmodified().toCSVString() + ' by ' + task.admin_actor ): '',
				task.status == 'Approved' ? task.approval_description : '',
				task.status == 'Rejected' ? (new Date(task.cms_lastmodified).toCSVString() + ' by ' + task.admin_actor ): '',
				task.status == 'Rejected' ? task.rejection_description : ''
			   ].join(',');
	}).join('\n'));
}

function archived_task_report(){

	var conn = app.getDbSource('_default').getConnection();
	var stmt = conn.createStatement();
	var target_date = new Date(new Date().getTime() - req.data.archived*86400000);
	var rows = stmt.executeQuery("SELECT * FROM AuditLog_ArchivedTasks WHERE archive_date > TIMESTAMP '"+target_date.toH2Timestamp()+"'");
	var objects = [];

	rows.beforeFirst();
	while(rows.next()){
		objects.push([rows.getInt('task_id'),
					  rows.getString('name'),
					  rows.getString('description'),
					  rows.getDate('due_date'),
					  rows.getString('approved_by'),
					  rows.getString('submitter'),
					  rows.getString('creator')].join(','));
	}
	res.setContentType('text/csv');
	res.setHeader("Content-disposition", "attachment; filename=archived_task_report.csv" );
	res.write("Task ID,Task Name,Task Description,Due Date,Approved By,Submitted By,Created By\n");
	res.write(objects.join('\n'));
}

function locked_content_report(){
	var filter = {_locked: 'true'};
	if(req.data.keywords){
		filter.title = req.data.keywords;
	}
	if(req.data.owner && req.data.owner != "All Users"){
		filter.cms_owner = req.data.owner;
	}
	filter = new AndFilter(filter, new OrFilter({'cms_status': 'a'}, {'cms_status': 'z'}));
	res.setContentType('text/csv');
	res.setHeader("Content-disposition", "attachment; filename=locked_content_report.csv" );
	var prettyNames = this.cms_getPrototypesHash(false);
	res.write("Object Title,Content Type,Location,Live URL,Task ID,Task Name,Task Status,Task Assignee,Task Due Date\n");
	return app.getObjects([i for(i in prettyNames)], filter).map(function(obj){
		var uri = obj.getURI();
		var task = obj._task.getTarget();
		return [obj.title,
				(prettyNames[obj._prototype] || obj._prototype),
				obj.getPath(),
				uri.match(/^\/cms/) ? '' : uri,
				task.task_id,
				task.name,
				task.status,
				task.assignee.getTarget().username,
				task.due_date ? task.due_date.toCSVString() : ''
			   ].join(',');
	}).join('\n');
}

function object_action_report(){
	var filter = new OrFilter({'cms_status': 'a'},{'cms_status':'z'});
	var sub_filter;
	if(req.data.action == "All Actions"){
		sub_filter = new OrFilter({'_action': 'Added'}, {'_action': 'Edited'}, {'_action': 'Deleted'});
	} else {
		sub_filter = {'_action': req.data.action};
	}
	filter = new AndFilter(filter, sub_filter);

	res.setContentType('text/csv');
	res.setHeader("Content-disposition", "attachment; filename=object_action_report.csv" );
	var prettyNames = this.cms_getPrototypesHash(false);
	var task = this._task ? this._task.getTarget() : false;
	var uri = this.getURI();
	res.write("Object Title,Last Action,Content Type,Location,Live URL,Task/Assignee,Task Status\n");
	return app.getObjects([i for(i in prettyNames)], filter).map(function(obj){
		return [obj.title,
				obj.action,
				(prettyNames[obj._prototype] || obj._prototype),
				obj.getPath(),
				uri.match(/^\/cms/) ? '' : uri,
				task ? task.task_id +'/'+task.assignee.getTarget().username : '',
				task ? task.status : ''
			   ].join(',');
	}).join('\n');
}

function users_report(){
	var filter = {};

	if(req.data.role && req.data.role != "All Roles"){
		filter = new NativeFilter('search_roles: "'+req.data.role+'"');
	}

	var cms = this;
	res.setContentType('text/csv');
	res.setHeader("Content-disposition", "attachment; filename=users_report.csv" );
	res.write("Username,First Name,Last Name,Role(s),Email Address,Last Login,Open Tasks,Locked Content\n");
	res.write(app.getObjects("CMSUser", filter).map(function(u){
		var tasks = cms.my_open_tasks(u);
		return [u.username,
				u.first_name,
				u.last_name,
				u.search_roles,
				u.email,
				u.last_login ? u.last_login.toCSVString() : '',
				tasks.length,
				tasks.inject(0, function(acc,task) {return acc+app.getSources(task).length;})
			   ].join(',');
	}).join('\n'));
}
