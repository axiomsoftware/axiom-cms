function add_to_delete_task(data){
	data = (data || req.data);
	var task = app.getHits("CMSTask", {task_id: data.task_id}).objects(0,1)[0];
	var filters = data.objects.map(function(obj){ return new Filter({'_id': obj.id}) })
	var conn = app.getDbSource('_default').getConnection(false);
	var objs = app.getObjects([], new AndFilter(new OrFilter(filters), new NativeFilter("_status: a OR _status: z","WhitespaceAnalyzer"))).map(function(obj){ return app.getDraft(obj, 1) });
	app.log(app.getObjects([], new OrFilter(filters)).toSource());
	app.log("setting _task on objects to be deleted: ");
	for each(var obj in objs){
		obj._task = new Reference(task);
		obj._action = "Deleted";
		obj.cms_lastmodified = new Date();
		
		auditLogObjectAction({task_id:       task.task_id,
							  username:      task.admin_actor,
							  title:         obj.title,
							  object_id:     obj._id,
							  uri:           obj.getURI(),
							  prototype:     obj._prototype,
							  action:        'Deleted',
							  added_to_task: 'TRUE'},
							 conn);
	}
}

function approve_tasks(data){
	data = (data || req.data);
	var filters = this.get_task_filters(data);
	var cms = this;
	var conn = app.getDbSource('_default').getConnection(false);
	var task_groups = app.getObjects("CMSTask", new OrFilter(filters), {maxlength: filters.length}).inject({}, function(table, task){
		for each(var obj in app.getSources(task)){
			if(obj._action == "Deleted"){
				obj.cms_delete();
			} else{
				obj._action = null;
				obj._task = null;
			}
			obj.publishToLive();
		}
		task.approval_description = (data.description || null);
		task.admin_actor = session.user ? session.user.username : "system";
		task.status = "Approved";

		var submitter = task.submitter ? task.submitter.getTarget() : session.user;
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

	this.emailNotifications('been approved and published.', 
							'All tasks are now in an approved status and appear in your "My Closed Tasks" table.', 
							'has approved and published the following tasks:', 
							task_groups);
	
}

function reject_tasks(data){
	data = (data || req.data);
	var filters = this.get_task_filters(data);
	var cms = this;
	var conn = app.getDbSource('_default').getConnection(false);
	var task_groups = app.getObjects("CMSTask", new OrFilter(filters), {maxlength: filters.length}).inject({}, function(table, task){
		var submitter = task.submitter.getTarget();
		task.status = "Rejected";
		task.rejection_description = data.reason;
		task.assignee = new Reference(submitter);
		task.admin_actor = session.user ? session.user.username : "system";

		if(table[submitter.username])
			table[submitter.username].tasks.push(task) 
		else
			table[submitter.username] = {tasks: [task], submitter: submitter};
		
 		auditLogTaskAction({task_id: task.task_id,
							username: task.admin_actor,
							action: 'Rejected'},
						  conn);
		return table;
	});

	this.emailNotifications('been rejected.', '', 'has rejected the following tasks:', task_groups);
}

function submit_tasks(data){
	data = (data || req.data);
	var assignee = app.getHits("CMSUser", {username: data.assignee}).objects(0,1)[0];
	var tasks = [];
	var mailers = [];
	if(!assignee){
		res.setStatus(500);
		res.write("Could not find user "+assignee);
	} else {
	 	var filters = this.get_task_filters(data);
		tasks = app.getObjects("CMSTask", new OrFilter(filters), {maxlength: filters.length});
		var conn = app.getDbSource('_default').getConnection(false);
		for each(task in tasks){
			task.status = "Pending";
			task.submitter = new Reference(task.assignee.getTarget());
			task.assignee = new Reference(assignee);

			auditLogTaskAction({task_id: task.task_id,
								username: task.submitter.getTarget().username,
								action: 'Submitted'},
							  conn);
		}
	}	

	var task_table = {};
	task_table[assignee.username] = {submitter: assignee, tasks: tasks};
	this.emailNotifications('been been submitted for your approval.', 
							'All tasks listed above are now owned by you.', 
							'has submitted the following tasks for approval:', 
							task_table);
}

function delete_tasks(data){
	data = (data || req.data);
	var filters = this.get_task_filters(data);
	var cms = this;
	var conn = app.getDbSource('_default').getConnection(false);
	var task_table = app.getObjects("CMSTask", new OrFilter(filters), {maxlength: filters.length}).inject({}, function(table, task){
		for each(obj in app.getSources(task, null, ['a', 'z'])){
			if(obj._action == "Deleted")
				obj._action = null;
			else if(obj._action == "Added")
				obj._parent.remove(obj);
			else // Edited
				obj.syncToLive();
			obj._task = null;
		}

		task._parent.remove(task);
		auditLogTaskAction({task_id: task.task_id,
							username: session.user.username,
							action: 'Deleted'},
						   conn);
		
		var assignee = task.assignee.getTarget();
		if(table[assignee.username])
			table[assignee.username].tasks.push(task); 
		else
			table[assignee.username] = {tasks: [task], submitter: assignee};
		return table;
	});
	
	this.emailNotifications('been been deleted.', 
							'All content objects within the above tasks have been reversed: Additions removed, edits reverted, and deletions cancelled.', 
							'has deleted your following tasks:', 
							task_table);
}

function get_task_filters(data){
	return data.task_ids.map(function(task_id){ return new Filter({task_id: task_id}) });
}

function emailNotifications(subject_verbage, body, action_verbage, task_groups){
	var mailers = [];
	for(var username in task_groups){
		var tasks = task_groups[username].tasks;
		var assignee = task_groups[username].submitter;
		if(assignee.username != session.user.username){
			var mailer = new axiom.Mail();
			var subject; 
			if(tasks.length > 1)
				subject = 'Axiom CMS: '+tasks.length+' tasks have '+subject_verbage;
			else
				subject = 'Axiom CMS: Task '+tasks[0].task_id+' has '+subject_verbage;
			mailer.setData({ to:      {email: assignee.email, name: assignee.first_name + ' ' + assignee.last_name},
							 from:    {email: session.user.email || 'robot@siteworx.com', name: session.user.first_name + ' ' + session.user.last_name},
							 subject: subject,
							 html:    this.task_email({assignee_name:  assignee.first_name,
													   actor_name:     session.user.first_name,
													   action:         session.user.first_name+' '+action_verbage,
													   tasks:          tasks,
													   body:           (body || '')
													  })
						   });
			mailers.push(mailer);
		}
	}
	mailers.invoke('send');

}

function add_task(data){
	data = (data || req.data);

	// modifying the property creates a lock on the container for this thread,
	// so the generated task_id should be unique
	var container = app.getObjects("CMSTaskContainer", {}, {maxlength: 1})[0];
	container.last_id += 1; 

	var t = new CMSTask();
	container.add(t);
	t.id = t._id
	var user = data.assignee ? app.getHits('CMSUser', {username: data.assignee}).objects(0,1)[0] : session.user;
	t.assignee = new Reference(user);
	t.name = data.name;
	t.description = data.description;
	if(data.due_date)
		t.due_date = new Date(data.due_date);
	t.task_id = container.last_id;

	auditLogTaskAction({task_id: t.task_id,
						username: session.user.username,
						action: 'Created'},
					   app.getDbSource('_default').getConnection(false));

	return {task_id: t.task_id,
			path:    t.getPath(),
			name:    t.name};
}

function my_pending_tasks(user){
	user = (user || session.user)
	var sort = this.getSort(req.data.sort || [{task_id: 'asc'}]);
	return app.getObjects("CMSTask", {assignee_searchable: user.username, status: "Pending"}, {sort: sort}).map(this.extract_task);

}

function my_assigned_tasks(user){
	user = (user || session.user);
	var filter = new AndFilter({assignee_searchable: user.username}, 
		                       new OrFilter({status: "Incomplete"}, {status: "Rejected"}));
	var sort = this.getSort(req.data.sort || [{task_id: 'asc'}]);
	return app.getObjects("CMSTask", filter, {sort: sort}).map(this.extract_task);
}

function my_closed_tasks(user){
	user = (user || session.user)
	var filter = new AndFilter(new Filter({creator: user.username}), new Filter({status: "Approved"}));
	var sort = this.getSort(req.data.sort || [{task_id: 'asc'}]);
	return app.getObjects("CMSTask", filter, {sort: sort}).map(this.extract_task);
}

function my_open_tasks(user){
	user = (user || session.user);
	var filter = new OrFilter(new AndFilter({creator:user.username},{status: "Pending"}), 
		                      new AndFilter({assignee_searchable: user.username}, 
		                                     new OrFilter({status: "Incomplete"}, {status: "Rejected"})));
	var sort = this.getSort(req.data.sort || [{task_id: 'asc'}]);
	return app.getObjects("CMSTask", filter, {sort: sort}).map(this.extract_task);
}

function search_tasks(data){
	data = (data || req.data);
	var sort = this.getSort(data.sort || [{task_id: 'asc'}]);
	var filter = new AndFilter({assignee_searchable: data.args.username},
		                       new OrFilter({status: 'Incomplete'}, {status: 'Rejected'}, {status: 'Pending'}));
	return app.getObjects("CMSTask", filter, {sort: sort}).map(this.extract_task);
}

function extract_task(task){
	var objects = [];
	if(task.status == 'Approved'){
		var conn = app.getDbSource('_default').getConnection();
		var stmt = conn.createStatement();
		var rows = stmt.executeQuery('SELECT * FROM AuditLog_ObjectActions WHERE added_to_task = TRUE AND task_id = '+task.task_id);
		rows.beforeFirst();
		while(rows.next()){
			objects.push({title:      rows.getString('title'),
						  _id:        rows.getString('object_id'),
						  _prototype: rows.getString('prototype'),
						  _action:    rows.getString('action'),
						  href:       rows.getString('uri')
						 });
		}
		stmt.close();
	} else{
		objects = app.getSources(task, null, ['a', 'z']).map(
			function(obj){
				return {title:      obj.title,
						editable:   obj.task_editable(),
						_id:        obj._id,
						_prototype: obj._prototype,
						_action:    obj._action,
						href:       obj.getURI()};
			});
	}
	return { _id:           task._id,
			 task_id:       task.task_id,
			 description:   task.description,
			 href:          task.getURI(),
			 path:          task.getPath(),
			 name:          task.name,
			 creator:       task.creator,
			 assignee:      task.assignee_searchable,
			 due_date:      task.due_date,
			 status:        task.status,
			 submittable:   task.submittable(),
			 deletable:     task.deletable(),
			 approvable:    task.approvable(),
			 rejectable:    task.rejectable(),
			 admin_actor:   task.admin_actor,
			 lastmodified:  new Date(task.lastmodified().getTime()),
			 submitter:     task.submitter ? task.submitter.getTarget().username : null,
			 approval_description:  task.approval_description,
			 rejection_description: task.rejection_description,
			 objects:       objects };
}

function getSort(arr){
	return new Sort(arr);
}
