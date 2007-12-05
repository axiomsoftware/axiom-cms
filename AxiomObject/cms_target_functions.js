function jsonFromResults(results) {
	if (results==null) { return '[]'; }
	var o=null;
	var last = results.length-1;
	var json = '';
	var title = '';
	for (var i=0;i<results.length;i++) {
		o=results[i];
		if (o) {
			title = o.title;
			if (title) { title = title.replace(/\"/g,'\\"'); }
			json += '["'+title+'","'+o.getPath()+'"]';
			if(i!=last) { json += ','; }
		}
	}
	return '['+json+']';
}

/**  potentialTargets
 *  url-callable method, writes to the response a ContentTable containing a list 
 *  of the objects that can be referenced via this property. 
 */
function potentialTargets() {    
	var prototype = (req.data.prototype || '');
	var keywords = (req.data.keywords || '');
	var field = (req.data.sort_field || 'cms_lastmodified');
	var direction = (req.data.sort_direction || 'asc');
	var property = (req.data.property || '');
	//var template = (req.data.template || 'ObjectSelectTable');
	var start = (parseInt(req.data.start) || 0);
	var cms = root.get('cms');

	var schema = this.getSchema();
	//app.log(schema.toSource());
	var prop = schema[property];
	var path = (prop && prop.targetchildren && prop.targetchildren.value == 'true')?(this.getURI()+'*'):undefined;
	var types = (prop && prop.targetTypes) ? eval(this.getSchema()[property].targetTypes.value) : null;

	var cms_searchable_types = cms.getSearchablePrototypes();
	var qmethod = path?'getObjects':'getHits';

	if (property == '_location') { types = cms_searchable_types; }
	if (prototype) { types = prototype.split(','); } //search overrides targetTypes
	if (!types) { types = cms_searchable_types; }
	
	var sort = {};
	if(field){
		sort[field] = direction;
	}
	
	var filter = "_d: 1 AND (_status: z OR _status: a) NOT _id: "+this._id; 
	if (keywords) {
		filter = cms.parseKeywordSearch(keywords, 'cms_searchable_content').queries.concat(['NOT _id:'+this._id]).join(' OR ');
	}

	// application hook
	if(typeof cms.cmsCustomQueryFilter == 'function'){  
		filter = new AndFilter(filter, cms.cmsCustomQueryFilter('referenceWidget'));
	}
	var args = [types, filter, sort];
	if(path){ args.push(path); }
	var hits = app[qmethod].apply(app, args);
    
    var length = 15;
    var req_len = req.get('length');
    if (req_len && !isNaN(req_len)) {
		length = parseInt(req_len, 10);
    } else if (req_len && req_len == "MAX_HITS") {
		length = hits.length;
    }

	if (req.data.json) {
		if (hits instanceof Hits) {
			hits = hits.objects(start, length);
		}
		res.setContentType('text/javascript');
		res.write(this.jsonFromResults(hits));
		return;
	}
	var results = (qmethod == 'getHits')?hits.objects(start, length):hits.slice(start, length);
	cms.writeResults(cms.extractContent, hits, results, start, length, field, req.data.return_hrefs);
}

function _hashFromtt(targets) {
    var list = eval(targets);
    return '{'+this._getPrototypesHash(targets)+'}';
}

function cms_targetTypesJSON(path, property) {
	var obj = root.get(path);
	if (!obj) { return this.cms_getPrototypesHash(); }
	var targets = obj.getTypePropertyValue(property+'.targetTypes');
	if (!targets) { return this.cms_getPrototypesHash(); }
	return this._hashFromtt(targets);
}

function targetTypesJSON(property) {
	return this.zipListToJSON(this.getSchema()[property].targetTypes);
}

function parentTypesJSON(property){
	return this.zipListToJSON(app.getPrototype(this._prototype).getTypeProperties().getProperty('_parenttypes'));
}

function zipListToJSON(targets){
	var pairs = this.cms_getPrototypesHash();
	if (!targets) { return pairs; }
	pairs = eval('('+pairs+')');
	var list = eval(targets.value || targets);
	var results = {'All' : []};
	for each(var prototype in list){
		results[prototype] = pairs[prototype];
		results['All'].push(prototype);
	}
	return results.toSource();
}
