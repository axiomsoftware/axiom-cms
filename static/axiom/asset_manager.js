dojo.require("dojo.event.*");
dojo.require("dojo.io.*");
dojo.require("dojo.io.IframeIO")
dojo.require("dojo.html.*");
dojo.require("dojo.widget.ContentPane");
dojo.require("axiom.widget.Asset");
var current_thumbs = []; 
var lastTags = '';
var lastKeywords = '';
var lastTypes = 'all';
var lastSort = 'alpha';
var cols = 0;
var rows = 0;
var batch_size = 0;
var current_page = 1;
var last_page = 1;
var upload_form_bind;
var edited_widget;

function queryAssets(keywords, types, batch_size, sort, page_num){
	dojo.io.bind({ url: 'search_assets',
 				   load: load_thumbs,
				   mimetype: 'text/javascript',
				   content: {keywords: keywords,
							 types: types,
							 batch_size: batch_size,
							 sort: sort,
							 page_num: (parseInt(page_num) != 'NaN'?page_num:current_page)
							},
				   preventCache: true,
				   method: 'post'
 			     });
}
function deleteTags(){
	var tag_list = dojo.byId('tag_container').getElementsByTagName('input');
	var checked_len = 0; 
	for (i in tag_list){ if(tag_list[i].checked) checked_len++; }
	var input_len = tag_list.length;
	var submitted = 0;
	for(var t=0; t != input_len; t++){
		if(tag_list[t].checked){
			submitted++;
			dojo.io.bind({ url: tag_list[t].value +'cms_delete',
						   load: (submitted == checked_len)?manageTags:function(){}
					     });
		}
	}
}
function tagSearch(evt){ 
	if(typeof evt == "object")
		evt = (evt.target.textContent || evt.target.innerText)
	dojo.byId('keywords').value = 'tag:"'+evt+'"';
	queryAssets('tag:"'+ evt+'"', 'all', batch_size, lastSort);
}

function fireLastQuery(page){ 
	if(!page || typeof page != "number") 
		page = current_page;
	queryAssets(lastKeywords, lastTypes, batch_size, lastSort, page);
}
function recalculateBatchSize(){
	// FIXME FIXME hardcodin' size of assets for now...
	var thumbs = dojo.byId('thumbs');
	rows = Math.floor(thumbs.offsetHeight/170);
	cols = Math.floor(thumbs.offsetWidth/165);
	batch_size = rows*cols;
	dojo.byId('batch_size').value = batch_size;
}

function nextPage(){
	if(current_page != last_page)
		fireLastQuery(current_page + 1);
}

function previousPage(){
	if(current_page != 1)
		fireLastQuery(current_page - 1);
}

function gotoPage(page){
	// kludge since &lt; and &gt; comparisons bork xml well-formedness
	page = parseInt(page,10)
	if(Math.max(1, page) == page)
		if(Math.min(last_page+1, page) == page)
			fireLastQuery(page);
}
function fileclick(evt){
	dojo.byId('filename').click(evt);
}
function stopPropagation(evt){
	if (!evt) 
		var evt = window.event;
	evt.cancelBubble = true;
	if (evt.stopPropagation) evt.stopPropagation(); 
}
function load_thumbs(load, data, evt){ 
    lastKeywords = dojo.byId('keywords').value;
	lastTypes = dojo.byId('types').value;
	lastSort = dojo.byId('hidden_sort').value;
	
	var pane = dojo.widget.byId('thumbs');
	dojo.lang.forEach(current_thumbs, function(thumb){
		thumb.destroy();
	});
	pane.setContent('');
	var len = data.objs.length;
	var res_text = dojo.byId('results_found');
	res_text.innerHTML = data.total+ " result"+((data.total == 1)?"":"s")+" found"; 

	current_page = data.current;
	last_page = Math.ceil(data.total/batch_size);
	var display_lambda = function(pages){
		if(data.total != len){
			var nums = pages.getElementsByTagName('strong');
			nums[0].innerHTML = current_page;
			nums[1].innerHTML = last_page;
			var buttons = pages.getElementsByTagName('img');
			if(current_page != 1)
				buttons[0].src = axiom.staticPath+'/axiom/images/icon_page_back_enabled.gif';
			else
				buttons[0].src = axiom.staticPath+'/axiom/images/icon_page_back_disabled.gif';
			
			if(current_page != last_page)
				buttons[1].src = axiom.staticPath+'/axiom/images/icon_page_next_enabled.gif';
			else
				buttons[1].src = axiom.staticPath+'/axiom/images/icon_page_next_disabled.gif';
			
			pages.style.display = 'block';
		}
		else{
			pages.style.display = 'none';
		}
	}
	display_lambda(dojo.byId('pages'));
	display_lambda(dojo.byId('pages2'));
	
	dojo.byId('sort_by').style.display='inline';
	dojo.lang.forEach(data.objs, function(asset){
		asset.appPath= axiom.appPath;
		var thumb = dojo.widget.createWidget('axiom:Asset', asset);
		current_thumbs.push(thumb);
		pane.addChild(thumb);
	});
	updateTags();
}

function updateTags(display){
	dojo.io.bind({url: 'cmsTagList', 
				  load: function(load, data, evt){
					  dojo.byId('tag_window').innerHTML=data;
					  if(display)
						  axiom.tags.toggleWindow('left_nav_tags');
				  },
				  mimetype: 'text/html',
				  preventCache: true
			     });

}

function hideSearchUtils(){
	dojo.byId('results_found').innerHTML = ''
	dojo.byId('sort_by').style.display='none';
	dojo.byId('pages').style.display='none';
	dojo.byId('pages2').style.display='none';
}

function manageTags(){
	hideSearchUtils();
	dojo.widget.byId('thumbs').setUrl('manage_tag_content?'+'nocache='+(new Date()).getTime());
}

function assetEdit(content,is_href,hide_nav, widget){
	if(!axiom.browsemodal) {
		axiom.browsemodal = dojo.widget.createWidget("Dialog",
													 {id:"BrowseDialog"},
													 dojo.byId("BrowseDialog"));
		new dojo.dnd.HtmlDragMoveSource(dojo.byId("BrowseDialog"));
	}
	if(!axiom.browsecfilter) {
		dojo.require('axiom.widget.ContentFilter');
		axiom.browsecfilter = dojo.widget.createWidget("axiom:ContentFilter",
													   {prototypes:axiom.searchPrototypes,
														appPath:axiom.appPath},
													   dojo.byId("BrowseContentFilter"));
	}
	if(!axiom.browsetable) {
		dojo.require("axiom.widget.ObjectSelectTable");
		axiom.browsetable = dojo.widget.createWidget("axiom:ObjectSelectTable",
													 {appPath:axiom.appPath},
													 dojo.byId("BrowseContentTable"));
		axiom.browsecfilter.registerTable(axiom.browsetable);
	}

	axiom.browsetable.multiple = false; // Initialize table to be singular select
	axiom.browsetable.defaultValue = "";
	axiom.browsetable.defaultValues = []; 
	axiom.clearOnSubmitMethods();
	axiom.addSubmitMethod(fireLastQuery);
	hideSearchUtils();
	dojo.widget.byId('thumbs')[is_href?'setUrl':'setContent'](content);
	if(hide_nav){
		dojo.byId('columnLeft').style.display = 'none';
		var colRight = dojo.byId('columnRight');
		axiom.oldLeftMargin = colRight.style.margin;
		colRight.style.margin = '0px';
	}
}

function uploadFile(){
	dojo.io.bind({url: 'upload',
				  formNode: dojo.byId('upload_file'),
				  mimetype: 'text/html',
				  load: function(load,evt,data){
					  var check = document.getElementById("nounzip").checked;
					  if(evt.body.innerHTML.match(/File upload size exceeds limit/i)){
						  var limit = axiom.reqLimit ? (axiom.reqLimit / 1024.0) : 200;
						  if(limit < 1){
							  limit = axiom.reqLimit + 'KB'
						  } else {
							  limit = parseInt(limit) + 'MB';
						  }
						  axiom.openModal({content: 'You may not upload a file greater than '+limit+'.'});
						  fireLastQuery();
					  } else if(data.formNode.file.value.match(/\.zip$/)){
						  if (!check) {
							  assetEdit(evt.body.innerHTML, null, true);
    						  kludgeTextareas();
    					  } else {
    						  assetEdit(evt.body.innerHTML);
    					  }
					  }
					  else{
						  assetEdit(evt.body.innerHTML);
					  }
					  axiom.showingThumbs = false;
				  },
	              error: function(){ axiom.openModal({content: 'Could not connect to server.'})},
				  method: "post",
				  transport: "IframeTransport"  
			     });
	showLoading();
}

function showLoading(){
	assetEdit('<div style="width:100%;text-align:center;padding:25px 0;">Loading...<br/><img src="'+axiom.staticPath + '/axiom/images/ajax-loader.gif" alt="Loading..." /></div>');
}

function pageInit(){
	new dojo.io.FormBind({ formNode: dojo.byId('search_form'),
						   load: load_thumbs,
						   mimetype: 'text/javascript' });
	dojo.require("dojo.dnd.HtmlDragMove");
	new dojo.dnd.HtmlDragMoveSource(dojo.byId("supportedFileTypes"));
	new dojo.dnd.HtmlDragMoveSource(dojo.byId("tag_window"));
	dojo.event.kwConnect({ srcObj: window,
						   srcFunc: 'onresize',
						   adviceFunc:  function(){ if(axiom.showingThumbs){ recalculateBatchSize(); fireLastQuery(); } }
						 });
	
	var sort_by = dojo.byId('sort_by');
	if(sort_by){
		dojo.event.kwConnect({ srcObj: sort_by,
							   srcFunc: 'onchange',
							   adviceFunc: function(evt){dojo.byId('hidden_sort').value = evt.target.value;
														 lastSort = evt.target.value;
														 fireLastQuery();}
							 });
	}
	dojo.event.kwConnect({ srcFunc: "showContent",
						   srcObj: axiom,
						   adviceFunc: function(){ fireLastQuery(); }
						 });
	dojo.event.kwConnect({ srcFunc: "onclick",
						   srcObj: document.getElementsByTagName('body')[0],
						   adviceFunc: function(){ dojo.lang.forEach(current_thumbs, function(w){ if(w.domNode) {w.allOff();} } );}
						 });
	recalculateBatchSize();
	fireLastQuery();
	
}
function gotoKey(evt){
	if(evt.keyCode == 13)
		gotoPage((evt.srcElement ? evt.srcElement.value : evt.target.value))
}

var batchTitle = '';
var batchTags = '';
var batchAlt = '';
var batchCredit = '';
var templateHidden = false;
function kludgeTextareas(){
	dojo.lang.forEach(document.getElementsByTagName('textarea'), function(area){ area.value='';});
	batchTitle = '';
	batchTags = '';
	batchCredit = '';
	batchAlt = '';
}
function toggleTemplate(){
	if(templateHidden){ 
		dojo.byId('template_trigger').innerHTML = 'Collapse';
		dojo.lfx.html.wipeIn(dojo.byId('template'), 300).play();
	} else{
		dojo.byId('template_trigger').innerHTML = 'Expand';
		dojo.lfx.html.wipeOut(dojo.byId('template'), 300).play();
	}
	templateHidden = !templateHidden;
}
function applyBatch(){
	var newTitle = dojo.byId('template_title').value;
	var newTags = dojo.byId('template_tags').value;
	var newAlt = dojo.byId('template_alt').value;
	var newCredit = dojo.byId('template_credit').value;
	var rows = dojo.byId('content_table').getElementsByTagName('tr');
	var len = rows.length;
	for(var i=0; i != len; i++){
		var textareas = rows[i].getElementsByTagName('textarea');
		if(textareas.length != 4)
			continue;
		if(textareas[0].value == batchTitle)
			textareas[0].value = newTitle;
		if(textareas[1].value == batchTags)
			textareas[1].value = newTags;
		if(textareas[2].value == batchAlt)
			textareas[2].value = newAlt;
		if(textareas[3].value == batchCredit)
			textareas[3].value = newCredit;
	}
	batchTitle = newTitle;
	batchTags = newTags;
	batchAlt = newAlt;
	batchCredit = newCredit;
}
function cancelBatch(){ 
	var rows = dojo.byId('content_table').getElementsByTagName('tr');
	var len = rows.length;
	var hrefs = [];
	for(var i=0; i != len; i++){
		var href = rows[i].attributes.getNamedItem('name');
		if(href)
			hrefs.push(href.value);
	}
	// chain the delete events so we don't switch back to search results
	// before they're all deleted
	assetEdit('<div style="width:100%;text-align:center;padding:25px 0;">Loading...<br/><img src="'+axiom.staticPath + '/axiom/images/ajax-loader.gif" alt="Loading..." /></div>');
	dojo.byId('columnLeft').style.display = 'block';
	dojo.byId('columnRight').style.margin = axiom.oldLeftMargin; 
	if(hrefs.length != 0){
		var delete_lambda = function(){ dojo.io.bind({url:hrefs.pop()+'/cms_delete',
			load:(hrefs.length == 0)?fireLastQuery:delete_lambda})
									  };
		delete_lambda();
	}
}

function fire_submit(){
	var rows = dojo.byId('content_table').getElementsByTagName('tr');
	var objs = {};
	var len = rows.length;
	var error_message = "";
	for(var i=0; i != len; i++){
		var id = rows[i].id;
		objs[id] = '';
		var textareas = rows[i].getElementsByTagName('textarea');
		if(textareas.length != 4) 
			continue;
		if(textareas[0].value == "")
			error_message += 'Title is required for '+id+'<br/>';
		if(textareas[1].value == "")
			error_message += 'Tags are required for '+id+'<br/>';
		
		objs[id] = {title: textareas[0].value,
					tags:  textareas[1].value,
					alt:   textareas[2].value,
					credit:  textareas[3].value};
	}
	if(error_message == ''){
		dojo.io.bind({ url: 'edit_taggable',
					   method: 'post',
					   postContent: dojo.json.serialize(objs),
					   contentType: 'text/json',
					   load: function(){ 
						   var colRight = dojo.byId('columnRight');
						   assetEdit('<div style="width:100%;text-align:center;padding:25px 0;">Loading...<br/><img src="'+axiom.staticPath + '/axiom/images/ajax-loader.gif" alt="Loading..." /></div>');
						   dojo.byId('columnLeft').style.display = 'block';
						   colRight.style.margin = axiom.oldLeftMargin;
						   fireLastQuery(); 
					   }
					 });
	}else{
		axiom.openModal({content: error_message});
	}
}

function resetForm(){
    var key = document.getElementById("keywords");
    key.value = "";
    
    var types = document.getElementById("types");
    types.options[0].selected = "selected";
}


dojo.addOnLoad(pageInit);
