/**
Copyright Siteworx, Inc.
Patrick Jones & Michael Trythall
*/

dojo.provide("axiom.widget.AssetSelector");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.io.IframeIO");

dojo.widget.defineWidget(
	"axiom.widget.AssetSelector",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		objectId:'',
		objectUrl: '',
		objectData: null,
		pathField:null,
		idField:null,
		remote:null,
		assetType:null,
		required:null,

		noassetbutton:null,
		selectassetbutton:null,
		resetassetbutton:null,
		previewcontainer:null,
		widgetInterface:'picker',
		instanceName:'',
		
		width: '',
		height: '',
		filesize: '',
		altText: '',
		filename: '',
		previewImg: '',
		
		current_asset:null,
		original_asset:null,

		// points to node on right side
		rightside:null,
		leftside:null,

		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/AssetSelector.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/AssetSelector.css'),

		//Contains strings for use in widget
		strings:{
			instructions:"Use the keyword search box to the left to search or you may add a new item to the asset library by uploading a new file.",
			search:"Search",
			searchLabel:"Keyword(s):",
			searchHelp:"Searches title, file name and content of document types.",
			searchTitle:{
				Image:"Image Search",
				Document:"Document Search",
				Audio:"Audio Search",
				Video:"Video Search",
				Other:"File Search",
				All:"File Search"
			},
			searchResultInst:"Click an icon to select:",
			searchNoResults:"Sorry, your search returned no results.",
			errorSelectItem:"Please select an item first.",
			errorSelectImage:"Please select a valid image type.",
			tagIconTitle:"Tags",
			addItem:"Add Item",
			uploadLabel:"File to upload:",
			uploadButton:"Browse...",
			closeButton:"Cancel",
			nextButton:"Next >",
			no_image:"No Asset To Display",
			tag_selector:"CMSTag Selector",
			tag_selector_inst:"Choose the appropriate tags:",
			cancel:"Cancel",
			continueStr:"Continue",
			editTitle: "Specifications",
			editFilenameLabel: "Filename: ",
			editSizeLabel: "Size: ",
			editDimensionsLabel: "Dimensions: ",
			editLinkLabel: "Link/URL",
			editLinkSubText: "Type a URL or click the Insert Link icon to select from the site tree.",
			editWindowCheckLabel: "Open in new window",
			editaltFieldLabel: "Alternate Text: ",
			editWidthLabel: "Width:",
			editHeightLabel: "Height: ",
			editHSpaceLabel: "HSpace:",
			editVSpaceLabel: "VSpace:",
			editAlignLabel: "Align:",
			editAlignValues: [
				{name: "None", value: ""},
				{name: "Left", value: "left"},
				{name: "Abs Bottom", value: "absbottom"},
				{name: "Abs Middle", value: "absmiddle"},
				{name: "Baseline", value: "baseline"},
				{name: "Bottom", value: "bottom"},
				{name: "Middle", value: "middle"},
				{name: "Right", value: "right"},
				{name: "Text Top", value: "texttop"},
				{name: "Top", value: "top"}]
		},

		postCreate:function() {
			var cAsset=this.createFormElement('input','hidden',this.id,'');
			cAsset.id = this.id;
			if(this.required) { cAsset.className = "validate-empty"; }
			this.domNode.appendChild(cAsset);
			this.current_asset = cAsset;

			if(this.objectData){
				this._setPreview(this.objectData);
				this._setCurrentAsset(this.objectData);
				this.original_asset = this.objectData;
			} else {
				this._setPreview();
			}
			
			if(this.widgetInterface == 'picker') {
				//Since no image selected for now
				dojo.event.kwConnect({
					srcObj:this.noassetbutton,
					srcFunc:'onclick',
					adviceObj:this,
					adviceFunc:'noasset'});
				dojo.event.kwConnect({
					srcObj:this.selectassetbutton,
					srcFunc:'onclick',
					adviceObj:this,
					adviceFunc:'selectasset'});
				dojo.event.kwConnect({
					srcObj:this.resetassetbutton,
					srcFunc:'onclick',
					adviceObj:this,
					adviceFunc:'resetasset'});
			} else if(this.widgetInterface == 'wysiwyg') {
				dojo.dom.destroyNode(this.domNode);
			}
		},

		/** Clears any selected asset out 
			- updates preview, and updates field */
		noasset:function() {
			this._setPreview();
			this.current_asset.value = '';
			return false;
		},

		/** Get/Set path to current asset as string */
		_setCurrentAsset:function(s){
			this.current_asset.value = s.path.substring(s.path.lastIndexOf('/',0));
			this.height = s.height;
			this.width = s.width;
			this.filename = s.filename;
			this.filesize = s.filesize+'KB';
			this.previewURL = s.preview;
			axiom.dirtyProps[this.current_asset.name] = true;
		},
		_getCurrentAsset:function(){return this.current_asset.value;},

		selectasset:function() {
			var outer,dialog,inner,closebutton;
			dialog=this._getDialog();
			var widgetRef = this;

			outer = document.createElement('div');
			outer.className = 'content';
			inner = document.createElement('div');
			inner.className = 'body';
			closebutton = document.createElement('img');
			closebutton.className = 'asset_close';
			closebutton.src = axiom.staticPath + '/axiom/images/button_close.gif';
			closebutton.onclick = function() { widgetRef._closeDialog(); };
			
			/** ***************** */
			/** Screen #1         */
			var instructions,bodyRight,controls;

			controls=this._makeSidebar();
			bodyRight=document.createElement('div');
			bodyRight.className="bodyRight";
			instructions=document.createElement('p');
			instructions.innerHTML=this.strings.instructions;
			bodyRight.appendChild(instructions);

			// Update pointer
			this.rightside=bodyRight;
			this.leftside=controls;

			inner.appendChild(closebutton);
			inner.appendChild(controls);
			inner.appendChild(bodyRight);

			outer.appendChild(inner);
			dialog.setContent(outer);
			dialog.show();

			// Setup FormBind for the search form
			var search = new dojo.io.FormBind({
				formNode:dojo.byId('assetSelectorSearch_Form'),
				mimetype:'text/json',
				load:function(type,data,evt){
					widgetRef._processResults(data,dojo.byId('assetSelectorSearch_Form'));
				}
			});


			// Setup FormBind for the image uploading form
			var upload = new dojo.io.FormBind({
				formNode:dojo.byId('assetSelectorDialog_Form'),
				mimetype:'text/html',
				load:function(type,data,evt){
					dojo.byId("assetSelectorDialog_Form").reset();
					dojo.html.getElementsByClass("bodyRight",dojo.byId('assetSelectorDialog'),"div")[0].innerHTML = data.body.innerHTML;
				}
			});

			// Validation for Upload Form
			upload.onSubmit = function() {
				return widgetRef._validateUpload();
			}

			return false;
		},

		resetasset:function() {
			if(this.original_asset){
				this._setCurrentAsset(this.original_asset);
				this._setPreview(this.original_asset); 
			} else {
				this.noasset();
			}
			return false;
		},

		/** Sets the preview image
			-Only used for 'picker' style widget */
		_setPreview:function(o){
			/** Configure max dimensions of preview
				-We're locked to 200 for previewmaxwidth basically
				because that's the size of the actual preview */
			var maxheight=140,maxwidth=280,previewmaxwidth=200;
			if(typeof(o)!='undefined') {
				var imgsrc,previewimg=document.createElement('img'),previewfile=document.createElement('p');
				var height,width;
				if(o.height < maxheight && o.width < maxwidth) { 
					// Show real image
					imgsrc=(this.assetType=="Image")?o.hopobjHref:o.thumb_on; // Display image or thumbnail icon depending on asset type
				} else { 
					if (o.height/o.width > (maxheight/previewmaxwidth)) {
						//Go by height
						var height=maxheight,width;
						width=(height/o.height)*o.width;
					}else{
						//width
						var width=previewmaxwidth,height;
						height=(width/o.width)*o.height;
					};
					
					imgsrc=(o.preview!="null")?o.preview:o.thumb_on; // Display image or thumbnail icon depending on asset type
				};
				previewimg.src=imgsrc;
				if(typeof(height)!='undefined' && typeof(width)!='undefined') {
					previewimg.width=width;
					previewimg.height=height;
				};
				previewfile.innerHTML = o.filename;
			}else {
				var previewimg=document.createElement('p');
				previewimg.innerHTML=this.strings.no_image;
			};
			this.previewcontainer.innerHTML='';	
			this.previewcontainer.appendChild(previewimg);
			if(previewfile) { this.previewcontainer.appendChild(previewfile); }

		},

		/** Returns 'asset' node to display in search results.
			Expects objects from search result array */
		_makeAsset:function(o) {
			// There will be conditionals throughout based on assetType
			var container,thumbcont,thumb,title,filename,widgetRef=this;
			container = document.createElement('div');
			dojo.lang.mixin(container,{className:'asset',
				onmouseover:function(){dojo.html.addClass(this,'hover');},
				onmouseout:function(){dojo.html.removeClass(this,'hover');},
				onclick:function(){
					if(widgetRef.widgetInterface == 'wysiwyg') {
						widgetRef._setCurrentAsset(o);
						if(widgetRef.assetType=='Image') {
							widgetRef.showImageConfigView(o);
						} else {
							widgetRef.insertFile(o);
						}
					} else {
						widgetRef._setCurrentAsset(o);
						widgetRef._setPreview(o);
						widgetRef._closeDialog();
					}
				}});
			title=document.createElement('h4');
			title.innerHTML=o.title;
			filename=document.createElement('p');
			filename.innerHTML='('+ (o.filename.length > 25 ? o.filename.substring(0,23)+'...' : o.filename)+')';
			filename.title = o.filename;
			filename.alt = o.filename;
			thumbcont=document.createElement('div');
			thumb=document.createElement('img');
			thumb.src=o.thumb_on;
			thumbcont.appendChild(thumb)
			container.appendChild(title);
			container.appendChild(filename);
			container.appendChild(thumbcont);

			return container;
		},

		/** Gets tags and shows tag selection screen */
		_showTags:function(newasset){
			//Get Tags
			var tagdata;
			dojo.io.bind({
					 url:axiom.appPath+"cms/getAllTags?noCache="+(new Date()).getTime(),
				method:"get",
				load:function(load,data,e){tagdata=data;},
				error:function(load,data,e){/** are we logging errors somewhere? */},
				mimetype:'text/javascript',
				sync:true
			});
			if(typeof(tagdata)!='undefined') {
				var i,tagInterface,tagField,tagInput,tagLabel,tags,continueButton,cancelButton,widgetRef=this,tag_selector,tag_selector_inst,tagContainer,buttonWrap,hasChecks=false;
				tags=document.createDocumentFragment();
				tagInterface=document.createElement('div');
				tagInterface.className='tagInterface';
				for(i in tagdata){
					hasChecks=true;
					var cleanID=tagdata[i].title.replace(/\"/g,'').replace(/\s/g,'_');
					tagField=document.createElement('fieldset');
					tagInput=this.createFormElement('input','checkbox','tag_'+cleanID,tagdata[i].title); // Value?
					tagInput.className='cb';
					tagInput.id='tag_'+cleanID;
					tagLabel=document.createElement('label');
					tagLabel.setAttribute('for','tag_'+cleanID);
					tagLabel.innerHTML=tagdata[i].title;
					tagField.appendChild(tagInput);
					tagField.appendChild(tagLabel);
					tags.appendChild(tagField);
				};
				tagContainer=document.createElement('form');
				tagContainer.className="tags";
				tagContainer.appendChild(tags);
				tag_selector=document.createElement('h3');
				tag_selector.innerHTML=this.strings.tag_selector;
				tag_selector_inst=document.createElement('p');
				tag_selector_inst.innerHTML=this.strings.tag_selector_inst;
				tagInterface.appendChild(tag_selector);
				tagInterface.appendChild(tag_selector_inst);
				tagInterface.appendChild(tagContainer);
				cancelButton=document.createElement('a');
				dojo.lang.mixin(cancelButton,{href:'javascript:void(0)',className:'button form-button',innerHTML:this.strings.cancel,
					onclick:function(){
						dojo.dom.removeNode(tagInterface);
						widgetRef.leftside.style.display='';
						widgetRef.rightside.style.display='';
					}});
				continueButton=document.createElement('a');
				dojo.lang.mixin(continueButton,{href:'javascript:void(0)',className:'button form-button',innerHTML:this.strings.continueStr});
				if(newasset) {
					continueButton.onclick=function(){
						var tagValues=[];
						var tagInputs=tagInterface.getElementsByTagName('input');
						for(var i=0;i<tagInputs.length;i++){
							if(tagInputs[i].checked){
								tagValues.push(tagInputs[i].value);
							}
						}
						dojo.byId('new-tags').value = tagValues.join(',');
						dojo.dom.removeNode(tagInterface);
						widgetRef.leftside.style.display='';
						widgetRef.rightside.style.display='';
					}
				} else {
					continueButton.onclick=function(){
						var left=widgetRef.leftside;
						var searchForms=dojo.html.getElementsByClass('searchForm',left,'form');
						if(searchForms.length>0){ // Just in case
							var searchForm=searchForms[0];
							var searchArr=[];
							var tagInputs=tagInterface.getElementsByTagName('input');
							for(var i=0;i<tagInputs.length;i++){
								if(tagInputs[i].checked){
									searchArr.push('tag:"'+tagInputs[i].value+'"');
								};
							};
							searchForm.keywords.value=searchArr.join(' ');
							dojo.io.bind({
								formNode:searchForm,
								mimetype:'text/json',
								load:function(type,data,evt){
									widgetRef._processResults(data,searchForm);
								}
							});
							dojo.dom.removeNode(tagInterface);
							widgetRef.leftside.style.display='';
							widgetRef.rightside.style.display='';
						};
					}
				}
				buttonWrap=document.createElement('div');
				buttonWrap.className="pagination";
				buttonWrap.appendChild(continueButton);
				buttonWrap.appendChild(cancelButton);
				tagInterface.appendChild(buttonWrap);
				this.rightside.style.display='none';
				this.leftside.style.display='none';
				this.rightside.parentNode.appendChild(tagInterface);
				if(hasChecks==true){continueButton.focus();};
			};
		},

		createFormElement:function(tag,type,name,value) {
			var input;
			var typeAttr = type?' type="'+type+'"':'';
			var nameAttr = name?' name="'+name+'"':'';
			var valueAttr = value?' value="'+value+'"':'';
			if(dojo.render.html.ie) { // Can't set name attribute in IE
				input = document.createElement('<'+tag+' '+typeAttr+nameAttr+valueAttr+'>');
			} else {
				input = document.createElement(tag);
				input.type = type;
				input.name = name;
				input.value= value;
			}
			return input;
		},

		/** Generates and returns sidebar
			keywords <string> : Auto populates keyword field with this value.
		*/
		_makeSidebar:function(keywords){
			var thisWidget = this;
			var controls=document.createElement('div');
			controls.className="columnLeftAssetSelector";

			var buffer=[];
			buffer[buffer.length] = '<form action="'+axiom.cmsPath+'search_assets" id="assetSelectorSearch_Form" class="searchForm" method="post">';
			buffer[buffer.length] = '<h3>'+this.strings.searchTitle[this.assetType]+'</h3>';
			buffer[buffer.length] = '<input type="hidden" name="types" value="'+this.assetType+'"/>';
			buffer[buffer.length] = '<input type="hidden" name="sort" value="alpha"/>';
			buffer[buffer.length] = '<input type="hidden" name="batch_size" value="9"/>';
			buffer[buffer.length] = '<label for="ar_keywords">'+this.strings.searchLabel+'</label>';
			buffer[buffer.length] = '<img src="'+axiom.staticPath+'/axiom/images/icon_tags.gif" title="Tags" alt="Tags" onclick="var widget=dojo.widget.byId(\''+thisWidget.id+'\');widget._showTags.apply(widget);"/>';
			buffer[buffer.length] = '<input class="txtfield" type="text" id="ar_keywords" name="keywords"/>';
			buffer[buffer.length] = '<p class="help">'+this.strings.searchHelp+'</p>';
			buffer[buffer.length] = '<input class="button" type="submit" name="" value="'+this.strings.search+'"/>';
			buffer[buffer.length] = '</form>';
			buffer[buffer.length] = '<div class="seperator"></div>';
			buffer[buffer.length] = '<h3>Add Item</h3>';
			buffer[buffer.length] = '<form action="'+axiom.cmsPath+'upload?assetselect=true&assetid='+this.id+'" enctype="multipart/form-data" id="assetSelectorDialog_Form" method="post" name="upload_file">';
			buffer[buffer.length] = '<label>File to upload:</label>';
			// Kludge for getting Uploading working in IE6 -- requires the old regular file input
			if(dojo.render.html.ie) {
				buffer[buffer.length] = '<input id="assetSelectorDialog_Upload" class="file_dialog" type="file" onkeydown="return false" name="file"/>';				
			} else {
				buffer[buffer.length] = '<input type="text" id="assetSelectorDialog_UploadText" readonly="true" />';
				buffer[buffer.length] = '<div class="browse-wrapper"><a href="javascript:void(0)" class="button form-button">'+this.strings.uploadButton+'</a><input id="assetSelectorDialog_Upload" type="file" name="file" onchange="dojo.byId(\'assetSelectorDialog_UploadText\').value=this.value" /></div>';
			}
			buffer[buffer.length] = '<input type="submit" value="'+this.strings.nextButton+'" class="button" />';
			buffer[buffer.length] = '</form>';
			controls.innerHTML = buffer.join('');

			return controls;
		},

		_validateUpload:function(){
			var filename = dojo.string.trim(dojo.byId('assetSelectorDialog_Upload').value);
			var extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
			if(!filename) {
				axiom.openModal({content:this.strings.errorSelectItem});
				return false;
			}
			if(this.assetType=="Image") {
				var validexts = ['.gif','.jpg','.jpeg','.bmp','.png','bmp'];
				if(!dojo.lang.inArray(validexts,extension)) {
					axiom.openModal({content:this.strings.errorSelectImage});
					return false;
				}
			}
			return true;
		},

		saveNewUpload:function(obj_url,obj_id,widget_id) {
			var widgetRef = dojo.widget.byId(widget_id);
			var errors = false;
			var formdata = axiom.getFormData('newasset_'+widget_id, true);
			var titlefieldset = dojo.html.getElementsByClass("asset-title",dojo.byId("assetSelectorDialog"),"fieldset")[0];
			var titleErrorDiv = dojo.html.getElementsByClass("error_message",titlefieldset,"div")[0];
			var tagsfieldset = dojo.html.getElementsByClass("asset-tags",dojo.byId("assetSelectorDialog"),"fieldset")[0];
			var tagsErrorDiv = dojo.html.getElementsByClass("error_message",tagsfieldset,"div")[0];
			if(formdata.title=="") {
				titleErrorDiv.style.display="block";
				errors = true;
			} else { titleErrorDiv.style.display="none"; }
			if(errors) { return false; }
			wrapper = {};
			wrapper[obj_id] = formdata;
			formdata = wrapper;

			dojo.io.bind({
				url:obj_url+'/edit_taggable',
				load: function(type,data,evt) {
					widgetRef.rightside.innerHTML = '<p>Your item has been added</p>'
					var assets = document.createElement("div");
					assets.className = "assets";
					widgetRef.rightside.appendChild(assets);
					dojo.io.bind({
						url:obj_url+'/getAssetObject',
						method:'get',
						mimetype:'text/json',
						load:function(type,data,evt){ assets.appendChild(widgetRef._makeAsset(data)); }
					});

//					dojo.widget.byId(widget_id).resetResults(widget_id); 
				},
				postContent: dojo.json.serialize(formdata),
				preventCache: true,
				contentType: 'text/json',
				method: 'post'
			});

		},

		cancelNewUpload:function(obj_path,widget_id) {
			dojo.io.bind({
				url:obj_path + "/cms_delete",
				method:"GET",
				mimetype:"text/json",
				load: function(type,data,evt) { dojo.widget.byId(widget_id).resetResults(widget_id); },
				sync:true
			});
		},

		resetResults:function(widget_id) {
			var widgetRef = dojo.widget.byId(widget_id);
			var searchForm = dojo.byId('assetSelectorSearch_Form');
			var url = axiom.appPath+'cms/search_assets?keywords=&types='+widgetRef.assetType+'&sort=alpha&batch_size=9';
			dojo.io.bind({
				url:url,
				method:'post',
				load:function(type,data,evt) { widgetRef._processResults(data,searchForm); },
				error:function(type,data,evt) {},
				mimetype:'text/javascript'
			});
		},

		/** Takes JSON from search service, and form node where search took place
			-Creates all the necessary pagination controls and hooks it all up. */
		_processResults:function(data,form){
			if(data.total > 0) { 
				var len,datas=[],i,asset,assets,instruct,numPages,pageNum=1,pages=[],showPage,showNextPage,showPrevPage,next,prev,pagination,currentPageOfPages,widgetRef=this;

				/** Original form submission details in case
					we need to get the next page. */
				var sKeywords,sTypes,sBatch,sSort,sUrl;
				sKeywords = form.keywords.value;
				sBatch = form.batch_size.value;
				sTypes = form.types.value;
				sSort = form.sort.value;
				sUrl = form.action+'?keywords='+sKeywords+'&batch_size='+sBatch+'&sort='+sSort+'&types='+sTypes;

				numPages=parseInt(data.total/9,10);
				numPages=(data.total%9==0)?numPages:numPages+1;
				showPrevPage=function(){
					if(pageNum>1){
						pageNum--;
						showPage.call(widgetRef);
					};
				};
				showNextPage=function(){
					if(pageNum<numPages){
						pageNum++;
						showPage.call(widgetRef);
					};
				};
				showPage=function(){
					if(typeof(datas[pageNum-1])=='undefined') {
						//Go get data
						dojo.io.bind({
							url:sUrl+'&page_num='+pageNum,
							method:form.method,
							load:function(load,data,e){datas[pageNum-1]=data;},
							error:function(load,data,e){/** uh-oh */},
							mimetype:'text/javascript',
							sync:true
						});
					};
					if(typeof(pages[pageNum-1])=='undefined' || dojo.render.html.ie){
						//Generate assets and put document fragment in pages array
						pages[pageNum-1] = document.createElement('div');
						pages[pageNum-1].className='assets';
						// Was using documentFragment, but it's empty after appending it to the page
						len=datas[pageNum-1].objs.length;
						for(i=0;i<len;i++) {
							var asset=widgetRef._makeAsset(datas[pageNum-1].objs[i]);
							pages[pageNum-1].appendChild(asset);
						};
					};
					widgetRef.rightside.innerHTML='';
					currentPageOfPages.innerHTML="Page "+pageNum+" of "+numPages;
					widgetRef.rightside.appendChild(pages[pageNum-1]);
					next=document.createElement('a');
					dojo.lang.mixin(next,{href:'javascript:void(0)',onclick:showNextPage,innerHTML:'&gt;',className:'button form-button'});
					prev=document.createElement('a');
					dojo.lang.mixin(prev,{href:'javascript:void(0)',onclick:showPrevPage,innerHTML:'&lt;',className:'button form-button'});
					pagination.innerHTML = '';
					pagination.appendChild(prev);
					pagination.appendChild(currentPageOfPages);
					pagination.appendChild(next);
					if(numPages>1){widgetRef.rightside.appendChild(pagination);};
				};
				instruct=document.createElement('p');
				instruct.innerHTML=this.strings.searchResultInst;
				currentPageOfPages=document.createElement('span');
				pagination=document.createElement('p');
				pagination.className='pagination';
				datas.push(data);
				showPage();
			}else{
				var result=document.createElement('p');
				result.innerHTML=this.strings.searchNoResults;
				this.rightside.innerHTML='';
				this.rightside.appendChild(result);
			}; 
		},
		
		showImageConfigView:function(o) {
			var outer,dialog,inner,widgetRef;
			widgetRef = this;
			dialog=this._getDialog();

			outer = document.createElement('div');
			outer.className = 'content';
			inner = document.createElement('div');
			inner.className = 'body';
			inner.id = "asset_image_selector";
			
			/** ***************** */
			/** Screen #2        */
			var thumb_preview = document.createElement('div');
			thumb_preview.className = 'thumb_preview';
			
			// current file properties
			var previewImg = document.createElement('img');
			previewImg.src = this.previewURL;
			previewImg.alt = this.filename;
			
			var specs = document.createElement('div');
			specs.innerHTML = 'Specifications';
			
			var attrList = document.createElement('ul');
			var filename = document.createElement('li');
			var size = document.createElement('li');
			var dimensions = document.createElement('li');
			
			filename.innerHTML = '<strong>'+this.strings.editFilenameLabel+'</strong> '+ this.filename;
			size.innerHTML = '<strong>'+this.strings.editSizeLabel+'</strong> ' + this.filesize;
			dimensions.innerHTML = '<strong>'+this.strings.editDimensionsLabel+'</strong> ' + this.width + 'x' + this.height;
			
			attrList.appendChild(filename);
			attrList.appendChild(size);
			attrList.appendChild(dimensions);
			
			thumb_preview.appendChild(previewImg);
			thumb_preview.appendChild(specs);
			thumb_preview.appendChild(attrList);
			
			inner.appendChild(thumb_preview);
			
			var editform = document.createElement('form');
			editform.className = 'asset_image_form';
			editform.action = 'javascript:void(0)';

			// link/url field
			var editformTitle = document.createElement('h3');
			editformTitle.innerHTML = 'Image Attributes'; 
			
			var linkurlFieldset = document.createElement('fieldset');
			linkurlFieldset.className = "linkurl";
		
			var linkurl = this.createFormElement('input','text',this.objectId+'_linkurl','');
			linkurl.id = this.objectId +"_linkurl";
			linkurl.className = "linkurlTextbox";
			
			var linkurlSubText = document.createElement('span');
			linkurlSubText.className = "subtext";
			linkurlSubText.innerHTML = this.strings.editLinkSubText;
			
			var linkurlLabel = document.createElement('label');
			linkurlLabel['for'] = linkurl.id;
			linkurlLabel.innerHTML =  this.strings.editLinkLabel;
			
			var linker = document.createElement('a');
			linker.href = "javascript:void(0);"
			linker.onclick = function() {widgetRef.showLinker();}
			linker.innerHTML = '<img src="'+widgetRef.appPath+'static/axiom/images/icon_link.gif" alt="Link" />';
			
			var newWindowCheck = this.createFormElement('input','checkbox',this.objectId+'_windowcheck','');
			newWindowCheck.id = this.objectId+'_windowcheck';
			newWindowCheck.className = 'cb';
			
			var newWindowCheckLabel = document.createElement('label');
			newWindowCheckLabel['for'] = newWindowCheck.id;
			newWindowCheckLabel.className = "windowCheckLabel";
			newWindowCheckLabel.innerHTML = this.strings.editWindowCheckLabel;
			
			linkurlFieldset.appendChild(linkurlLabel);
			linkurlFieldset.appendChild(linkurl);
			linkurlFieldset.appendChild(linker);
			linkurlFieldset.appendChild(linkurlSubText);
			linkurlFieldset.appendChild(newWindowCheckLabel);
			linkurlFieldset.appendChild(newWindowCheck);
			
			var altFieldset = document.createElement('fieldset');
			altFieldset.className = "altdesc";
			
			var altField = this.createFormElement('input','text',this.objectId+'_altfield',o.altText);
			altField.id = this.objectId +"_altfield";
			
			var altFieldLabel = document.createElement('label');
			altFieldLabel['for'] = altField.id;
			altFieldLabel.innerHTML =  this.strings.editaltFieldLabel;
			
			altFieldset.appendChild(altFieldLabel);
			altFieldset.appendChild(altField);
			
			editform.appendChild(editformTitle);
			editform.appendChild(linkurlFieldset);
			editform.appendChild(altFieldset);
			
			// width/height
			var widthheightFieldset = document.createElement('fieldset');
			widthheightFieldset.className = "widthheight";
						
			var width = this.createFormElement('input','text',this.objectId+'_image_width',o.width);
			width.id = this.objectId +"_image_width";
			
			var widthFieldset = document.createElement('fieldset');
			widthFieldset.appendChild(width);
			
			var height = this.createFormElement('input','text',this.objectId+'_image_height',o.height);
			height.id = this.objectId +"_image_height";
			
			var widthLabel = document.createElement('label');
			widthLabel['for'] = width.id;
			widthLabel.innerHTML = this.strings.editWidthLabel;
			
			var widthFieldset = document.createElement('fieldset');
			widthFieldset.appendChild(widthLabel);
			widthFieldset.appendChild(width);
			
			var heightLabel = document.createElement('label');
			heightLabel['for'] = height.id;
			heightLabel.innerHTML =this.strings.editHeightLabel;
			
			var heightFieldset = document.createElement('fieldset');
			heightFieldset.appendChild(heightLabel);
			heightFieldset.appendChild(height);
			
			widthheightFieldset.appendChild(widthFieldset);
			widthheightFieldset.appendChild(heightFieldset);
			
			editform.appendChild(widthheightFieldset);
			
			// hspace/vspace
			var hvspaceFieldset = document.createElement('fieldset');
			hvspaceFieldset.className = "hvspace";
			
			var hspace = this.createFormElement('input','text',this.objectId+'_image_hspace','');
			hspace.id = this.objectId +"_image_hspace";
			
			var vspace = this.createFormElement('input','text',this.objectId+'_image_vspace','');
			vspace.id = this.objectId +"_image_vspace";
			
			var hspaceLabel = document.createElement('label');
			hspaceLabel['for'] = hspace.id;
			hspaceLabel.innerHTML = this.strings.editHSpaceLabel;
			
			var vspaceLabel = document.createElement('label');
			vspaceLabel['for'] = vspace.id;
			vspaceLabel.innerHTML = this.strings.editVSpaceLabel;
			
			var hpspaceFieldset = document.createElement('fieldset');
			hpspaceFieldset.appendChild(hspaceLabel);
			hpspaceFieldset.appendChild(hspace);
			
			var vspaceFieldset = document.createElement('fieldset');
			vspaceFieldset.appendChild(vspaceLabel);
			vspaceFieldset.appendChild(vspace);
			
			hvspaceFieldset.appendChild(hpspaceFieldset);
			hvspaceFieldset.appendChild(vspaceFieldset);
			
			editform.appendChild(hvspaceFieldset);

			// align
			var alignFieldset = document.createElement('fieldset');
			alignFieldset.className = 'alignment';
			
			var align = document.createElement('select');
			align.id = this.objectId +"_image_align";
			var option = null;
			for(var i=0;i<this.strings.editAlignValues.length;i++) {
				option = document.createElement('option');
				option.value = this.strings.editAlignValues[i].value;
				option.innerHTML = this.strings.editAlignValues[i].name;
				align.appendChild(option);
			}
			
			var alignLabel = document.createElement('label');
			alignLabel['for'] = align.id;
			alignLabel.innerHTML = this.strings.editAlignLabel;
			
			alignFieldset.appendChild(alignLabel);
			alignFieldset.appendChild(align);
			
			editform.appendChild(alignFieldset);
			
			var submitButton = document.createElement('a');
			submitButton.innerHTML = 'OK';
			submitButton.className = 'button form-button';
			submitButton.href = 'javascript:void(0)';
			submitButton.onclick = function(){
				var href, alt, width, height, hspace, vspace, align, obj, form, newwin;
				obj = widgetRef.objectId;
				form = this.parentNode;
				href = dojo.byId(obj+'_linkurl').value;
				target = dojo.byId(obj+'_windowcheck').checked?' target="_blank"':'';
				alt = dojo.byId(obj+'_altfield').value?' alt="'+dojo.byId(obj+'_altfield').value+'"':'';
				height = dojo.byId(obj+'_image_height').value?' height="'+dojo.byId(obj+'_image_height').value+'"':'';
				width = dojo.byId(obj+'_image_width').value?' width="'+dojo.byId(obj+'_image_width').value+'"':'';
				hspace = dojo.byId(obj+'_image_hspace').value?' hspace="'+dojo.byId(obj+'_image_hspace').value+'"':'';
				vspace = dojo.byId(obj+'_image_vspace').value?' vspace="'+dojo.byId(obj+'_image_vspace').value+'"':'';
				align = dojo.byId(obj+'_image_align').value?' align="'+dojo.byId(obj+'_image_align').value+'"':'';
				
				var output = '';
				if(href) { output+='<a href="'+href+'"'+target+'>'; }
				output+='<img src="'+widgetRef.current_asset.value+'"'+alt+height+width+hspace+vspace+align+' border="0"/>';
				if(href) { output += '</a>'; }
				if(dojo.render.html.ie){
					var instance = window.parent.FCKeditorAPI.GetInstance(widgetRef.instanceName);
					instance.EditorWindow.focus();
					instance.EditorDocument.selection.createRange().pasteHTML(output);
				} else {
					window.parent.FCKeditorAPI.GetInstance(widgetRef.instanceName).InsertHtml(output);
				}
				widgetRef._closeDialog();				
			};

			var cancelButton = document.createElement('a');
			dojo.lang.mixin(cancelButton,{
						innerHTML:'Cancel',
						className:'button form-button',
						href:'javascript:void(0)',
						onclick:function(){
							widgetRef._closeDialog();
						}});

			var buttonDiv = document.createElement('div');
			buttonDiv.className = "controls";
			buttonDiv.appendChild(submitButton);
			buttonDiv.appendChild(cancelButton);
			
			editform.appendChild(buttonDiv);
			/** ***************** */
			
			inner.appendChild(editform);

			outer.appendChild(inner);
			dialog.setContent(outer);
			dialog.show();

			return false;
		},

		insertFile:function(o){
			var widgetRef = this;
			if(dojo.render.html.ie){
				var instance = window.parent.FCKeditorAPI.GetInstance(widgetRef.instanceName);
				instance.EditorWindow.focus();
				instance.EditorDocument.selection.createRange().pasteHTML('<a href="'+o.path+'">'+o.title + ' '+ o.filesize + '</a>');
			} else {
				var output=document.createElement("a");
				output.href = o.path;
				output.innerHTML = o.title + " " + o.filesize + "KB";
				window.parent.FCKeditorAPI.GetInstance(widgetRef.instanceName).InsertElement(output);
			}
			widgetRef._closeDialog();
		},

		
		showLinker:function() {
			dialog=this._getDialog();
			dialog.hide();
			var widgetRef = this;
			axiom.browsetable.multiple = false;
			axiom.browsetable.property = this.objectId;
			axiom.browsetable.defaultValue = this.objectId;
			axiom.browsetable.defaultValues = [];
			axiom.browsetable.setCallBack = function(a,b){
				var url = widgetRef.appPath.substring(0,widgetRef.appPath-1) + b[1].uri;
				var objRef = widgetRef.objectId +"_linkurl";
				dojo.byId(objRef).value = url;
				dialog.show();
			}
			axiom.browsetable.exitCallBack = function(){axiom.browsemodal.hide();}
			axiom.browsetable.callingWidget = this;
			axiom.browsetable.setContext('assetselector');
			axiom.browsetable.toggleHrefValues();
			axiom.browsetable.searchURL = '/' + axiom.ctable.searchURL;
			axiom.browsecfilter.resetTargetTypes();
			axiom.browsecfilter.search(null, null, null, 12);
			axiom.browsemodal.show();
		},
	
		/** Returns the dialog widget used for this widget
			Makes one if necessary */
		_getDialog:function() {
			var dialog = dojo.widget.byId('assetSelectorDialog');
			if (typeof(dialog)=='undefined') {
				var dialogHolder=document.createElement('div');
				this.domNode.appendChild(dialogHolder);
				dialog=dojo.widget.createWidget('Dialog',{id:'assetSelectorDialog'},dialogHolder);

			}
			return dialog;
		},

		/** Closes dialog */
		_closeDialog:function() {
			var dialog=dojo.widget.byId('assetSelectorDialog');
			dialog.setContent('');
			dialog.hide();
		}
	}
);
