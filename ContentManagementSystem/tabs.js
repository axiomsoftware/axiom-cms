
function main(){
	this.content();
}

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
						  class_name: 'users',
						  omit_top: true,
						  scripts: ['users.js']}));

}

function recyclebin(){
	res.write(this.frame({title: 'Axiom CMS - Recycle Bin',
						  nav: 'recyclebin_nav',
						  content: 'recyclebin_content',
						  omit_top: true,
						  class_name: 'users',
						  scripts: ['recyclebin.js']}));

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