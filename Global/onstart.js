if(!this.cmsGlobals){
	this.cmsGlobals = {};
}

function cms_init(){
	cmsGlobals.loadCMSProperties();
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

		app.log('-------------------------------------------');
		app.log('Creating default cms user: admin / changeme');
		app.log('-------------------------------------------');
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
	var cleanup;
	if(cmsGlobals.props)
		cleanup = cmsGlobals.props.cleanup;
	var user_defined_schedule = cleanup?cleanup.@schedule:false;
	if(user_defined_schedule && user_defined_schedule.toString().replace(/\s+/g,'')){
		args = ['cms_cleanup'].concat(user_defined_schedule.toString().split(/\s+/));
	}
	app.addCronJob.apply(app, args);

	// run task archiving at 2:00am every night
	app.addCronJob('archive_tasks', '*', '*', '*', '*', '2', '0');
	app.addCronJob('publish_scheduled_tasks', '*', '*', '*', '*', '*', '0,15,30,45');

    /* Set CMS version */
    cmsGlobals.version = "3.2.0";
}

function getCMSXMLLines(file) {
    var lines = [];
    if (file.exists()) {
	var reader = null;
	try {
	    reader = new java.io.BufferedReader(new java.io.FileReader(file));
	    var line = "";
	    while ((line = reader.readLine()) != null) {
		if (!(line.match(/<prototypes>|<\/prototypes>/))) {
		    lines.push(line.trim());
		}
	    }
	    reader.close();
	} catch(e) {
	    app.log("Error loading "+file.getName());
	    app.log(e);
	} finally{
	    if (reader != null) {
		try {
		    reader.close();
		} catch (e) {
		    app.log(e);
		}
	    }
	}
    }

    return lines;
}

cmsGlobals.loadCMSProperties = function() {
    var reader = null;
    // Application must define a cms.xml for the cms to function properly
    var cmsPropertiesXML = new XML("<prototypes></prototypes>");
    var cms_lines = [];
    try {
	var cmsFile = new java.io.File(app.getDir() + java.io.File.separator + "cms.xml");
	cms_lines = getCMSXMLLines(cmsFile);
    } catch (e) {
	app.log("Error: File 'cms.xml' was not present in the application. It is required to run the Axiom CMS.");
    }

    // Find cms.xml for loaded modules (in order of specification) (optional)
    var modules = app.getProperty("modules").split(",");
    for each (var mod in modules) {
	var modcmsFile = new java.io.File("modules/"+mod+"/cms.xml");
	cms_lines = cms_lines.concat(getCMSXMLLines(modcmsFile));
    }

    if (cms_lines.length > 0) {
	cmsPropertiesXML.prototypes += new XMLList(cms_lines.join(""));
    }

    cmsGlobals.props = cmsPropertiesXML;
}

/*
function getCMSPrototypes() {
	var names = [];
	Iterator prototypes = app.getPrototypes().iterator();
	Object n = null;
	while (prototypes.hasNext()) {
		n = prototypes.next();
		if (n != null) {
			Prototype p = (Prototype) n;
			if (resourceExists(p, "cms_editForm.tal")) {
				names.add(p.getName());
			}
		}
	}
	return names;
}



    public static final int CMS_THUMB_WIDTH = 100;
    public static final int CMS_THUMB_HEIGHT = 100;
    public static final int CMS_PREVIEW_WIDTH = 250;
    public static final int CMS_PREVIEW_HEIGHT = 250;

    public void addCMSThumbnails() throws Exception {
        ImageObject thumb = this.jsFunction_bound(ImageObject.CMS_THUMB_WIDTH,
                                                  ImageObject.CMS_THUMB_HEIGHT, false);
        if (thumb != null) {
            this.jsFunction_addThumbnail(thumb, "thumb");
        } else {
            core.app.logError("Could not create 'thumb' for " + this.node.getString(FILE_NAME));
        }

        ImageObject preview = this.jsFunction_bound(ImageObject.CMS_PREVIEW_WIDTH,
                                                    ImageObject.CMS_PREVIEW_HEIGHT, false);
        if (preview != null) {
            this.jsFunction_addThumbnail(preview, "preview");
        } else {
            core.app.logError("Could not create 'preview' for " + this.node.getString(FILE_NAME));
        }
    }

*/