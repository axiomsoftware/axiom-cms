function Login() {
    var postback = req.get("postback");
    var username = req.get("username");
    var password = req.get("password");
    var data = {};
    if (postback && username && password) {
		var users = app.getObjects('CMSUser', new NativeFilter("username:"+username+" AND password:"+password.md5()+" AND (_status: a OR _status: z)", "WhitespaceAnalyzer"));
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
				res.redirect((req.get("came_from")||root.get("cms").getURI()));
			}
		}
    }
	
    data.came_from = req.data.http_referer;
    res.write(this.login(data));
}

function Logout() {
    session.logout();
    res.redirect(root.getURI("cms/Login"));
}
