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


function upload_seo_files(){

	var replace = function(name, mimepart){
		if(mimepart){
 			var existing = root.get(name);
			if(existing){
				root.remove(existing);
			}
			var file = new File(mimepart);
			file.id = name;
			file.cms_status = 'null';
			root.add(file);
		}
	};
	replace('robots.txt', req.data.robots);
	replace('sitemap.xml', req.data.sitemap);
	replace('favicon.ico', req.data.favicon);
}