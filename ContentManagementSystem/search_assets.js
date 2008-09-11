function typeMap(){
	return {'Document': ['application/excel',
						 'application/msword',
						 'application/mspowerpoint',
						 'application/pdf',
						 'application/rtf',
						 'text/richtext',
						 'text/plain',
						 'application/vnd.sun.xml.writer',
						 'application/vnd.sun.xml.calc',
						 'application/vnd.sun.xml.draw',
						 'application/vnd.sun.xml.impress',
						 'application/vnd.sun.xml.chart',
						 'application/vnd.sun.xml.math',
						 'application/vnd.oasis.opendocument.text',
						 'application/vnd.oasis.opendocument.spreadsheet',
						 'application/vnd.oasis.opendocument.presentation',
						 'application/vnd.oasis.opendocument.spreadsheet-template',
						 'application/vnd.ms-excel'],
			'Video': ['application/x-shockwave-flash',
					  'video/x-flv',
					  'video/x-ms-wmv',
					  'video/quicktime',
					  'video/mpeg'],
			'Audio': ['audio/mpeg',
					  'audio/mpeg3',
					  'audio/x-wav',
					  'audio/x-ms-wma',
					  'audio/wav'],
			'Image': ['image/jpeg',
					  'image/pjpeg',
					  'image/gif',
					  'image/png']
	       };
}

function getContentTypes(type){
	return this.typeMap()[type];
}

function getType(obj){
var typeMap = {'application/vnd.ms-excel': 'Document',
		'application/excel': 'Document',
		'application/msword': 'Document',
		'application/mspowerpoint': 'Document',
		'application/pdf': 'Document',
		'application/rtf': 'Document',
		'text/richtext': 'Document',
		'application/vnd.sun.xml.writer': 'Document',
		'application/vnd.sun.xml.calc': 'Document',
		'application/vnd.sun.xml.draw': 'Document',
		'application/vnd.sun.xml.impress': 'Document',
		'application/vnd.sun.xml.chart ': 'Document',
		'application/vnd.sun.xml.math': 'Document',
		'application/vnd.oasis.opendocument.text': 'Document',
		'application/x-shockwave-flash': 'Video',
		'application/vnd.oasis.opendocument.presentation': 'Document',
		'application/vnd.oasis.opendocument.spreadsheet-template': 'Document',
		'application/zip': 'Document',
		'text/plain': 'Document',
		'video/x-flv': 'Video',
		'video/x-ms-wmv': 'Video',
		'video/quicktime': 'Video',
		'video/mpeg': 'Video',
		'audio/mpeg': 'Audio',
		'audio/mpeg3': 'Audio',
		'audio/x-wav': 'Audio',
		'audio/wav': 'Audio',
		'audio/x-ms-wma': 'Audio',
		'image/jpeg': 'Image',
		'image/pjpeg': 'Image',
		'image/gif': 'Image',
		'image/png': 'Image'
		};
	var type = typeMap[obj.getContentType()];
	return (type||'File');
}

function typecheck(types, obj){
	if(types.match(/all/i))
		return true;
	return (this.getType(obj) == types);
}

function is_assets(){
	return (req.action == "assets");
}

function search_assets(){
	var keywords = req.get("keywords");
	var types = req.get("types");
	var sort = req.get("sort");
	var batch_size = parseInt(req.get("batch_size"));
	var page_num = parseInt(req.get('page_num')||"1");
	var start_idx = (page_num-1)*batch_size;
	var query_tags = app.getObjects("CMSTag", {});
	var objects = [];
	var highlight = [];
	var contentTypeProp = app.getProperty('propertyFilesIgnoreCase') == 'true' ? '_contenttype' : '_contentType';
	var object_types = [];
	if(types.match(/All|Image/i))
		object_types.push('Image');
	if(types.match(/All|Video|Audio|Document|Other/i))
		object_types.push('File');

	// allow user defined prototypes to be searchable
	var cms_props = cmsGlobals.props;
	for each(obj in cms_props..prototype.(@asset_searchable == 'true')){
		if(obj.@content_type){
			var typematcher = new RegExp('All|'+ obj.@content_type.toString().split(',').join('|'), 'i');
			if(types.match(typematcher)){
				   object_types.push(obj.@name.toString());
			}
		}
	}

	// grab for application defined hooks
	var context = (req.data.context || 'assetManager');

	var sort_params = {};
	if(sort && sort == "type")
		sort_params[contentTypeProp] = 'asc';
	else
		sort_params['cms_sortabletitle'] = 'asc';
	var sort_obj = new Sort(sort_params);

	var total = 0;
	var hits;
	if((!keywords || keywords.replace(/^\s+/, '').replace(/\s+$/, '') == '') && types.match(/all/i)){
		var filter = '(cms_status:a OR cms_status:z) NOT _rendered: true';
		if(typeof this.cmsCustomQueryFilter == "function")
			filter = new AndFilter(filter, this.cmsCustomQueryFilter(context));
		hits = app.getHits(object_types, filter, {sort: sort_obj});
	} else{
		var q = this.parseKeywordSearch(keywords);
		var typefilter;
		if(types && !types.match(/all|other/i)){
			var contentTypes = this.getContentTypes(types);
			var subq = [];
			for(var i in contentTypes)
				subq.push(contentTypeProp + ': '+contentTypes[i]);
			typefilter = '('+subq.join(' OR ')+')';
		} else if(types == "Other"){
			var subq = (q.queries.length == 0)?['_prototype: File']:[];
			for each(var category in this.typeMap()){
				for each(var mimetype in category){
					subq.push('NOT ' + contentTypeProp + ': '+mimetype);
				}
			}
			typefilter = '('+subq.join(' ')+')';
		}
		q.queries = q.queries.join(' OR ');
		var final_query = '';
		if(typefilter)
			final_query += typefilter;
		if(typefilter && q.queries)
			final_query += ' AND ';
		if(q.queries)
			final_query += '('+q.queries+') AND ';
		else if(typefilter)
            final_query += ' AND ';
		final_query += '(cms_status: z OR cms_status: a) NOT _rendered: true';

		var final_filter = new NativeFilter(final_query, 'WhitespaceAnalyzer');
		if(typeof this.cmsCustomQueryFilter == "function")
			final_filter = new AndFilter(final_filter, this.cmsCustomQueryFilter(context));

		hits = app.getHits(object_types, final_filter, {sort: sort_obj});
		highlight = q.highlight;
	}

	total = hits.total;
	while(total < start_idx){
		start_idx -= batch_size;
		page_num--;
	}
	objects = hits.objects(start_idx, batch_size);

	var len = objects.length;
	var results = [];
	for(var i=0; i< len; i++){
		var asset = objects[i];
		var filesize = asset.getFileSize();

		// workaround for Rhino's goofy serialization of references
		var highlight_copy = [];
		for each(var obj in highlight){
			highlight_copy.push(obj);
		}

		results.push({id: asset.id,
					  title: (asset.title || ''),
					  filename: asset.getFileName(),
					  thumb_on: asset.thumb_on(),
					  thumb_off: asset.thumb_off(),
					  preview: asset.preview_href(),
					  width: ((asset._prototype == "Image")?asset.getWidth():0),
					  height: ((asset._prototype == "Image")?asset.getHeight():0),
					  filesize: parseInt((filesize > 0)?Math.ceil(filesize/1024):0),
					  path: asset.getURI()+'/',
					  allTags: asset.ajax_tag_list(),
					  searchTags: highlight_copy,
					  hopobjHref: asset.getURI()+'/',
					  rootHref: root.getURI(),
					  altText: (asset.alt||''),
					  contentType: asset.getContentType()});
	}
	return {total: total, current: (page_num || 1), objs: results};
}
