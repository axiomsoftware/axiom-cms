importPackage(Packages.java.net);
importPackage(Packages.java.io);
importClass(Packages.java.lang.Runnable,Packages.java.lang.Thread);


if (!global.axiom) {
    global.axiom = {};
}

axiom.HTTP = {
    encode_params: function(params) {
	var data = '';
	var count = 0;
	for (var p in params) {
	    data += ((count != 0)?'&':'')+URLEncoder.encode(p, "UTF-8") + "=" + URLEncoder.encode(params[p], "UTF-8");
	    count++;
	}
	return data;
    },
    get_common_type: function(byte_array, type) {
	// TODO: String Encoding (ie. UTF-8)

	if (['text/json','application/json'].contains(type.substring(0,(type.indexOf(';')||type.length)))) {
	    try {
		var json = null;
		eval('json = ' + Packages.java.lang.String(byte_array));
		return json;
	    } catch (e) {
		app.log('Error: Could not convert type to JSON, returning as byte array. ' + e);
	    }
	} else if(['text/html','text/xml','application/html','application/xml'].contains(type.substring(0,(type.indexOf(';')||type.length)))) {
	    try {
		return new XHTML(Packages.java.lang.String(byte_array)+''.replace(/\<(!DOCTYPE|\?xml)[^\>]*>/g, ''));
	    } catch (e) {
		app.log('Error: Could not convert type to XHTML, returning as byte array. ' + e);
	    }
	} else if (type.indexOf("text/") >= 0) {
	    return Packages.java.lang.String(byte_array);
	}

	return byte_array;
    },
    get_bytes: function(conn) {
	var reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	var ins = conn.getInputStream();
	var c;
	var byteArrayOutputStream = new ByteArrayOutputStream();
	while ((c = ins.read()) != -1) {
            byteArrayOutputStream.write(c);
	}

	return byteArrayOutputStream.toByteArray();
    },
    get: function(url, params) {
	var data = axiom.HTTP.encode_params(params);
	var prefix = '?';
	if (params) {
	    if (url.indexOf('?') >= 0) {
		prefix = '&';
	    } else {
		prefix = '?';
	    }

	    url += prefix + data ;
	}

	url = new URL(url);
	var conn = url.openConnection();

	return axiom.HTTP.get_common_type(this.get_bytes(conn), conn.getContentType());
    },
    post: function(url, params) {
	var data = axiom.HTTP.encode_params(params);
	url = new URL(url);
	var conn = url.openConnection();
	conn.setDoOutput(true);
        var writer = new OutputStreamWriter(conn.getOutputStream());
        writer.write(data);
        writer.flush();
	writer.close();

	return axiom.HTTP.get_common_type(this.get_bytes(conn), conn.getContentType());
    },
    ajax: function(url, data, callback, type) {
	var r = new Runnable() {
	    run: function() {
		type = type || 'get';
		callback(axiom.HTTP[type](url, data));
	    }
	};

	new Thread(r).start();
    }
};