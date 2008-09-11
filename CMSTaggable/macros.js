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