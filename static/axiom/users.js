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


var users = {
	init: function(){
		dojo.require('dojo.json');
		dojo.require('axiom.widget.UserTable');
		dojo.require('axiom.widget.UserFilter');
		users.ctable = dojo.widget.createWidget("axiom:UserTable",
							{appPath:axiom.appPath,
							 searchURL: 'searchUsers'},
							dojo.byId("UserTable"));

		users.cfilter = dojo.widget.createWidget("axiom:UserFilter",
												 {prototypes:["CMSUser"],
												  appPath:axiom.appPath},
												 dojo.byId("UserFilter"));
		users.cfilter.registerTable(users.ctable);
		users.cfilter.search();
		
		// Wire up password meter for this page
		var form = dojo.byId('add_form');
		var label = form.add_password;
		var safe = 0;
		while(label = label.previousSibling) {	// Move back till we find the label for this element
			if(label.tagName && label.tagName.toLowerCase() == 'label' || safe == 15) {
				if(safe != 15) createStrengthMeter(form.add_password, label);
				break;
			}
			safe++;
		}
	},
	submit: function(href, id, callback){
		var form = dojo.byId('edit');
		if(form.password.value && form.password.value != form.verifypassword.value){
			axiom.openModal({content: 'The passwords specified do not match.'});
		}
		else if(form.password.value && !form.password.value.match(/[\w\s]{5,10}/)){
			axiom.openModal({content: 'Please verify that your password is 5-10 characters before proceeding.'});
		}
		else{
			axiom.submitEdit({edit_url:href,
							  obj_id: id,
							  callback: function(type, data) {
								try{
									data = eval("("+data+")");
								} catch(e) {}
								if(data.errors) {
									axiom.openModal({content: data.errors});
								} else {
									callback();
								}
							  }});
		}
	},
	delete_user: function(href, username){
		axiom.openModal({ content: "Delete user <strong>"+username+"</strong>?",
				  confirmdialog: true,
				  callback: function(){
					  dojo.io.bind({url:href+'/cms_delete',
							load: users.fire_search
						       });

				  }
				});
	},

	load_edit: function(href){
		dojo.widget.getWidgetsByType('UserTable')[0].hide();
		var edit = dojo.widget.byId('EditBody');
		var time = new Date().getTime();
		edit.setUrl(href+'?noCache='+time);
		edit.show();
	},
	load_search: function(){
		dojo.widget.byId('EditBody').hide();
		users.fire_search();
		dojo.widget.getWidgetsByType('UserTable')[0].show();

	},
	fire_search: function(evt){
		var widget = dojo.widget.getWidgetsByType('UserFilter')[0];
		widget.search(evt, "CMSUser", widget.getKeywords());
	},
	clear_add_form: function(){
		var inputs = dojo.byId('add_form').getElementsByTagName('input');
		for(var i in inputs){
			if(inputs[i].type != "button")
				inputs[i].value = '';
		}
		dojo.byId('add_roles').value = '';
	},
	add_user: function(){
		var form = dojo.byId('add_form');
		if(axiom.validateForm('add_form')){
			dojo.io.bind({ url:axiom.appPath+'cms/add_user',
						   load: function(load,data,evt){
							   if(data.errors.length != 0){
								   axiom.openModal({  content: data.errors.join('<br/>')
												   });
							   }
							   else{
								   users.clear_add_form();
								   users.fire_search();
							   }
						   },
						   method: 'post',
						   mimetype: 'text/json',
						   contentType: 'text/json',
						   postContent: dojo.json.serialize({first_name:     form.add_fname.value,
															 last_name:      form.add_lname.value,
															 username:       form.add_username.value,
															 password:       form.add_password.value,
															 email:          form.add_email.value,
															 verifypassword: form.add_verifypassword.value,
															 add_roles:      form.add_roles.value})
						 });
		}
	}
}
dojo.addOnLoad(users.init);