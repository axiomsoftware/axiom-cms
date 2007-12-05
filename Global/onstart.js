function cms_init(){
	if(!root.get('cms')){
		app.log("Creating cms...");

		var cms = new ContentManagementSystem();
		cms.id = 'cms';
		cms.title = 'CMS';
		root.add(cms);
	
		var tag_folder = new CMSTagFolder();
		tag_folder.id = 'tagfolder';
		cms.add(tag_folder);
		
		var users = new CMSUserFolder();
		users.id = "userfolder";
		users.title = "Users";
		cms.add(users);
		
		var files = new CMSFileFolder();
		files.id = "filefolder";
		files.title = "File Folder";
		root.add(files);
		
		app.log('Creating default cms user: admin / changeme');
		var user = new CMSUser();
		users.add(user);
		user.username = 'admin';
		user.first_name = 'Default';
		user.last_name = 'Administrator';
		user.email = '';
		user.setPassword('changeme');
		user.setRoles('Administrator');
	}

	if(!app.getObjects("CMSRecycleBin", "_d:1", {maxlength: 1})[0]){
		var bin = new CMSRecycleBin();
		root.get('cms').add(bin);
		bin.id = "recyclebin";
	}

	if(!app.getObjects("CMSTaskContainer", "_d:1", {maxlength: 1})[0]){
 		var container = new CMSTaskContainer();
		root.get('cms').add(container);
		container.id = "task_container";
	}

	// setup audit log table
	var exception = false;
	var conn = app.getDbSource('_default').getConnection(false);
	try{
		// object action table
		
		var stmt_obj_action = conn.createStatement();
		stmt_obj_action.execute('CREATE TABLE AuditLog_ObjectActions( '+
								'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'+
								'object_id INT NOT NULL,'+
								'task_id INT,'+ 
								'prototype VARCHAR(255),'+
								'added_to_task BOOLEAN,'+
								'title VARCHAR(255),'+
								'uri VARCHAR(255),'+
								'username VARCHAR(255) NOT NULL,'+
								'action VARCHAR(50) NOT NULL)');
		stmt_obj_action.close();

		// task_action_table
		var stmt_task_action = conn.createStatement();
		stmt_task_action.execute('CREATE TABLE AuditLog_TaskActions( '+
								 'timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'+
								 'task_id INT NOT NULL,'+
								 'username VARCHAR(255) NOT NULL,'+
								 'action VARCHAR(50) NOT NULL)');
		stmt_task_action.close();

		// archived_task
		var stmt_archived_tasks = conn.createStatement();
		stmt_archived_tasks.execute('CREATE TABLE AuditLog_ArchivedTasks( '+
									'archive_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'+
									'task_id INT NOT NULL,'+
									'name VARCHAR(255) NOT NULL,'+
									'description CLOB,'+
									'due_date DATE,'+
									'approved_by VARCHAR(255) NOT NULL,'+
									'submitter VARCHAR(255) NOT NULL,'+
									'creator VARCHAR(255) NOT NULL)');
		stmt_archived_tasks.close();

	} catch(e){
		if(!(e.javaException instanceof Packages.java.sql.SQLException)){
			throw e;
		}
	}

	// default to running cleanup at midnight
	var args = ['cms_cleanup', '*', '*', '*', '*', '0', '0'];
	var cleanup  = app.getCMSProperties().cleanup;
	var user_defined_schedule = cleanup?cleanup.@schedule:false;
	if(user_defined_schedule && user_defined_schedule.toString().replace(/\s+/g,'')){
		args = ['cms_cleanup'].concat(user_defined_schedule.toString().split(/\s+/));
	}
	app.addCronJob.apply(app, args);

	// if-cms-version-enterprise
	// run task archiving at 2:00am every night
	app.addCronJob('archive_tasks', '*', '*', '*', '*', '2', '0');
	// end-cms-if

	// application onStart hook
	if(typeof appOnStart == "function")
		appOnStart();
}

