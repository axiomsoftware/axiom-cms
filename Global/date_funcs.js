Date.prototype.toCSVString = function(){
	return this.pad(this.getMonth())+'/'+this.pad(this.getDate())+'/'+this.getFullYear().toString().substring(2,4) + ' '+this.pad(this.getHours())+':'+this.pad(this.getMinutes());
} 
Date.prototype.toCMSString = function(){
	return this.pad(this.getMonth())+'/'+this.pad(this.getDate())+'/'+this.getFullYear().toString().substring(2,4) + ', '+this.pad(this.getHours())+':'+this.pad(this.getMinutes());
} 
Date.prototype.pad = function(i){
	return i < 10 ? '0'+i : i;
}

Date.prototype.toH2Timestamp = function(){
	// yyyy-MM-dd hh:mm:ss
	return [this.getFullYear(), '-',
			this.pad(this.getMonth()+1), '-',
			this.pad(this.getDate()), ' ',
			this.pad(this.getHours()), ':',
			this.pad(this.getMinutes()), ':',
			this.pad(this.getSeconds()) ].join('');
}