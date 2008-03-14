// if-cms-version-enterprise
function main(){
	res.write(this.frame({title: 'Axiom CMS', 
						  nav: 'tasks_nav', 
						  content: 'tasks_content',
						  scripts: ['tasks.js']}));
}
// end-cms-if

//if-cms-version-standard|workgroup
function main(){
	this.content();
}
//end-cms-if

function content(){
	res.write(this.frame({title: 'Axiom CMS', 
						  nav: 'content_nav', 
						  content: 'content_content',
						  scripts: []
						 }));
}

function assets(){
	res.write(this.frame({title: 'Axiom CMS - Assets', 
						  nav: 'asset_nav', 
						  content: 'asset_content',
						  scripts: ['asset_manager.js']}));
}

function users(){
	res.write(this.frame({title: 'Axiom CMS - Users', 
						  nav: 'users_nav', 
						  content: 'users_content',
						  omit_top: true,
						  scripts: ['users.js']}));

}
function settings(){
	res.write(this.frame({title: 'Axiom CMS - Settings', 
						  nav: 'settings_nav', 
						  content: 'settings_content',
						  omit_top: true,
						  scripts: ['settings.js'],
						  css: ['settings.css']}));

}
function reports(){
	res.write(this.frame({title: 'Axiom CMS - Reports', 
						  nav: 'reports_nav', 
						  content: 'reports_content',
						  scripts: ['reports.js']}));

}


/** 
 *  Add application specific tabs to the cms by overriding this stub method.
 *  Should return a list of objects with the following properties:
 *        href             -> location of the tab content
 *        title            -> link title 
 *        highlight_action -> name of the action upon which this tab should be highlighted
 *
 *  Example:
 *     return [ {href: root.getURI()+'cms/reports', title: 'Reports', highlight_action:'reports'} ];
 */
function app_tabs(){
	return [];
}