function add_cms_thumbnails(){
	this.addThumbnail(this.render({maxWidth: 100, maxHeight: 100}), 'thumb');
	this.addThumbnail(this.render({maxWidth: 250, maxHeight: 250}), 'preview');
}