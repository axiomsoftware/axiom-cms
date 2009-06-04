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


dojo.provide("axiom.widget.HelpSearch");

dojo.require("dojo.lang.common");
dojo.require("dojo.lfx.*");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
    "axiom.widget.HelpSearch",
    dojo.widget.HtmlWidget,
    function(){},
    {
	kb_url: 'http://kb.axiomcms.com/',
	searched_once: false,
	toggle_search: false,
	search_element: null,
	templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/HelpSearch.html'),
	templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/HelpSearch.css'),
	hide_search: function() {
	    this.help_search.style.display = 'none';
	    this.toggle_search = false;
	},
	show_search: function() {
	    this.help_search.style.display = 'block';
	    this.toggle_search = true;
	    if (!this.searched_once) {
		this.fire_top_searches();
	    }
	},
	click_handler: function(e) {
	    e.preventDefault();
	    if (!(this.toggle_search)) {
		this.show_search();
	    } else {
		this.hide_search();
	    }
	},
	search_kb: function(url) {
	    var self = this;
	    dojo.io.bind(
		{
		    url: url,
		    method: 'get',
		    contentType: 'text/json',
		    mimetype: 'text/json',
		    load: function(type, data, evt) {
			self.apply_data(data.results || data, false);
		    }
		}
	    );
	},
	fire_top_searches: function() {
	    this.search_kb(axiom.cmsPath + 'popularQueriesKnowledgeBase');
	},
	fire_helpsearch: function(e) {
	    e.preventDefault();
	    this.search_kb(axiom.cmsPath + 'searchKnowledgeBase'+((this.search_input != '')?'?s='+this.search_input.value:''));

	    this.searched_once = true;
	},
	apply_data: function(arr, are_queries) {
	    var len = arr.length;
	    for (var i = 0; i < len; i++) {
		var query = arr[i];
		var a = document.createElement('a');
		var url = this.kb_url + ((this.kb_url.lastIndexOf('/') == (this.kb_url.length))?'':'/') + 'search?s='+query;
		if (!are_queries) {
		    url = this.kb_url + query.href;
		}
		a.setAttribute('href', url);
		a.appendChild(document.createTextNode((are_queries)?query:query.title));
		a.setAttribute('target', '_blank');
		var li = document.createElement('li');
		li.appendChild(a);
		this.help_search_results.appendChild(li);
		this.help_search_results.style.display = 'block';
	    }
	},
	postCreate:function() {
	    /* Setup Widget*/
	    var position = dojo.html.getAbsolutePosition(this.search_element);
	    dojo.html.placeOnScreen(this.help_search, position.x-175, position.y+15, 0, false, null, false);
	    //this.hide_search();

	    dojo.event.connect(
		{
		    srcObj: this.search_element,
		    srcFunc: 'onclick',
		    adviceObj: this,
		    adviceFunc: 'click_handler'
		}
	    );

	    dojo.event.connect(
		{
		    srcObj: this.search_input,
		    srcFunc: 'onkeypress',
		    adviceObj: this,
		    adviceFunc: function(evt) {
			if (evt)
			    this.fire_helpsearch();
		    }
		}
	    );
	}

    }
);
