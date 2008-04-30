Array.prototype.each = Array.prototype.forEach;
Array.prototype.invoke = function(str){
	return [i[str]() for each(i in this)];
};
Array.prototype.pluck = function(str){
	return [i[str] for each(i in this)];
};
Array.prototype.keys = function(){
	return [i for(i in this)];
};
Array.prototype.inject = function(memo, func){
	for each(var i in this){
		memo = func(i);
	}
	return memo;
};


for(var i in Array.prototype){
	Array.prototype.dontEnum(i);
}