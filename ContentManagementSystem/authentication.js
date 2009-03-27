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


function Login() {
    var postback = req.get("postback");
    var username = req.get("username");
    var password = req.get("password");
    var data = {};
    if (postback && username && password) {
		var users = app.getObjects('CMSUser', new NativeFilter("username:"+username+" AND password:"+password.md5()+" AND (cms_status: a OR cms_status: z)", "WhitespaceAnalyzer"));
		if (users.length === 0) { 
			app.log("Invalid login attempt for user "+username+" from "+ req.data.http_remotehost);
			data.error_message = "You have entered an invalid username/password combination. If you have forgotten this information please contact your Axiom administrator.";
		} else {
			users[0].last_login = new Date();
			session.login(users[0]);
			var http_referer = session.getHttpReferer();
			if(http_referer != null && http_referer.match(/(cms|assets|reports|content)\/?$/)){ // referer may be set to an action like create/delete, etc. only allow landing pages for redirection
				session.setHttpReferer(null); // Remove http_referer from session
				res.redirect(http_referer);
			} else {
				res.redirect(req.get("came_from") || this.getURI());
			}
		}
    }
	
    data.came_from = req.data.http_referer;
    return this.login(data);
}

function Logout() {
    session.logout();
    res.redirect(root.getURI("cms/Login"));
}
