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
 * Tab registration for the CMS.
 *
 * Add application specific tabs to the cms by overriding this stub method.
 * Should return a list of objects with the following properties:
 *       href             -> location of the tab content
 *       title            -> link title
 *       highlight_action -> name of the action upon which this tab should be highlighted
 *       roles            -> array of roles which have access to the tab
 *
 */
function registerTab(tab, index) {
    if (!this.cmsGlobals) {
	this.cmsGlobals = {
	    cmsTabs: []
	};
    } else if (!this.cmsGlobals.cmsTabs) {
	this.cmsGlobals.cmsTabs = [];
    }

    cmsGlobals.cmsTabs.insert(tab, index);
}

function unregisterTabByTitle(title) {
    if (!this.cmsGlobals) {
	this.cmsGlobals = {
	    cmsTabs: []
	};
    } else if (!this.cmsGlobals.cmsTabs) {
	this.cmsGlobals.cmsTabs = [];
    }

    var tabs = cmsGlobals.cmsTabs;
    var index = 0;

    for (var p in tabs) {
	var tab = tabs[p];
	if (tab.title == title) {
	    tabs.remove(index);
	}
	index++;
    }
}