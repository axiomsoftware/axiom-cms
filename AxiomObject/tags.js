function getAllTags(){
	var tags = app.getObjects("CMSTag", {});
	var results = [];
	var len = tags.length;
	for(var i=0; i < len; i++){
		results.push({title: tags[i].title, 
			      getURI: tags[i].getURI(), 
			      id: tags[i].id, 
			      count: app.getSourceCount(tags[i]),
			      checked: (this.has_tag && this.has_tag(tags[i].title))?'checked':false
			     });
	}
	results.sort(function(asset1, asset2){ if(!asset1.title) return -1;
					       if(!asset2.title) return 1;
					       // localCompare isn't in Rhino 1.5 ...
					       return new java.lang.String(asset1.title).compareTo(new java.lang.String(asset2.title));
					     });

	return results; 
}

function getPartitionedTags(){
	var results = this.getAllTags();
	var midpoint = results.length/2;
	return [results.slice(0,midpoint), results.slice(midpoint, results.length)];
}

function getTagString(){
	if(!this.tags)
		return '';
	var results = [];
	for(var t=0; t< this.tags.length; t++){
	    if (!(this.tags[t] && this.tags[t].getTarget())) { continue; }
		results.push(this.tags[t].getTarget().title);
	}
	return results.join(',');
}