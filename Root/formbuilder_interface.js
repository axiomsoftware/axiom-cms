function formbuilder() {
	var data = {};
	data['prototypes'] = root._fb_getPrototypeNames();
	res.write(this.formbuilder_markup(data));
}

function formbuilder_generate() {
	if (req.data.axiomcms != 'true') { return; }
	if (req.data.prototype == "All"){
		this.formbuilder_massgenerate();
	}
	else{
		res.write(req.data.writeoption+": "+req.data.talform+" for "+req.data.prototype+"... ");
		root._fb_generateForm(req.data.prototype, req.data.catalog, req.data.talform + '.tal', req.data.writeoption);
		res.write("Success!");
	}
}

function formbuilder_massgenerate() {
	var form = (req.get('talform')  || "cms_editForm");
	var catalog = (req.get('catalog')  || "test");
	var writeopt = (req.get('writeoption') || "regen");
	var protos = root._fb_getPrototypeNames();
	for (var i = 0; i < protos.length; i++) {
		// XXX: EDIT FOR CMS PROPERTIES FILE USE
		if (protos[i].match('IMIS|Axiom|SWX|Simple|Image|File|CMS|Content|CMSTag|Global|ShoppingCart|FormBuilder|CMSUser|Widget')) { continue; }
		res.write(writeopt+ ": "+form+" for "+protos[i]+"... ");
		try{
			root._fb_generateForm(protos[i], catalog, form + '.tal', writeopt);
		}
		catch(e){
			res.write(e.toString());
		}
		res.write("Success!<br/>");
	}
}