/**
 Copyright Axiom
 Nick Campbell
 */

dojo.provide("axiom.widget.SaveDialogModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
    "axiom.widget.SaveDialogModal",
    axiom.widget.AxiomModal,
    function(){},
    {
	appPath:    '',
	staticPath: '',
	prototype:  '',
	callback: '',
	templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SaveDialogModal.html'),
	templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/EditTaskModal.css'),
	close:function(){
	    axiom.closeModal();
	},
	onEnter:function(){
	    this.save();
	},
	dontSave:function() {
	    axiom.dirtyProps = {};
	    axiom.showContent();
	    this.close();
	},
	save:function(){
	    axiom.triggerSubmitEdit(this.callback);
	    this.close();
	},
	postCreate:function() {
	    this.title.innerHTML = 'Save Dialog';
	    this.img.src = this.staticPath+'/axiom/images/alert.gif';
	}
    }
);
