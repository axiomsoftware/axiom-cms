function edit_taggable(data){
	var tagCache = {};
	data = (data || req.data);
	for(var id in data){
		if(!id.match(/^http/) && id != ''){
			var args = data[id];
			var obj = app.getObjects(['File', 'Image'], new NativeFilter('id: '+id, 'WhitespaceAnalyzer'))[0];
			if(!obj){
				app.log("Couldn't edit "+id+" ... not found in db.");
				continue;
			}
			var value = [];
			if(args.tags){
				var tags = args.tags.split(',');
				for(var t in tags){
					var tag = tags[t].replace(/^\s+/g, '').replace(/\s+$/g, '').toLowerCase();
					if(tag != ''){
						var tagObj;
						if(tag in tagCache){
							tagObj = tagCache[tag];
						}
						else{
							tagObj = app.getObjects(['CMSTag'], {title: tag})[0];
							if(!tagObj){
								tagObj = new CMSTag();
								tagObj.title = tag;
								tagObj.id = tagObj.title.toLowerCase().replace(/\W/g,'');
								app.getObjects("CMSTagFolder","_d:1", {maxlength: 1})[0].add(tagObj);
							}
							tagCache[tag] = tagObj;
						}
						value.push(tagObj.getPath());
					}
				}
				value = value.join(',');
				args['tags'] = value;
			}
			obj.save(args);
			// if-cms-version-enterprise
			obj.cms_status = 'z';
			// end-cms-if
		}
	}
}