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

var profile = {
	init: function(){
		dojo.require('dojo.json');
		
		// Wire up password meter for this page
		var form = dojo.byId('edit');
		createStrengthMeter(form.password, form.password.previousSibling);
	},
	submit: function(href) {
		var form = dojo.byId('edit');
		if(!form.first_name || !form.last_name) {
			axiom.openModal({content: 'Please provide a first and last name.'});
		} else if(!form.email.value || !form.email.value.match(/^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/)) {
			axiom.openModal({content: 'Please provide a valid email address.'});
		} else if(!form.password.value && form.password.value != form.verifypassword.value) {
			axiom.openModal({content: 'The passwords specified do not match.'});
		} else if(form.password.value && !form.password.value.match(/[\w\s]{5,10}/)) {
			axiom.openModal({content: 'Please verify that your password is 5-10 characters before proceeding.'});
		} else {
			axiom.submitEdit({
				edit_url:href,
				obj_id: null,
				callback:this.getSubmitResponse
			});
		}
	},
	getSubmitResponse: function() {
		dojo.byId('Messages').setAttribute('style', 'display:block;');
		dojo.byId('Messages').innerHTML = 'Profile Saved';
		dojo.byId('cancel').innerHTML = 'OK';
	},
	cancel: function() {
		window.close();
	}
}
dojo.addOnLoad(profile.init);