function getParams() {
    var params = {}, url = document.location.toString();
    q = url.indexOf('?');if(q==-1){return params;}
    url = url.substr(q+1);
    var segs = url.split('&'), pair=[];
    for (var s in segs) {
        pair = segs[s].split('=');
        if (pair.length==2) {params[pair[0]] = pair[1];}
    }
    return params;
}

function editFormSubmit(){
	alert('Validate and Submit');
	document.forms[0].submit();
};

function editFormPreview(){
	alert('Preview');
};
