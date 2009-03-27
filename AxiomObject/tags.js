/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


function getAllTags(){
	var tags = app.getObjects("CMSTag", {});
	var results = [];
	var len = tags.length;
	for(var i=0; i < len; i++){
		results.push({title: tags[i].title,
			      uri: tags[i].getURI(),
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