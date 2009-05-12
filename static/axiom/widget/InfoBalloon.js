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

dojo.provide("axiom.widget.InfoBalloon");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.io.*");
dojo.require("dojo.io.IframeIO");

dojo.widget.defineWidget(
    "axiom.widget.InfoBalloon",
    axiom.widget.HtmlWidget,
    function(){},
    {
	element: null,
	is_on: false,
	templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AnalyticsSettings.html'),
	on: function() {
	    this.element.style.display = "block";
	},
	off: function() {
	    this.element.style.display = "none";
	},
	toggle: function() {
	    if (this.is_on) {
		this.off();
	    } else {
		this.on();
	    }
	},
	postCreate: function(){
	}
    }
);
