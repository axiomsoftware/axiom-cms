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
 Copyright Axiom
 Nicholas Campbell
 */

dojo.provide("axiom.widget.Info");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
    "axiom.widget.Info",
    dojo.widget.HtmlWidget,
    function(){},
    {
	id: '',
	is_on: false,
	templatePath: null,
	turnOn: function(el) {
	    el.style.display = 'block';
	    this.is_on = true;
	},
	turnOff: function(el) {
	    el.style.display = 'none';
	    this.is_on = false;
	},
	toggleInfo: function() {
	    var el = dojo.byId(this.id);
	    if (this.is_on) {
		this.turnOff(el);
	    } else {
		this.turnOn(el);
	    }
	}
    }
);
