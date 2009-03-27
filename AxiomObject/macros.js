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


function lockedByOther(){
	if(!this._task)
		return false;
	var task = this._task.getTarget();
	return (task ? (task.assignee.getTarget().username != session.user.username) : false);
}

function getOwner(){
	if(!this._task)
		return false;
	var task = this._task.getTarget();
	return (task.assignee ? task.assignee.getTarget().username : 'CMSNOOWNER');
}

function viewAssets(){
	return (session.user.hasRole('Administrator') || session.user.hasRole('Content Editor'));
}

function typeString(){
	return this._prototype;
}

function cmsTagList(){
	return this.list_tags({window_id: 'left_nav_tags',
			       input_id: 'keywords',
			       searchmode: true});
}

function genCMSSortablePrototype(){
	var props = cmsGlobals.props;
	try{
		if(props){
			var prototype = props..*.(@name == this._prototype);
			return ((prototype && prototype.@displayname) ? prototype.@displayname.toString() : this._prototype);
		}
	} catch(e){
		app.log(e);
	}
	return this._prototype;
}

function genCMSSearchableContent(){
	return [ (this.id || ''),
		 (this.title || '') ].join(' ');
}

function isAdmin(){
	var user = session.getUser();
	return user?user.hasRole("Administrator"):false;
}

/**
 *  Retrieve the value of a property defined for this prototype from cms.xml
 *  Returns boolean true or false if the property value is "true" or "false".
 *  Otherwise, returns a string.  If property is not found, returns the default
 *  value or undefined if no default is given.
 */
function getCMSProperty(key, default_value){
	var cms_props = cmsGlobals.props;
	if(cms_props){
		var proto = cms_props..prototype.(@name == this._prototype);
		if(proto){
			var val = proto.@[key].toString();
			switch(val){
			case 'undefined':
			case '':          return default_value;
			case 'true':      return true;
			case 'false':     return false;
			default:          return val;
			}
		}
	}
	return default_value;
}


/**
 *  Return a boolean indicating if the object can be added in the cms
 */
function addable(){
	var val = this.getCMSProperty('addable', true);
	return val;
}


/**
 *  Return a boolean indicating if the object can be edited in the cms
 */
function editable(){


	var val = this.getCMSProperty('editable', true);
	if(typeof this.cmsEditableAdvice == 'function') // application hook
		return this.cmsEditableAdvice(val);
	return val;

}


/**
 *  Return a boolean indicating if the object can be deleted in the cms
 */
function deleteable(){
	var val = this.getCMSProperty('deleteable', true);
	if(typeof this.cmsDeletableAdvice == 'function') // application hook
		return this.cmsDeleteableAdvice(val);
	return val;
}

function cancel_delete(){
	this._task = null;
	this._action = null;
}

function getLocationPaths(){
	return app.__app__.getPrototypeByName(this._prototype).getProperty('_location.paths');
}

function getTreeIconURI() {

	if (this._prototype == "ContentManagementSystem") {
		return app.getStaticMountpoint('/axiom/images/tree_cms.gif');
	}

	if (this._prototype == "CMSContentFolder") {
		return app.getStaticMountpoint('/axiom/images/tree_contentfolder.gif');
	}

	return app.getStaticMountpoint('/' + this.getCMSProperty('treeicon','axiom/images/tree_default.gif'));

}