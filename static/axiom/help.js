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

if (!axiom) {
    var axiom = {};
};

axiom.help = {
    search: null,
    init: function() {
	dojo.require('axiom.widget.HelpSearch');
	axiom.help.search = dojo.widget.createWidget('axiom:HelpSearch',
						     {
							 search_element: dojo.byId('cms_help')
						     },
						     dojo.byId('HelpSearch')
						    );
    }
};
dojo.addOnLoad(axiom.help.init);