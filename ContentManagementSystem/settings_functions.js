function upload_seo_files(){

	var replace = function(name, mimepart){
		if(mimepart){
 			var existing = root.get(name);
			if(existing){
				root.remove(existing);
			}
			var file = new File(mimepart);
			file.id = name;
			root.add(file);
		}
	};
	replace('robots.txt', req.data.robots);
	replace('sitemap.xml', req.data.sitemap);
	replace('favicon.ico', req.data.favicon);

}