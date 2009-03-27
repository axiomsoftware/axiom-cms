/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


dojo.provide("axiom.widget.Asset");

dojo.require("dojo.lang.common");
dojo.require("dojo.lfx.*");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.Asset",
	dojo.widget.HtmlWidget,
	function(){},
	{
		id:'',
		title:'',
		filename:'',
		icon:'',
		appPath:'',
		contentType:'',
		thumb_on: '',
		thumb_off: '',
		width: '',
		height: '',
		path: '',
		imgPath: axiom.staticPath+'/axiom/widget/resources/images/',
		filesize: '',
		hopobjHref: '',
		rootHref: '',
		altText: '',
		staticPath: axiom.staticPath,
		loadThumbsFunction: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/Asset.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/Asset.css'),
		lock: false,
		zoomVisible: false,
		tagVisible: false,
		editVisible: false,
		widgetsInTemplate: true,
		mouseOver: false,
		allTags: [],
		searchTags: [],
		nodeOff: function(node){
			dojo.lfx.html.fadeOut(node, 300, undefined, function(){node.style.display = 'none';}).play();
			this.lock = false;
		},
		nodeOn: function(node){
			node.style.opacity = "0.0";
			node.style.display = 'block';
			dojo.lfx.html.fadeIn(node, 300).play();
			this.lock = true;
		},
		stopPropagation: function(evt){
			if (!evt)
				var evt = window.event;
			evt.cancelBubble = true;
			if (evt.stopPropagation) evt.stopPropagation();
		},
		allOff: function(){
			if(!this.mouseOver){
				if(this.lock) {this.lock = false; }
				this.onMouseOut(true, true);
			}
		},
		toggleEdit:function(e){
			this.stopPropagation(e);
			if(this.tagVisible){
				this.toggleTag();
			}
			if(this.zoomVisible){
				this.toggleZoom();
			}
			axiom.showingThumbs = false;
			current_thumbs = [];
			assetEdit(this.path+ 'asset_edit?noCache='+(new Date()).getTime(), true, false, this);
		},
		toggleZoom:function(e) {
			if(!(this.contentType && this.contentType.match(/^image/i)))
				return;
			if(this.zoomVisible){
				this.nodeOff(this.zoom);
			}
			else{
				if(this.tagVisible){
					this.toggleTag();
				}
				this.nodeOn(this.zoom);
			}
			this.zoomVisible = !this.zoomVisible;
		},
		toggleTag:function(e){
			if(this.tagVisible){
				this.nodeOff(this.tag);
			}
			else{
				if(this.zoomVisible){
					this.toggleZoom();
				}
				this.nodeOn(this.tag);
			}
			this.tagVisible = !this.tagVisible;
		},
		suicide:function(){
			dojo.io.bind({url:this.hopobjHref + 'cms_delete?full_removal=true',
				      load: fireLastQuery});
		},
		deleteObj:function(){
			axiom.openModal({content: 'Are you sure you want to delete this asset?<br/>This action cannot be undone.',
					 confirmdialog: true,
					 callback: dojo.lang.hitch(this, this.suicide)
  					 });
		},
		onMouseOver:function(){
			this.mouseOver = true;
			dojo.html.addClass(this.domNode, 'hover');
			var menu_items = this.actionMenu.getElementsByTagName('img');
			var len = menu_items.length;
			for(var i=0; i< len; i++){
				menu_items[i].style.display="inline";
			}
			this.thumbnail.style.display = 'none';
			this.thumbnailActive.style.display = 'block';
		},
		onMouseOut:function(evt, no_refresh){
			if(window.event) {window.event.cancelBubble = true;}
			this.mouseOver = false;
			if(!this.lock){
				if(this.tagVisible){
					this.tagVisible = false;
					this.tag.style.display = 'none';
				}
				if(this.zoomVisible){
					this.zoomVisible = false;
					this.zoom.style.display = 'none';
				}
				dojo.html.removeClass(this.domNode, 'hover');
				var menu_items = this.actionMenu.getElementsByTagName('img');
				var len = menu_items.length;
				for(var i=0; i< len; i++){
					menu_items[i].style.display="none";
				}
				if(!no_refresh){
					this.thumbnailActive.style.display = 'none';
					this.thumbnail.style.display = 'block';
				}
			}
		},
		postCreate:function(){
			if(this.filename.length > 20){
				var short_name = this.filename.substring(0,20) + '...';
				this.zoom_file_name.innerHTML = '('+short_name+')';
				this.title_file_name.innerHTML = '('+short_name+')';
			}
			var this_href = this.hopobjHref;
			var time = (new Date()).getTime();
 			this.icons = {on: this.thumb_on+'?'+time, off: this.thumb_off+'?'+time};
			this.thumbnail.src = this.icons.off;
			this.thumbnail.title = this.altText;
			this.thumbnailActive.src = this.icons.on;
			this.thumbnailActive.title = this.altText;

		    if(!(this.contentType && this.contentType.match(/^image/i))){
				this.zoomButton.src = this.staticPath+"/axiom/widget/resources/images/no_zoom_thumb.gif";
				this.zoomButton.title = "";
				this.zoomButton.style.cursor = "default";
			}
			if(this.preview){
				this.preview_thumb.src = this.preview+'?'+time;
			}
			if(this.width === "0" || this.height === "0"){
				this.dim.innerHTML = '';
			}
			if(this.allTags.length > 0){
				var localTags = this.searchTags;
				var tagContainer = this.tag;
				dojo.lang.forEach(this.allTags, function(tag){
							  var tagNode = document.createElement('a');
							  if(dojo.lang.inArray(localTags, tag)){
								  dojo.html.addClass(tagNode,'hasTag');
							  }
							  tagNode.href = "javascript:void(0);";
							  tagNode.innerHTML = tag;
							  tagContainer.appendChild(tagNode);
							  tagContainer.innerHTML += ' ';
						  });
			}
			var tagList = this.tag.getElementsByTagName('a');
			var len = tagList.length;
			for(var i=0; i<len; i++){
				dojo.event.kwConnect({srcObj: tagList[i],
						      srcFunc: 'onclick',
						      adviceObj: window,
						      adviceFunc: 'tagSearch' });
			}
			dojo.event.kwConnect({  srcObj:this.tag.getElementsByTagName('img')[0],
						srcFunc:'onclick',
						adviceObj:this,
						adviceFunc:'toggleTag'});
			dojo.event.kwConnect({  srcObj:this.domNode,
						srcFunc:'onmouseover',
						adviceObj:this,
						adviceFunc:'onMouseOver'});
			dojo.event.kwConnect({  srcObj:this.domNode,
						srcFunc:'onmouseout',
						adviceObj:this,
						adviceFunc:'onMouseOut'});
		}

	}
);
