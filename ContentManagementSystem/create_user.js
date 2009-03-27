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


function add_user(){

	var first_name = req.data.first_name;
	var last_name = req.data.last_name;
	var username = req.data.username;
	var password = req.data.password;
	var email = req.data.email;
	var verifypassword = req.data.verifypassword;
	var add_roles = req.data.add_roles;
	var in_use = app.getObjects("CMSUser", "username: "+username, {maxlength: 1})[0];
	var errors = [];

	if(in_use){ errors.push('The Username you selected is already in use. Please select another username.');}
	if(!first_name){ errors.push('Please specify a First Name before proceeding.');}
	if(!last_name){ errors.push('Please specify a Last Name before proceeding.');}
	if(!username){ errors.push('Please specify a username before proceeding.');}
	if(!password){ errors.push('Please select a password before proceeding.');}
	if(!email || !email.match(/\S+@\S+\.\S/)){ errors.push('Please enter a valid email address before proceeding.');}
	if(!verifypassword || password != verifypassword){ errors.push('The specified passwords do not match.'); }
	if(!password.match(/[\w\d]{5,10}/)){ errors.push('Please verify that your password is 5-10 characters before proceeding.');}
	if(!add_roles){ errors.push('Please select a Role before proceeding.');}

	if(errors.length == 0){
		var user = new CMSUser();
		user.id = user._id;
		user.username = username;
		user.first_name = first_name;
		user.last_name = last_name;
		user.email = email;
		user.setPassword(password);
		user.setRoles(add_roles);
		root.get('cms').get('userfolder').add(user);
		return {url: user.getURI()+'user_edit', errors:[]};
	}
	return {errors: errors, url: ''};
}