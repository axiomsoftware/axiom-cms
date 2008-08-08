function multiValueJSON(property) {
    var requested = true;
    var prop = this._gR('property',null);
    if (!prop) {
        if (property) { prop = property; }
        requested = false;
    }
    var json = '';
    if (this[prop]) {
        var last = this[prop].length-1;
        var o = null;
        for (var i = 0;i<this[prop].length;i++) {
            o = this[prop][i].getTarget();
            if (o) {
                json += '["'+escape(o.title)+'","'+o.getPath()+'","'+o.getURI()+'"]';
                if (i!=last) { json += ','; }
            }
        }
    }
    if (requested) {
        res.setContentType('text/javascript');
        res.write('['+json+']');
        return;
    }
    return '['+json+']';
}
