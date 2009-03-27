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


function edit_taggable(data){
	var tagCache = {};
	data = (data || req.data);
	for(var id in data){
		if(!id.match(/^http/) && id != ''){
			var args = data[id];
			var obj = app.getObjects(['File', 'Image'], {id: id})[0];
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
			if(args.ax_id && obj.setFileName){
				obj.setFileName(args.ax_id);
			}
			obj.save(args);
			obj.cms_status = 'z';
		}
	}
}