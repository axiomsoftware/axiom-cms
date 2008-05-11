function getNumberOfPages(start, length, total) {
    var pages = 0;
    if (total!=0) {
        pages = total/length;
        if (total%length!=0) { pages++; }
    }
    return Math.floor(pages);
}
function getPageNumber(start, length, numhits, total) {
    var page=0;
    if (total!=0) {
        if (numhits < length) { page = 1; }
        else {
            page = ((start+1)/length);
            if((start+1)%length!=0) { page++; }
        }
    }
    return Math.floor(page);
}

/** Parses a user-entered query string, searching the entered field (defaults to 'searchable_content'
 * Returns: { queries: [an array of Lucene query strings], 
 *            highlight: [an array of entered terms for highlighting search results] }
 */
function parseKeywordSearch(keywords, search_field){
	var query = [];
	var highlight = [];
	var field = (search_field || 'searchable_content');

	// look for field prefixes
	var prefixes = ['content', 'tag', 'search_roles'];
	for each(var prefix in prefixes){
		var re = new RegExp("\\b"+prefix+":(\"[^\"]+\"|\\w+)", 'g');
		var matches = (keywords.match(re) || []);
		for(var i in matches)
			if(matches[i]){
				query.push(matches[i]);
				highlight.push( (matches[i].split(/tag:|content:/)[1]||'').replace(/^\"|\"$/g, ''));
			}
		keywords = keywords.replace(re, '');
	}

	// look for exact matches
	var exact_regex = /\"([^\"]+)\"/g;
	matches = keywords.match(exact_regex);
	for(var i in matches)
		query.push(field+': '+matches[i]);
	keywords = keywords.replace(exact_regex, '');
	
	// any remaining terms are stemmed (e.g. "chew" matches "chewbacca" as well)
	var stem_terms = keywords.split(/\s+/);
	for(var i in stem_terms){
		stem_terms[i] = stem_terms[i].replace(/^\*|\*$/, ''); 
		if(stem_terms[i] != ''){
			query.push(field+': '+stem_terms[i]+'*');
			highlight.push(stem_terms[i]);
		}
	}
	
	// escape reserved characters
	for(q in query)
		query[q] = query[q].replace(/([+\-&!(){}\[\]\'|^~\?])/g, "\\$1").replace('""', ''); 
	
	return {queries: query,
		highlight: highlight};
}

function searchUsers(keywords){
	var prototype = req.data.prototype || ["CMSUser"];
	var keywords = req.data.keywords || '';
	var sort = req.data.sort || false;
	if(!sort || sort.toSource() == '({})'){
		sort = {'cms_lastmodified':'desc'};
	}
	sort = new Sort(sort);
	
	var start = parseInt(req.data.start) || 0;
	var length = parseInt(req.data.length) || 15;
	app.log('start: '+start);
	app.log('length: '+length);
	var query = this.parseKeywordSearch(keywords).queries.join(' AND ');
	var hits = app.getHits(prototype, (query || '_d: 1'), {sort: sort}); 
    var results = hits.objects(start, length);
	this.writeResults(this.extractUser, hits, results, start, length);
}

function runSearch(custom_query) {
	var prototype = req.data.prototype || this.getSearchablePrototypes();
	var keywords = req.data.keywords || '';
	var sort = req.data.sort || false;
	if(!sort || sort.toSource() == '({})'){
		sort = {'cms_lastmodified':'desc'}
	}
	sort = new Sort(sort);
	
	var start = req.data.start || 0;
	var length = parseInt(req.data.length) || 15;
	var published_only = req.data.published_only || false;
	var return_href = req.data.return_hrefs || false;
	var context = req.data.context || 'default';
	var hits = this.search(prototype,keywords,sort,start,length,published_only,context);
	results = hits.objects(start, length);
	this.writeResults(this.extractContent,hits,results,start,length,sort,return_href);
}

function extractContent(result){
	var task = result._task ? result._task.getTarget() : null;
	var locked = task ? task.status.match(/incomplete|rejected|pending|scheduled/i): false;
	var cms = root.get('cms'); // scoping fun
	return {id: result.id,
			_id: result._id,
			path: result.getPath(),
			href: result.getURI(),
			title: result.title,
			task: task ? cms.extractTask(task) : null,
			addable: result.addable(),
			editable: result.task_editable(), 
			locked: locked,
			deletable: (!locked && result.deleteable()),
			created: result.cms_createdby,
			lastmodified: result.cms_lasteditedby,
			contenttype: result.getPrettyName().toString()};
}

function extractTask(task){
	return {task_id: task.task_id,
			name: task.name,
			description: task.description,
			status: task.status,
			cms_createdby: task.cms_createdby};
}

function extractUser(user){
	return {'_id':      user._id,
		    username:   user.username,
			first_name: user.first_name,
			last_name:  user.last_name,
			role:       user.roles[0],
			email:      user.email,
			// if-cms-version-enterprise
			deletable:  (root.get('cms').my_open_tasks(user).length === 0),
			// end-cms-if
			// if-cms-version-workgroup|standard
			deletable:  true,
			// end-cms-if
			edit_url:   user.getURI('user_edit')};
}

function search(prototype,keywords,sort,start,length,published_only,context) {
	var status_filter = published_only?'_status: z*':'_status: z* OR _status: a*'; 
	var filter;
	if(keywords.length != 0){
		filter = this.parseKeywordSearch(keywords, 'cms_searchable_content').queries.join(' OR ');
		filter = '('+filter+') AND ( '+status_filter+' )';
	}
	else{
		filter = status_filter; 
	}

	if(typeof this.cmsCustomQueryFilter == "function"){
		filter = new AndFilter(filter, this.cmsCustomQueryFilter(context));
	}

	var prototypes = [];
	if (prototype.length!=0) { prototypes = [prototype]; }
	return app.getHits(prototype,filter,{sort: sort});
}

function writeResults(extract_func,hits,results,start,length,sort,return_href) {
	var page = this.getPageNumber(start, length, hits.length, hits.total);
	var pages = this.getNumberOfPages(start, length, hits.total);


	var result_data = results.map(extract_func);
	
	var data = {staticPath: root.getURI()+'static',
			results: result_data,
			showlen: (hits.length > 15),
			return_href: return_href,
			start: start,
			length: length,
			number: hits.length,
			total: hits.total,
			pagination: (pages > 1),
			backenabled: (page > 1),
			nextenabled: (page < pages),
			page: page,
			pages: pages,
			show15: (length==15),
			show25: (length==25),
			show50: (length==50)}
	if(sort){
		var sort_field = '';
		for(var k in sort){ sort_field = k; break;} // extract first sort key
		data[sort_field]=true;
		data['sort_dir']=sort[sort_field];
	}
	res.setContentType('text/json');
	res.write(data);
}



