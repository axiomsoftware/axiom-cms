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


function main(){
	res.write(this.frame({title: 'Axiom CMS',
						  nav: 'tasks_nav',
						  content: 'tasks_content',
						  scripts: ['tasks.js']}));
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