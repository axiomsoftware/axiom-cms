var recyclebin = {
	init: function(){
		dojo.require('dojo.json');
		dojo.require('axiom.widget.RecycleBinTable');
		dojo.require('axiom.widget.RecycleBinFilter');
		recyclebin.ctable = dojo.widget.createWidget("axiom:RecycleBinTable",
							{appPath:axiom.appPath,
							searchURL: 'recycle_bin_contents'},
							dojo.byId("RecycleBinTable"));

		recyclebin.cfilter = dojo.widget.createWidget("axiom:RecycleBinFilter",
												 { prototypes:["CMSTrashBag"],
												   appPath:axiom.appPath},
												 dojo.byId("RecycleBinFilter"));
		recyclebin.cfilter.registerTable(recyclebin.ctable);
		recyclebin.cfilter.search();
	}
};
dojo.addOnLoad(recyclebin.init);
