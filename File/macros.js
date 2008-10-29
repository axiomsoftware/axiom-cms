function replace(){
	for each(var child in this.getChildren()){
		this.remove(child);
	}
	var cms = root.get('cms');
	var mimepart = req.get('replacement');
	mimepart.setContentType(cms.guessContentType(cms.getBaseName(mimepart.getName())) || mimepart.getContentType());
	this.replaceFile(mimepart);
	var clean_name = this.getFileName().replace(/\s+/g,'_');
	if(this.id != clean_name)
		this.id = cms.uniqueId(clean_name);
	if(this instanceof Image)
		this.add_cms_thumbnails();
	return this.getURI();
}

function getPreviewStyle(){
	return this._prototype == Image ? "width: 200px": null;
}

function getFileSizeKB(){
	var size = this.getFileSize();
	return Math.ceil((size > 0)?size/1024:0)+'KB';
}

function typeString(){
	return root.get('cms').getType(this);
}

function is_inline(){
	if(req.action == "cms_edit"){
		return false;
	}
	return true;
}

function ellipsedFileName(){
	var name = this.getFileName();
	return name.length > 30? name.substring(0, 30)+'...' : name;
}

function generateContent(){
	return [(this.title||''),
			(this.getFileName()||''),
			(this.getContent()||'')].join(' ');
}

function generateSearchableContent(){
	return (this.tag||'')+' '+this.generateContent();
}

function generateAlt(){
	return (this.alt || this.title);
}

function thumb_on(){
	if(this._prototype == "Image"){
		return this.getURI('thumb');
	}
	var icon = this.iconsTable()[this.getContentType()];
	if(!icon)
		icon = this.iconsTable()['default'].on;
	else
		icon = icon.on;
	return app.getStaticMountpoint()+ '/axiom/images/'+ icon;
}

function thumb_off(){
	if(this._prototype == "Image"){
		return this.thumb_on();
	}
	var icon = this.iconsTable()[this.getContentType()];
	if(!icon)
		icon = this.iconsTable()['default'].off;
	else
		icon = icon.off;
	return app.getStaticMountpoint()+'/axiom/images/'+ icon;
}

function preview_href(){
	if(this._prototype == "Image"){
		return this.getURI('preview');
	}
	else{
		var table = this.iconsTable();
		var content_type = this.getContentType();
		return app.getStaticMountpoint() +'/axiom/images/' + (table[content_type]?table[content_type].on:table['default'].on);
	}
}

function iconsTable(){

	return {'application/vnd.ms-excel':      {on: 'xls_on.gif', off: 'xls_off.gif'},
			'application/excel':             {on: 'xls_on.gif', off: 'xls_off.gif'},
			'application/msword':            {on: 'doc_on.gif', off: 'doc_off.gif'},
			'application/mspowerpoint':      {on: 'ppt_on.gif', off: 'ppt_off.gif'},
			'application/pdf':               {on: 'pdf_on.gif', off: 'pdf_off.gif'},
			'application/x-shockwave-flash': {on: 'swf_on.gif', off: 'swf_off.gif'},
			'application/zip':               {on: 'zip_on.gif', off: 'zip_off.gif'},
			'application/x-zip':             {on: 'zip_on.gif', off: 'zip_off.gif'},
			'application/vnd.oasis.opendocument.text': {on: 'odt_on.gif', off: 'odt_off.gif'},
			'application/vnd.oasis.opendocument.presentation': {on: 'odp_on.gif', off: 'odp_off.gif'},
			'application/vnd.oasis.opendocument.spreadsheet': {on: 'ods_on.gif', off: 'ods_off.gif'},
			'application/vnd.oasis.opendocument.spreadsheet-template': {on: 'ods_on.gif', off: 'ods_off.gif'},
			'audio/mpeg3':                   {on: 'mp3_on.gif', off: 'mp3_off.gif'},
			'audio/mpeg':                    {on: 'mp3_on.gif', off: 'mp3_off.gif'},
			'audio/x-wav':                   {on: 'mp3_on.gif', off: 'mp3_off.gif'},
			'audio/wav':                     {on: 'mp3_on.gif', off: 'mp3_off.gif'},
			'video/mpeg':                    {on: 'mov_on.gif', off: 'mov_off.gif'},
			'video/quicktime':               {on: 'mov_on.gif', off: 'mov_off.gif'},
			'video/x-ms-wmv':                {on: 'mov_on.gif', off: 'mov_off.gif'},
			'text/plain':                    {on: 'text_on.gif', off: 'text_off.gif'},
			'text/richtext':                 {on: 'rtf_on.gif', off: 'rtf_off.gif'},
			'text/rtf':                      {on: 'rtf_on.gif', off: 'rtf_off.gif'},
			'application/rtf':               {on: 'rtf_on.gif', off: 'rtf_off.gif'},
			'default':                       {on: 'default_on.gif', off: 'default_on.gif'}
	       };

}

function getAssetObject(){
	var filesize = this.getFileSize();
	return ['{id: "'+this.id+'"',
			'title: "'+this.title+'"',
			'filename: "'+this.getFileName()+'"',
			'thumb_on: "'+this.thumb_on()+'"',
			'thumb_off: "'+this.thumb_off()+'"',
			'preview: "'+this.preview_href()+'"',
			'width: '+((this._prototype == "Image")?this.getWidth():0),
			'height: '+((this._prototype == "Image")?this.getHeight():0),
			'filesize: "'+parseInt((filesize > 0)?Math.ceil(filesize/1024):0)+'"',
			'allTags: "'+this.ajax_tag_list()+'"',
			'hopobjHref: "'+this.getURI()+'"',
			'rootHref: "'+root.getURI()+'"',
			'path: "'+ this.getURI()+ '"}'].join(',');

}

