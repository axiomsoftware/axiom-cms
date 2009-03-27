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


function formbuilder() {
	var data = {};
	data['prototypes'] = root._fb_getPrototypeNames();
	res.write(this.formbuilder_markup(data));
}

function formbuilder_generate() {
	if (req.data.axiomcms != 'true') { return; }
	if (req.data.prototype == "All"){
		this.formbuilder_massgenerate();
	}
	else{
		res.write(req.data.writeoption+": "+req.data.talform+" for "+req.data.prototype+"... ");
		root._fb_generateForm(req.data.prototype, req.data.catalog, req.data.talform + '.tal', req.data.writeoption);
		res.write("Success!");
	}
}

function formbuilder_massgenerate() {
	var form = (req.get('talform')  || "cms_editForm");
	var catalog = (req.get('catalog')  || "test");
	var writeopt = (req.get('writeoption') || "regen");
	var protos = root._fb_getPrototypeNames();
	for (var i = 0; i < protos.length; i++) {
		// XXX: EDIT FOR CMS PROPERTIES FILE USE
		if (protos[i].match('IMIS|Axiom|SWX|Simple|Image|File|CMS|Content|CMSTag|Global|ShoppingCart|FormBuilder|CMSUser|Widget')) { continue; }
		res.write(writeopt+ ": "+form+" for "+protos[i]+"... ");
		try{
			root._fb_generateForm(protos[i], catalog, form + '.tal', writeopt);
		}
		catch(e){
			res.write(e.toString());
		}
		res.write("Success!<br/>");
	}
}