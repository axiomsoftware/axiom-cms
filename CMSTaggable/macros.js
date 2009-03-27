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


function custom_edit_function(){
	return 'axiom.submitMultiEdit(\''+this.getURI()+'edit_taggable\',"'+this.id+'");';
}


/**
 * If this object has a CMSTag matching tag_name, returns the CMSTag.
 * Returns false if not found.
 */
function has_tag(tag_name){
	if(!tag_name) return;
	if(this.tags){
		var len = this.tags.length;
		for(var i=0; i< len; i++){
		    if(this.tags[i] && this.tags[i].getTarget() && this.tags[i].getTarget().title == tag_name){
				return this.tags[i].getTarget();
		    }
		}
	}
	return false;
}

/**
 * Add a new CMSTag to this object, if the tag exists in the system.
 */
function add_tag(tag_name){
	if(!tag_name) return;
	var tag = this.has_tag(tag_name);
	if(!tag){
		tag = app.getObjects("CMSTag", {title: tag_name}, {maxlength: 1})[0];
		if(tag){
			if(!this.tags){
				this.tags = new MultiValue(new Reference(tag));
			}
			else{
				this.tags = this.tags.concat(new MultiValue(new Reference(tag)));
			}
		}
	}
}

/**
 * Removes the CMSTag matching tag_name if found in the object's tag list
 */
function remove_tag(tag_name){
	if(!tag_name) return;
	if(this.tags){
		var len = this.tags.length;
		for(var i=0; i< len; i++){
			if(this.tags[i].getTarget().title == tag_name){
				this.tags = this.tags.splice(i, 1);
				break;
			}
		}
	}
}

/**
 * Returns an array of strings representing the titles of object's tags.
 */
function ajax_tag_list(){
	var results = [];
	if(this.tags){
		var len = this.tags.length;
		for(var i=0; i< len; i++){
			var tag = this.tags[i].getTarget();
			if(tag)
				results.push(tag.title);
		}
	}
	return results;
}



/**
 *  Wrapper functions to hit via urls requests.
 */
function req_add_tag(){ this.add_tag(req.get("tag")); }
function req_remove_tag(){ this.remove_tag(req.get("tag")); }


/**
 *  Search aggregation of tag titles
 */
function generateTagString(){
	var results = [];
	if(this.tags){
		var len = this.tags.length;
		for(var i=0; i< len; i++){
			var tag = this.tags[i].getTarget();
			if(tag && tag.title){
				results.push(tag.title);
			}
		}
	}
	return results.join(' ');
}