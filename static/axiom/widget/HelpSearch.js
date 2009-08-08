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
	loading: null,
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
	    this.search_input.focus();
	},
	click_handler: function(e) {
	    e.preventDefault();
	    if (!(this.toggle_search)) {
		dojo.html.addClass(this.search_element.parentNode, 'help_active');
		this.show_search();
	    } else {
		dojo.html.removeClass(this.search_element.parentNode, 'help_active');
		this.hide_search();
	    }
	},
	clear_results: function() {
	    this.help_search_results.innerHTML = "";
	},
	search_kb: function(url, are_queries, header) {
	    this.clear_results();
	    this.help_search_results.appendChild(this.loading);
	    this.help_search_results.style.textAlign = 'center';

	    var self = this;
	    dojo.io.bind(
		{
		    url: url,
		    method: 'get',
		    contentType: 'text/json',
		    mimetype: 'text/json',
		    error: function(type, error) {
			self.clear_results();
			self.help_search_results.appendChild(document.createTextNode('There was a problem with the search, please contact your Administrator.'));
		    },
		    success: function(type, data, evt) {
			self.apply_data((data.results || data), are_queries, header);
		    }
		}
	    );
	},
	fire_top_searches: function() {
	    this.search_kb(axiom.cmsPath + 'popularQueriesKnowledgeBase', null, 'Recent Popular Searches');
	},
	fire_helpsearch: function(e) {
	    e.preventDefault();
	    var query = this.search_input.value;
	    this.search_kb(axiom.cmsPath + 'searchKnowledgeBase'+((this.search_input != '')?'?s='+query:''), query);
	    this.searched_once = true;
	},
	apply_data: function(arr, query, header) {
	    var len = arr.length;
	    var results = null;
	    if (len > 0) {
		results = document.createElement('ul');
		dojo.html.setClass(results, 'results');
		for (var i = 0; i < len; i++) {
		    var q = arr[i];
		    var a = document.createElement('a');
		    var url = this.kb_url + ((this.kb_url.lastIndexOf('/') == (this.kb_url.length))?'':'/') + 'search?s='+q;
		    if (query) {
			url = this.kb_url + q.href;
		    }
		    a.setAttribute('href', url);
		    a.appendChild(document.createTextNode((!query)?q:q.title));
		    a.setAttribute('target', '_blank');
		    var li = document.createElement('li');
		    li.appendChild(a);
		    results.appendChild(li);
		}
		results.style.display = 'block';
	    } else {
		results = document.createElement('p');
		results.appendChild(document.createTextNode('No Results Found'));
	    }

	    this.clear_results();
	    this.help_search_results.style.textAlign = 'left';
	    var h = document.createElement('h3');
	    h.appendChild(document.createTextNode(header || 'Top Results'));
	    this.help_search_results.appendChild(h);
	    this.help_search_results.appendChild(results);
	    if (query && len > 0) {
		var p = document.createElement('p');
		var a = document.createElement('a');
		dojo.html.addClass(a, 'more');
		a.setAttribute('href', this.kb_url+'search?s='+query);
		a.setAttribute('target', '_blank');
		a.appendChild(document.createTextNode('More >'));
		p.appendChild(a);
		this.help_search_results.appendChild(p);
	    }
	},
	postCreate:function() {
	    if (this.search_element) {
		/* Setup Widget*/
		var position = dojo.html.getAbsolutePosition(this.search_element);
		dojo.html.placeOnScreen(this.help_search, position.x-175, position.y+15, 0, false, null, false);

		var img = document.createElement('img');
		img.setAttribute('src', axiom.staticPath + '/axiom/images/ajax-loader.gif');
		this.loading = document.createElement('div');
		var p = document.createElement('p');
		p.appendChild(document.createTextNode('Loading...'));
		this.loading.appendChild(p);
		this.loading.appendChild(img);

		this.close_button.setAttribute('src', axiom.staticPath + '/axiom/images/button_close.gif');

		dojo.event.kwConnect(
		    {
			srcObj: this.search_element,
			srcFunc: 'onclick',
			adviceObj: this,
			adviceFunc: 'click_handler'
		    }
		);

		dojo.event.kwConnect(
		    {
			srcObj: this.search_input,
			srcFunc: 'onkeypress',
			adviceObj: this,
			adviceFunc: function(evt) {
			    if (evt.keyCode == evt.KEY_ENTER)
				this.fire_helpsearch(evt);
			}
		    }
		);

		dojo.event.kwConnect(
		    {
			srcObj: this.help_search,
			srcFunc: 'onkeypress',
			adviceObj: this,
			adviceFunc: function(evt) {
			    if (evt.keyCode == evt.KEY_ESCAPE) {
				this.click_handler(evt);
			    }
			}
		    }
		);
	    }
	}

    }
);
