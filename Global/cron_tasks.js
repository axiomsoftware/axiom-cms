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

