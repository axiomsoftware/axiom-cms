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


function cms_cleanup(){
	app.log('Cleaning up objects with null status...');
	var ms_to_hours = 1000*60*60;
	var now = (new Date()).getTime();
	var cleanup = cmsGlobals.props.cleanup;

	var expiration_time;
	if(cleanup && cleanup.@interval){
		expiration_time = parseInt(cleanup.@interval, 10);
		if(!expiration_time){
			app.log("Could not parse interval for cms cleanup - defaulting to 72 hours.");
			expiration_time = 72;
		}
	} else {
		//default to three days
		expiration_time =  72;
	}

	var for_removal = [obj for each(obj in app.getObjects([], "cms_status: null")) if(expiration_time < Math.floor((now - obj.lastmodified().getTime()) / ms_to_hours)) ];

	// advice hook
	if(typeof ContentManagementSystem.cmsCleanupAdvice == 'function'){
		ContentManagementSystem.cmsCleanupAdvice(for_removal);
	}

	for each(obj in for_removal){
		obj._parent.remove(obj);
	}

	app.log('Removed '+for_removal.length+' objects with null status.');
}

function cms_analytics() {
    var settings = app.getHits('CMSSettings').objects(0,1);
    var url = req.get('url');
    if (settings.length > 0) {
	settings = settings[0];
	if (settings.analytics_account && settings.analytics_password && settings.profile_id && (settings.show_pageviews || settings.show_conversions)) {
	    var paths = {};
	    var now = new Date();
	    var as = new Packages.com.google.gdata.client.analytics.AnalyticsService("analytics");
	    as.setUserCredentials(settings.analytics_account, settings.analytics_password);

	    var metrics = "ga:pageviews,ga:goalCompletionsAll";

	    //url info
	    var today = new Date();
	    var month = new Date();
	    month.setMonth(today.getMonth()-1);
	    var feed_url = new Packages.java.net.URL("https://www.google.com/analytics/feeds/data?ids=ga:"+settings.profile_id+"&dimensions=ga:pagePath&metrics="+metrics+"&start-date="+month.format("yyyy-MM-dd")+"&end-date="+today.format("yyyy-MM-dd"));
	    var feed = as.getFeed(feed_url, Packages.com.google.gdata.data.analytics.DataFeed);
	    var entries = feed.getEntries();
	    var entries_size = entries.size();
	    if (entries_size > 0) {
		var conn = getDBConnection('_default');

		for (var i = 0; i < entries_size; i++) {
		    var entry = entries.get(i);
		    var pageviews_value = entry.doubleValueOf("ga:pageviews");
		    var conversions_value = entry.doubleValueOf("ga:goalCompletionsAll");
		    if (entry.hasDimensions()) {
			var dim = entry.getDimension("ga:pagePath");
			var dim_url = dim.getValue();
			dim_url = dim_url.replace(/\/+$/, "");
			if (dim_url == "") {
			    dim_url = '/';
			}
			if (!(paths[dim_url])) {
			    paths[dim_url] = {
				pageviews: pageviews_value,
				conversions: conversions_value
			    };
			} else {
			    paths[dim_url].pageviews += pageviews_value;
			    paths[dim_url].conversions += conversions_value;
			}
		    }
		}

		for (var path in paths) {
		    var path_obj = paths[path];
		    var statement = "INSERT INTO cms_analytics (date, path, pageviews, conversions) VALUES ("+["'"+now.format("yyyy-MM-dd hh:mm:ss"),path,path_obj.pageviews,path_obj.conversions+"'"].join("','")+")";
		    if (conn.executeUpdate(statement) == -1) {
			app.log(conn.getLastError());
		    }
		}
	    }
	}
    }
}