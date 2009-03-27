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


function getParams() {
    var params = {}, url = document.location.toString();
    q = url.indexOf('?');if(q==-1){return params;}
    url = url.substr(q+1);
    var segs = url.split('&'), pair=[];
    for (var s in segs) {
        pair = segs[s].split('=');
        if (pair.length==2) {params[pair[0]] = pair[1];}
    }
    return params;
}

function editFormSubmit(){
	alert('Validate and Submit');
	document.forms[0].submit();
};

function editFormPreview(){
	alert('Preview');
};
