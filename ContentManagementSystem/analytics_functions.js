function getAnalytics() {
    // Make sure we are grabbing yesterday's totals
    var now = new Date();
    now.setDate(now.getDay()-1);

    var ga_data = {};
    var settings = app.getHits('CMSSettings').objects(0,1);
    var url = req.get('url');
    if (settings.length > 0) {
	settings = settings[0];
	if (settings.analytics_account && settings.analytics_password && settings.profile_id && (settings.show_pageviews || settings.show_conversions)) {

	    //url info
	    var conn = getDBConnection('_default');

	    // General Queries to get Pageviews and conversions.
	    var per_url_sql = "SELECT pageviews, conversions FROM cms_analytics WHERE path = '"+url+"' AND date > '"+now.format("yyyy-MM-dd hh:mm:ss")+"'";
	    var per_url_rs = conn.executeQuery(per_url_sql);
	    if (per_url_rs) {
		per_url_rs.next();
		var pageviews = per_url_rs.getColumnItem("pageviews");
		var conversions = per_url_rs.getColumnItem("conversions");

		if (settings.show_pageviews) {
		    var total_views_sql = "SELECT SUM(pageviews) as total_pageviews FROM cms_analytics WHERE date > '"+now.format("yyyy-MM-dd hh:mm:ss")+"'";
		    var total_views_rs = conn.executeQuery(total_views_sql);
		    if (total_views_rs) {
			total_views_rs.next();
			var total_pageviews = total_views_rs.getColumnItem("total_pageviews");
			ga_data.pageviews = {
			    value: (pageviews || 0),
			    percent: ((total_pageviews > 0)?""+((pageviews || 0)/total_pageviews):"0.0").substring(0,4)
			};
		    }
		}

		if (settings.show_conversions) {
		    var total_convs_sql = "SELECT SUM(conversions) as total_conversions FROM cms_analytics WHERE date > '"+now.format("yyyy-MM-dd hh:mm:ss")+"'";
		    var total_convs_rs = conn.executeQuery(total_convs_sql);
		    if (total_convs_rs) {
			total_convs_rs.next();
			var total_conversions = total_convs_rs.getColumnItem("total_conversions");
			ga_data.conversions = {
			    value: (conversions || 0),
			    percent: ((total_conversions > 0)?""+((conversions || 0)/total_conversions):"0.0").substring(0,4)
			};
		    }
		}
	    }
	}
    }
    return ga_data;
}