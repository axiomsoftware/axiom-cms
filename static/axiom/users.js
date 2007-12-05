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
							  callback: callback});
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
		edit.setUrl(href);
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