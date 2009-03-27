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


String.prototype.ampEscape = function(){
	return this.replace(/&(?!(amp|nbsp|gt|lt);)/g, '&amp;');
};

String.prototype.ellipse = function(length) {
	if (this.length > length) {
		var substring = this.substr(0,length);
		var index = substring.lastIndexOf(' ');
		return substring.substr(0,index) + '...';
	}
	return this;
};

function getObj(prototype){
	// hackomatic
	if(prototype == "Image" || prototype == "File"){
		return new this[prototype](app.__app__.getServerDir().getAbsolutePath()+java.io.File.separator+
					   'modules'+java.io.File.separator+'formbuilder'+java.io.File.separator+
					   'Global'+java.io.File.separator+'macros.js');
	}
	return new this[prototype]();
}

for (var i in String)
    String.dontEnum(i);
for (var i in String.prototype)
    String.prototype.dontEnum(i);
