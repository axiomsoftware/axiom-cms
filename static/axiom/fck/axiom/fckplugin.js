/**
 * Axiom Asset/Image Selector Plugin
 * -------------------------------------
 * 
 */
 

var FCKImageSelect = function() { this.Name = 'ImageSelect'; }

FCKImageSelect.prototype.Execute = function() {
	var widget = window.parent.dojo.widget.byId('fck_wysiwyg_selector');
	widget.assetType = 'Image';
	if(window.parent.dojo.render.html.ie)
		widget.textRange = window.parent.FCKeditorAPI.GetInstance(widget.instanceName).EditorDocument.selection.createRange();
	widget.selectasset(); 
}

FCKImageSelect.prototype.GetState = function() { return FCK_TRISTATE_OFF; }


FCKCommands.RegisterCommand('ImageSelect', new FCKImageSelect());
var oImageSelectItem = new FCKToolbarButton('ImageSelect', 'Image Selector', 'Insert an image', null, false, false, null);
oImageSelectItem.IconPath = FCKPlugins.Items['axiom'].Path + 'insertimage.gif' ;
FCKToolbarItems.RegisterItem( 'ImageSelect', oImageSelectItem ) ;

/**
 * Axiom Asset/File Selector Plugin
 * -------------------------------------
 * 
 */
 

var FCKFileSelect = function() { this.Name = 'FileSelect'; }

FCKFileSelect.prototype.Execute = function() { 
	var widget = window.parent.dojo.widget.byId('fck_wysiwyg_selector');
	widget.assetType = 'Document';
	if(window.parent.dojo.render.html.ie)
		widget.textRange = window.parent.FCKeditorAPI.GetInstance(widget.instanceName).EditorDocument.selection.createRange();
	widget.selectasset(); 
}

FCKFileSelect.prototype.GetState = function() { return FCK_TRISTATE_OFF; }


FCKCommands.RegisterCommand('FileSelect', new FCKFileSelect());
var oFileSelectItem = new FCKToolbarButton('FileSelect', 'File Selector', 'Insert a file', null, false, false, null);
oFileSelectItem.IconPath = FCKPlugins.Items['axiom'].Path + 'insertfile.gif' ;
FCKToolbarItems.RegisterItem( 'FileSelect', oFileSelectItem ) ;

/**
 * Axiom Asset/Audio Selector Plugin
 * -------------------------------------
 * 
 */
 

var FCKAudioSelect = function() { this.Name = 'AudioSelect'; }

FCKAudioSelect.prototype.Execute = function() { 
	var widget = window.parent.dojo.widget.byId('fck_wysiwyg_selector');
	widget.assetType = 'Audio';
	if(window.parent.dojo.render.html.ie)
		widget.textRange = window.parent.FCKeditorAPI.GetInstance(widget.instanceName).EditorDocument.selection.createRange();
	widget.selectasset(); 
}

FCKAudioSelect.prototype.GetState = function() { return FCK_TRISTATE_OFF; }


FCKCommands.RegisterCommand('AudioSelect', new FCKAudioSelect());
var oAudioSelectItem = new FCKToolbarButton('AudioSelect', 'Audio Selector', 'Insert an audio file', null, false, false, null);
oAudioSelectItem.IconPath = FCKPlugins.Items['axiom'].Path + 'insertaudio.gif' ;
FCKToolbarItems.RegisterItem( 'AudioSelect', oAudioSelectItem ) ;

/**
 * Axiom Asset/Video Selector Plugin
 * -------------------------------------
 * 
 */
 
var FCKVideoSelect = function() { this.Name = 'VideoSelect'; }

FCKVideoSelect.prototype.Execute = function() { 
	var widget = window.parent.dojo.widget.byId('fck_wysiwyg_selector');
	widget.assetType = 'Video';
	if(window.parent.dojo.render.html.ie)
		widget.textRange = window.parent.FCKeditorAPI.GetInstance(widget.instanceName).EditorDocument.selection.createRange();
	widget.selectasset(); 
}

FCKVideoSelect.prototype.GetState = function() { return FCK_TRISTATE_OFF; }

FCKCommands.RegisterCommand('VideoSelect', new FCKVideoSelect());
var oVideoSelectItem = new FCKToolbarButton('VideoSelect', 'Video Selector', 'Insert a video file', null, false, false, null);
oVideoSelectItem.IconPath = FCKPlugins.Items['axiom'].Path + 'insertvideo.gif' ;
FCKToolbarItems.RegisterItem( 'VideoSelect', oVideoSelectItem ) ;


/**
 * Axiom Link Selector Plugin
 * -------------------------------------
 * 
 */
 
var FCKLinkSelect = function() { this.Name='LinkSelect'; }

FCKLinkSelect.prototype.Execute = function()
{
	var fckRef = FCK.Name;
	var axiom = window.parent.axiom;
	var dojo = window.parent.dojo;
	var doc = window.parent.document;
	var linkDialogID = fckRef + '_LinkDialog';
	var LinkSelectRef = this;

	var SelectedText,SelectedRange;
	if(dojo.render.html.ie) {
		SelectedRange = FCK.EditorDocument.selection.createRange();
		SelectedText = FCK.EditorDocument.selection.createRange().text;
	} else {
		SelectedText = FCK.EditorWindow.getSelection().toString();
	}

	// Destroy previous instances of Link Dialog
	var linkdialog = dojo.widget.byId(linkDialogID);
	if(linkdialog) {
		linkdialog.destroy();
	}

	var dialogHolder=doc.createElement('div');
	var dialog = doc.createElement("div");
	dialog.className = "modal";
	var d = doc.createElement("div");
	var buffer = [];
	buffer[buffer.length] = '<div class="linktype"><label for="'+fckRef+'_linktype">Link Type</label>';
	buffer[buffer.length] = '<select id="'+fckRef+'_linktype" onchange="document.getElementById(\''+fckRef+'_url\').value=this.value;">';
	buffer[buffer.length] = '<option value="http://">URL</option>';
	buffer[buffer.length] = '<option value="mailto:">Email</option>';
	buffer[buffer.length] = '</select>';
	buffer[buffer.length] = '<label for="'+fckRef+'_url">Link Address:</label>';
	buffer[buffer.length] = '<input type="text" id="'+fckRef+'_url" value="http://" />';
	buffer[buffer.length] = '<label for="'+fckRef+'_text">Link Text:</label>';
	buffer[buffer.length] = '<input type="text" id="'+fckRef+'_text" value="'+( SelectedText.replace(/\"/g, "&quot;") || '')+'"/></div>';
	buffer[buffer.length] = '<div class="linkwindow"><input class="cb" type="checkbox" id="'+fckRef+'_newwindow" value="http://" /><label for="'+fckRef+'_newwindow">Open in new window</label></div>';
	d.innerHTML = buffer.join('');
	var bb = doc.createElement("div");
	bb.className = "linkbrowse";
	var browsebutton = doc.createElement("a");
	browsebutton.href = "javascript:void(0);";
	browsebutton.className = "button form-button";
	browsebutton.innerHTML = "Browse this site";
	browsebutton.onclick = function() {
		linkdialog.hide();
		doc.getElementById(fckRef+"_linktype").value="http://";
		axiom.browsetable.multiple = false;
		axiom.browsetable.property = '';
		axiom.browsetable.defaultValue = '';
		axiom.browsetable.defaultValues = [];
		axiom.browsetable.setCallBack = function(a,b){
			var url = b[1].uri; 
			doc.getElementById(fckRef+"_url").value = url;
			if(doc.getElementById(fckRef+"_text").value == '')
				doc.getElementById(fckRef+"_text").value = b[0];
			linkdialog.show();
		}
		axiom.browsetable.exitCallBack = function(){axiom.browsemodal.hide();linkdialog.show();}
		axiom.browsetable.callingWidget = this;
		axiom.browsetable.searchURL = '/' + axiom.ctable.searchURL;
		axiom.browsetable.setContext('wysiwyg'); 
		axiom.browsetable.toggleHrefValues(); 
		axiom.browsecfilter.resetTargetTypes();
		axiom.browsecfilter.publishedOnly = true;
		axiom.browsecfilter.search(null, null, null, 12);
		axiom.browsemodal.show();
	}
	bb.appendChild(browsebutton);
	d.appendChild(bb);
	dialog.appendChild(d);
	var b = doc.createElement("div");
	b.className = "buttons";
	var okbutton = doc.createElement("a");
	okbutton.innerHTML = "OK";
	okbutton.className = "button form-button";
	okbutton.onclick = function() {
		var url = doc.getElementById(fckRef+"_url").value;
		var target;
		if(doc.getElementById(fckRef+"_newwindow").checked==true) { target="_blank"; }
		var linktext = ( doc.getElementById(fckRef+"_text").value || SelectedText || url)
		
		// Create the new Link node -- seperate code paths for IE and Firefox due to IE losing focus when clicking into the link dialog
		if(dojo.render.html.ie) {
			var markup;
			if(target) {
				markup = '<a href="'+url+'" target="_blank">'+linktext+'</a>'
			} else {
				markup = '<a href="'+url+'">'+linktext+'</a>';
			}
			FCK.EditorWindow.focus();
			SelectedRange.pasteHTML(markup);
			SelectedRange.select();
		} else {
			var oLink = FCK.CreateLink(url)[0];
			if (!oLink){
				oLink=FCK.CreateElement('a');
			}
			oLink.href = url;
			oLink.innerHTML = linktext;
			if(target) { oLink.target = target; }
			FCK.Focus();
			FCK.Selection.SelectNode(oLink);
		}

		linkdialog.hide();
	}
	var cancelbutton = doc.createElement("a");
	cancelbutton.innerHTML = "Cancel";
	cancelbutton.className = "button form-button";
	cancelbutton.onclick = function() { 
		axiom.browsecfilter.publishedOnly = false;
		linkdialog.hide(); 
	}	
	b.appendChild(okbutton);
	b.appendChild(cancelbutton);
	dialog.appendChild(b);
	dialogHolder.appendChild(dialog);
	doc.body.appendChild(dialogHolder);
	linkdialog = dojo.widget.createWidget('Dialog',{id:linkDialogID},dialogHolder);
	linkdialog.show();

}

FCKLinkSelect.prototype.GetState = function()
{
	return FCK_TRISTATE_OFF;
}

FCKCommands.RegisterCommand('LinkSelect', new FCKLinkSelect());
var oLinkSelectItem = new FCKToolbarButton('LinkSelect', 'Link Selector', 'Insert a link', null, false, false, 34);
FCKToolbarItems.RegisterItem( 'LinkSelect', oLinkSelectItem ) ;
