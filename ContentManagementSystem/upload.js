function upload(){
	var x = req.data.http_browser;
	var cms = root.get('cms');
	var file = req.get('file');

	// Used by Uploader in AssetSelect widget
	var assetselect = req.get('assetselect');
	var assetid = req.get('assetid');
	
	if(file){
		// browsers can sometimes make some pretty goofy guesses at content-type.  let's guess first based on the extension
		file.setContentType(this.guessContentType(this.getBaseName(file.getName())) || file.getContentType());
		
		var f;
		var fhits = app.getHits("CMSFileFolder", "_d:1");
		var ff = fhits.objects(0,1)[0];

		if(file.getContentType().match(/^image/)){
			f = new Image(file);
		}
		else if(file.getName().match(/\.zip$/) && !req.get('nounzip')){
			var zip_name = file.getName();
			var f = axiom.Zip.extractData(file.getContent());
			var files_to_edit = [];
			for(var i in f.toc){
				var item = f.toc[i];
				try{
					var content_type = this.guessContentType(this.getBaseName(item.name)); 
					if(!content_type)
						content_type = 'application/octect-stream';
					var mimepart = new Packages.axiom.util.MimePart(this.getBaseName(item.name), item.data, content_type);
					var hop_object_file;
					if(content_type.match(/^image/)){
						hop_object_file = new Image(mimepart);
					} else {
						hop_object_file = new File(mimepart);
					}
					hop_object_file.id = this.uniqueId(item.name, true); 
					hop_object_file.setStatus('null');

					root.get(ff.id).add(hop_object_file);
					if(hop_object_file instanceof Image){
						hop_object_file.add_cms_thumbnails();
					}
					// if-cms-version-enterprise
					hop_object_file.publishToLive();
					// end-cms-if

					files_to_edit.push(hop_object_file);
				}
				catch(e){
					app.log(e.toString());
				}
			}
			return this.batch_edit({files: files_to_edit,
									zip_name: zip_name,
									num_files: files_to_edit.length,
									hide_left_nav: true,
									kludge_textareas: true,
									title_class: "upload"});
		}
		else {
			f = new File(file);
		}
		if(ff.add(f)){
			if(f instanceof Image){
				f.add_cms_thumbnails();
			}
			f.id = this.uniqueId(file.getName(), true); 
			f.setStatus('null');
			req.data.add = true;
			// if-cms-version-enterprise
			f.publishToLive();
			// end-cms-if
			if(assetselect) { return f.assetselect_edit({'asset_id':assetid}); }
			else { return f.asset_edit({add:true}); }
		} else { // uh-oh
			res.status = 500;
			return "Unable to attach file to filefolder.";
		}
		
	}
}

function getBaseName(name){
	return name.match(/[^\\\/]*$/)[0];
}

function guessContentType(name){
	var extension = name.match(/\.([^\.]*)$/);
	if(!extension)
		return null;
	extension = extension[1];
	var content_types = {
		'xls': 'application/excel',
		'xlt': 'application/excel',
		'doc': 'application/msword',
		'psd': 'application/photoshop',
		'ppt': 'application/mspowerpoint',
		'pot': 'application/mspowerpoint',
		'pdf': 'application/pdf',
		'rtf': 'application/rtf',
		'odt': 'application/vnd.oasis.opendocument.text',
		'odp': 'application/vnd.oasis.opendocument.presentation',
		'ods': 'application/vnd.oasis.opendocument.spreadsheet',
		'swx': 'application/vnd.sun.xml.writer',
		'sxc': 'application/vnd.sun.xml.calc',
		'sxd': 'application/vnd.sun.xml.draw',
		'sxi': 'application/vnd.sun.xml.impress',
		'sxh': 'application/vnd.sun.xml.chart ',
		'sxm': 'application/vnd.sun.xml.math',
		'swf': 'application/x-shockwave-flash',
		'flv': 'video/x-flv',
		'wmv': 'video/x-ms-wmv',
		'mov': 'video/quicktime',
		'mpeg': 'video/mpeg',
		'mp3':	'audio/mpeg3',
		'wav': 'audio/x-wav',
		'wma': 'audio/x-ms-wma',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'gif': 'image/gif',
		'png': 'image/png',
		'zip': 'application/zip'
	}
	return content_types[extension.toLowerCase()];
}

function uniqueId(name, is_path){
	if(is_path)
		name = this.getBaseName(name);
	name = name.replace(/\s/g, '_').replace(/[^\w\_\-\+\.]/g, '');
	var hits = app.getHits(["File", "Image"], new NativeFilter('id: '+ name, 'WhitespaceAnalyzer'), {maxlength: 1});
	var i = 1;
	var unique_name = name;
	while(hits.total > 0){
		var pieces = name.split(/\./);
		unique_name = [pieces[0], '_', i, '.', pieces[1]].join('');
		i++;
		hits = app.getHits(["File", "Image"], new NativeFilter('id: '+unique_name, 'WhitespaceAnalyzer'), {maxlength: 1});
	}
	return unique_name;
}


