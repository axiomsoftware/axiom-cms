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


function _fb_getPrototypeNames() {
	var names = app.__app__.getSearchablePrototypes();
	java.util.Collections.sort(names);
	return names.toArray();
}

function _fb_getCMSPrototypes() {
	var names = app.__app__.getCMSPrototypes();
	java.util.Collections.sort(names);
	return names.toArray();
}

function _fb_generateForm(prototype, widgetName, outputName, writeoption) {
	var outputFile = new java.io.File(app.__app__.getAppDir().getAbsolutePath() + java.io.File.separator + prototype + java.io.File.separator + outputName);
	if(!outputFile.exists()){
		var repositories = app.__app__.getRepositories();
		var iter = repositories.listIterator();
		while(iter.hasNext()){
			var repos = iter.next();
			if(repos instanceof Packages.axiom.framework.repository.FileRepository){
				var props_file = repos.getDirectory()+java.io.File.separator + prototype + java.io.File.separator + "prototype.properties";
				var file = new java.io.File(props_file);
				if(file.exists()){
					outputFile = repos.getDirectory()+java.io.File.separator + prototype + java.io.File.separator + outputName;
					break;
				}
			}
		}
	}
	XML.prettyPrinting = false;
	XML.ignoreComments = false;
	XML.ignoreWhitespace = false;
	this['_fb_'+writeoption](outputFile, this._fb_generate(prototype, (new CMSWidgetCatalog())));
}

function _fb_writeToFile(outputFile, xml){
	var w = new java.io.BufferedWriter(new java.io.FileWriter(new java.io.File(outputFile)));

	// switch old TAL based forms to TALE on the way out
    w.write(xml.toXMLString().replace(/xmlns:tal(out)?="http:\/\/axiom.com\/(talout)?"/g, "").replace('<div class="form"', '<div xmlns:tal="http://axiomstack.com/tale"').replace(/xmlns:tal="http:\/\/xml.zope.org\/namespaces\/tal"/g, 'xmlns:tal="http://axiomstack.com/tale"').replace(/(xmlns|xmlns:tal)="http:\/\/www.w3.org\/1999\/xhtml"/g, 'xmlns:tal="http://axiomstack.com/tale"'));
	w.close();
}

function _fb_readFromFile(file){
	var _buffer = [];
	var f = new java.io.File(file);
	if (!f.exists()) return null;
	var reader = new java.io.BufferedReader(new java.io.FileReader(f));
	var line = '';
	while( line !== null ){
		_buffer.push(line);
		line = reader.readLine();
	}
	reader.close();
	return new XMLList(_buffer.join("\n"));
}

function _fb_overwrite(outputFile, xml){
	this._fb_writeToFile(outputFile, xml);
}

function _fb_append(outputFile, xml){
	var file_xml = this._fb_readFromFile(outputFile);
	var widgets = xml..*.(@id.toString().match(/^ax-/));
	for each(widget in widgets){
		if( !file_xml..*.(@id == widget.@id)[0] )
			file_xml.fieldset[widget.name()] += widget;
	}
	this._fb_writeToFile(outputFile, file_xml);
}

function _fb_regen(outputFile, xml){
	var file_xml = this._fb_readFromFile(outputFile);
	if (file_xml != null) {
		var widgets = xml..*.(@id.toString().match(/^ax-|_location/));
		for each(widget in widgets){
			if(file_xml..*.(@id == widget.@id))
				file_xml..*.(@id == widget.@id)[0] = widget;
		}
		this._fb_writeToFile(outputFile, file_xml);
	} else {
		app.log("outputFile does not exist. Skipping, please create a new file for this Prototype.");
	}
}

function _fb_generate(prototype, catalog) {
	var properties = getObj(prototype).getSchema();

	var proto = app.__app__.getPrototypeByName(prototype);
	var location_data = {
		widget:      proto.getProperty('_location.widget')  || 'location',
		push:        proto.getProperty('_location.widget.push'),
		push_target: proto.getProperty('_location.widget.push.target'),
	    push_path:   proto.getProperty('_location.widget.push.property'),
	    info: proto.getProperty('_location.widget.info'),
	    info_img: proto.getProperty('_location.widget.info_img')
	};

    var result = <div xmlns:tal="http://axiomstack.com/tale" class="form"><div class="subform"> </div></div>;
	var ns_transform = [ { from: new Namespace('talout', 'http://axiom.com/talout'), to: new Namespace('tal', 'http://axiomstack.com/tale')} ];
	var location = TAL.namespace_transform(this.renderTAL(catalog[location_data.widget]('_location',location_data), {attr_name: '_location', props: location_data}), ns_transform);
	result.div[location.name()] += location;
	var reference_widgets = <div class="subform reference-container"></div>;
	for(key in properties){
		var prop = properties[key];
		var widgetname = prop.widget ? prop.widget.value: false;
		if(widgetname && catalog[widgetname]){
			var form_elem = TAL.namespace_transform(this.renderTAL(catalog[widgetname](key, prop), {attr_name: key, props: prop}), ns_transform);
			if(widgetname == 'referenceOrderedMultiSelectPopUp'){
				reference_widgets[form_elem.name()] += form_elem;
			} else{
				result.div[form_elem.name()] += form_elem;
			}
		}
	}
	if(reference_widgets.*.length() > 0)
		result.div += reference_widgets;
	return result;
}