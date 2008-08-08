axiom.reports = {
 	init: function() {
		dojo.require('dojo.json');
		if(dojo.byId('ReportPanel')){
			dojo.require("axiom.widget.ReportGenerator");
			
			axiom.reports.generator = dojo.widget.createWidget('axiom:ReportGenerator', {appPath:axiom.appPath}, dojo.byId('ReportGenerator'));
			
		}
	}
}
dojo.addOnLoad(axiom.reports.init);
