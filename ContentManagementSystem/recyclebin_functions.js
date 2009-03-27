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


function restore_objects(data){
	data = data || req.data;
	var msgs = [];
	var filter = new OrFilter([new Filter(f) for each(f in data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
		var item = bag.getChildren()[0];
		var new_location = bag.oldlocation.replace(/\/[^\/]+$/, '');
		var errors = item.save({_location: new_location});
		var restore = function(obj){
			bag._parent.remove(bag);
			obj.publishToLive();
		};
		if(!errors){
			restore(item);
		} else {
			// try readable probably-unique location
			errors = item.save({_location: new_location+'_restored'});
			var new_location_msg = 'Object "'+item.title+'" could not be restored to its original'
												+ ' location because another object is '
												+ 'currently located there.  It has been restored to ';
			if(!errors){
				msgs.push(new_location_msg+new_location+'_restored instead.');
				restore(item);
			} else {
				// try guaranteed unique path
				var time = (new Date()).getTime();
				errors = item.save({_location: new_location+'_'+time});
				if(!errors){
					msgs.push(new_location_msg+new_location+'_'+time+' instead.');
					restore(item);
				} else{
				    app.log('RecycleBin Restore Exception: Object Title="'+item.title+'": Server Message="'+errors.toSource()+'"');
					msgs.push('The server encounted an internal error while trying to restore object "'+item.title+'". Please contact a CMS Administrator for help.');
				}
			}
		}
	}
	return msgs.length ? msgs.join("<br/>") : "Objects restored.";
}

function purge_recycled_objects(){
	var filter = new OrFilter([new Filter(f) for each(f in req.data.objects)]);
	for each(bag in app.getObjects("CMSTrashBag", filter)){
			bag.del();
	}
}
