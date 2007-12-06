function cms_delete() {
	if(this.deleteable()){
		try {
			if(typeof this.cmsDeleteAdvice == 'function')
				this.cmsDeleteAdvice();
			var t = this.title;
			var bin = app.getObjects("CMSRecycleBin", "_d:1", {maxlength:1})[0];
			if(bin){
				var bag = new CMSTrashBag();
				bag.oldlocation = this.getPath();
				bin.add(bag);
				this.edit({'_location': bag.getPath()});
				this.nullify();
			} else{
				app.log("Couldn't find instance of CMSRecycleBin, deleting "+this._prototype+ " with _id "+this._id);
				this._parent.remove(this);
			}
			if (t) {
				res.write('{deleted:"'+t+'"}');
			} else {
				res.write('{deleted:"Untitled Object"}');
			}
		} catch(e) {
			res.status=500;
			res.write("{error:'"+e.message+"'}");
		}
	} else{
		app.log("Permission denied to delete "+this._prototype+" "+this.id);
	}
}

/**
 *  Remove all References to this object
 */
function removeReferences(){
	for each(var source in app.getSources(this)){
		for each(var ref in app.getReferences(source, this)){
			if(source[ref.sourceProperty] instanceof MultiValue){
				source[ref.sourceProperty] = source[ref.sourceProperty].splice(ref.sourceIndex, 1);
			} else{
				source[ref.sourceProperty] = null;
			}
		}
		// if-cms-version-enterprise
		app.saveDraft(source, 0);
		// end-cms-if
	}
}


/**
 *  Set this object and its descendants' status to null.
 */
	function nullify(){
		this.removeReferences();
		this.setStatus('null');
		for each(child in this.getChildren()){ 
			child.nullify();
		}
	}

	function cms_href() {
		var href = this.getURI();
		var last = href.length-1;
		if (href[last]=='/') { href = href.substring(0,last); }
		return href;
	}

	function cms_path() {
		if ((this._prototype == 'Image') || (this.prototyp == 'File')) {
			return 'Filesystem';
		}
		return this.getPath();
	}

	function cms_getPrototypeNames(showAll) {
		var names = (showAll!=undefined&&showAll==false)?'':'"",';
		var pn = this.getSearchablePrototypes();
		var last = pn.length-1;
		for (var i=0;i<pn.length;i++) {
			names += '"'+pn[i]+'"';
			if (i!=last) { names+=','; }
		}
		return '['+names+']';
	}

	function _getPrototypesHash(prototypes) {
		var names = '';
		var last = prototypes.length-1;
		for (var i=0;i<prototypes.length;i++) {
			names += prototypes[i][0]+':"'+prototypes[i][1]+'"';
			if (i!=last) { names+=','; }
		}
		return names;
	}

	function cms_getPrototypesHash(showAll) {
		var names = (showAll!=undefined&&showAll==false)?'':'All:"",';
		names += this._getPrototypesHash(this.getSearchablePrototypePairs());
		return '{'+names+'}';
	}

/**  
 * Return a serialized object associating the prototype name with the display name
 * of all user-addable prototypes in the cms.
 */
function cms_getAddPrototypesHash(){
	var proto_list = app.getCMSProperties()..prototype.(@addable != 'false');
	var elements = [];
	var results = [];
	for each(var proto in proto_list){ 
		if(typeof this.cmsAddableAdvice == 'function'){
			if(this.cmsAddableAdvice(proto.@name.toString()))
				elements.push(proto);
		} else {
			elements.push(proto);
		}
	}
	elements.sort(function(a,b){ return new java.lang.String(a.@displayname.toString()).compareTo(b.@displayname.toString()); });
	for each(var proto in elements){
		results.push([proto.@name.toString(), ': "',(proto.@displayname || proto.@name).toString(), '"'].join(''));
	}
	results = '{' + results.join(', ') + '}';
	return results;
}

var _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function createdByString(){
	return 'Created '+this._lastmodified.toCMSString()+' by '+(session.user ? session.user.username : 'System');
}

function lastModifiedString() {
	var user = (app.getObjects("CMSUser", {username: this.lastmodifiedby})[0] || session.user);
	return 'Last edited '+(this.cms_lastmodified?this.cms_lastmodified.toCMSString():'')+' by '+(user?user.username:'System');
}

var _pTitles = {'Root':'SiteRoot','ContentManagementSystem':'CMS','ContentFolder':'CMS'};

function parentTitle(){
	if (!this._parent) { return ''; }
	var title = this._pTitles[this._parent._prototype];
	if (!title&&this._parent.title) { return this._parent.title; }
	return '';
}

function referencePath(property) {
	if (!this[property]) { return ''; }
	var ref = this[property];
	if (this.getTypePropertyValue(property+'.type')=='MultiValue(Reference)') { if (ref.length==0) {return '';} ref = this[property][0]; }
	var target = ref.getTarget();
	if (target==null) { return ''; }
	return target.getPath();
}

function referenceTitle(property) {
	if (!this[property]) { return ''; }
	var ref = this[property];
	if (this.getTypePropertyValue(property+'.type')=='MultiValue(Reference)') { if (ref.length==0) {return '';} ref = this[property][0]; }
	var target = ref.getTarget();
	if (!target) { return ''; }
	var title = target.title
	if (title) { title = title.replace('\'', '\\\''); }
	return title;
}

function deleteablePrototype() {
	invalidPrototypes=['ContentFolder','ContentManagementSystem','CMSTagFolder','CMSTaggable']

	for(var i=0;i<invalidPrototypes.length;i++) {
		if(this._prototype==invalidPrototypes[i]) {
			return false;
		}
	}
	return true;

}

var elipseIndex = 50;

function elipsedParentPath() {
	if(this._parent && this._parent.cms_path() && (this._parent.cms_path().length > this.elipseIndex)) {
		return this._parent.cms_path().substring(0, this.elipseIndex) + "...";
	}
	return this._parent.cms_path();
}

function elipsedHref() {
	if(this.getPath().match(/^\/cms/))
		return '';
	if(this.getURI().length > this.elipseIndex) {
		return this.getURI().substring(0,this.elipseIndex) + "...";
	}
	return this.getURI();
}

function ellipsedTitle(){
	var title = this.title;
	if(title && title.length > 75)
		title = title.substring(0,75) + '...';
	return title;
}

function escapedTitle() {
	return escape(this.title);
}

function getSearchablePrototypePairs() {
	var prototype_list = app.getCMSProperties()..prototype;
	var results = [];
	for each(var prototype in prototype_list){
		results.push([prototype.@name, prototype.@displayname]);
	}
	results.sort(function(a,b){ return new java.lang.String(a[1].toString()).compareTo(b[1].toString()); });
	return results;
}

function getSearchablePrototypes() {
	var prototype_list = app.getCMSProperties()..prototype;
	var results = [];
	for each(var prototype in prototype_list){
		results.push(prototype.@name.toString());
	}
	results.sort();
	return results;
}

function getPrettyName() {
	return app.getCMSProperties()..prototype.(@name == this._prototype).@displayname;
}
