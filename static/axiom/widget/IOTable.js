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


/**
Copyright Siteworx
Dan Pozmanter
*/

dojo.provide("axiom.widget.IOTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.io.*");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.IOTable",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		table:null,
		searchURL:'cms/runSearch',
		searchTemplate:'',
		context: 'default',
		return_hrefs:false,
		getStartFromPage:function(page, size) {
			return page * (size - 1);
		},
		handleResults:function (type, data, req) {
			if (type == 'load') {
				//TODO: use responseText if not an ie browser?
				//this.widget.table.innerHTML = data.toSource();
			} else if (type == 'error') {
				//alert("Error!");
			}
			this.widget.setButtonCursors("pointer");
			document.body.style.cursor = "default";
		},
		setButtonCursors:function (c) {
			dojo.byId('search').style.cursor = c;
			dojo.byId('reset').style.cursor = c;
		},
		getArgObject:function (prototype, keywords, sort, start, length, published_only) {
			var args = { prototype: prototype,
				     keywords: keywords,
				     sort: sort,
				     context: this.context,
				     select_type: this.multiple ? 'checkbox' : 'radio'};
			if (start != -1) { args.start = start; }
			if (length != -1) { args.batch_size = length+""; }
			if (length != -1) { args.length = length+""; }
			if (published_only) { args.published_only = published_only; }
			if (this.searchTemplate != '') { args.template = this.searchTemplate; }
			args.return_hrefs = this.return_hrefs;
			return args;
		},
		setContext:function(context){
			this.context = context;
		},
		postCreate:function(){
			if(this.searchURL == 'cms/runSearch')
				this.searchURL = this.appPath + 'cms/runSearch';
			if(this.ajaxLoader) this.ajaxLoader.src =this.staticPath+'/axiom/images/ajax-loader.gif';
		},
		runSearch:function(prototype, keywords, sort, start, length, published_only) {
			var surl = this.searchURL;
			var args = this.getArgObject(prototype, keywords, sort, start, length, published_only);
			surl = surl.replace(/\/\//g, '/');
			this.tablewrap.style.display = 'none';
			if(this.loading) {
				this.loading.style.display = 'block';
			}
			dojo.io.bind({ url: surl,
						   handle: this.handleResults,
						   preventCache: true,
						   mimetype: "text/javascript",
						   contentType: 'text/json',
						   postContent: dojo.json.serialize(args),
						   error: function(evt, data, type){
							   axiom.openModal({content:"Error connecting to server."});
						   },
						   method: 'post',
						   widget: this
						 });
		}
	}
);
