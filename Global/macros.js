String.prototype.ampEscape = function(){
	return this.replace(/&(?!(amp|nbsp|gt|lt);)/g, '&amp;');
}

String.prototype.ellipse = function(length) {
	if (this.length > length) {
		var substring = this.substr(0,length);
		var index = substring.lastIndexOf(' ');
		return substring.substr(0,index) + '...';
	}
	return this;
}

function getObj(prototype){
	// hackomatic
	if(prototype == "Image" || prototype == "File"){
		return new this[prototype](app.__app__.getServerDir().getAbsolutePath()+java.io.File.separator+
					   'modules'+java.io.File.separator+'formbuilder'+java.io.File.separator+
					   'Global'+java.io.File.separator+'macros.js');
	}
	return new this[prototype]();
}

for (var i in String)
    String.dontEnum(i);
for (var i in String.prototype)
    String.prototype.dontEnum(i);
