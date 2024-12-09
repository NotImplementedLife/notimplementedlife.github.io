function TemplateParams(dict) {
	this.params = dict;	
}

TemplateParams.prototype.solve = function(key) {
	if(key.startsWith("@"))
		key = key.substring(1);	
	return accessField(this.params, key);	
	//return (key in this.params) ? this.params[key] : undefined;
}


function UITemplate(node) {			
	this.node = node;	
}

UITemplate.prototype.apply = function(ctx, pms){
	console.log(serialize(this.node[0]))
	let buildNode = (n) => {
		var tag = n.prop("tagName").toLowerCase();
		var compiled = (tag in template_build_functions)
			? template_build_functions[tag](n, pms)
			: `<span style='color:red'>${tag}</span>`;		
		n.replaceWith(compiled);
	};
	
	result = this.node.clone();		
	parseNodes(result, buildNode, null);
	
	parseNodes(result, null, (n)=>{		
		const ifNotNullAttr = n.attr("t-if-not-null");
		if(ifNotNullAttr===undefined) return;		
		const field = ifNotNullAttr;		
		var t = accessField(pms, field);
		if(t==null || t==undefined){
			n.remove();
		}else{
			n.removeAttr("t-if-not-null");
		}
	});
	
	
	result = subst(serialize(result[0]), pms);
	
	if(ctx!=null)	
		ctx.html(result);
	return result;
}

function parseNodes(node, action, nonTAction) {				
	if(node.prop("tagName").startsWith('T_')){
		if(action!=null) action(node);
		return;
	}			
	if(nonTAction!=null) nonTAction(node);
	let children = node.find("> *");
	const len = children.length;
	for(var i=0;i<len;i++){						
		parseNodes($(children[i]), action, nonTAction);
	}	
}

async function loadUITemplate(url) {
	var html = await get_text(url);
	var node = $(html);		
	return new UITemplate(node);
}

function imd_select(node, tag, strict) {
	var result = node.children(tag);
	if(strict==true && result.length==0) {
		throw `Failed strict: imd_select(<${node.prop("tagName").toLowerCase()}>, ${tag})`;
	}	
	return result[0];	
}

function serialize(node){	
	var s = new XMLSerializer();
	return s.serializeToString(node).replace(/xmlns="[^"]+"/, '');
}

function accessField(obj, path){
	fields = path.split('.');
	for(var i=0;i<fields.length;i++) {
		if(obj==null || !(fields[i] in obj)) {
			return undefined;
		}
		obj = obj[fields[i]];
	}
	//console.log(`${path} resolved ${obj}`);	
	return obj;
}

function subst(template, obj, isDom) {
	if(isDom==undefined) isDom=true;
	const regexp = /\$\'?([a-zA-z0-9\-_\.]+)\$/g;
	const matches = [...new Set(template.matchAll(regexp).map(item=>[item[0], accessField(obj,item[1])]))];	
	for(var i=0;i<matches.length;i++){	
		var replaced = matches[i][1];
		if(matches[i][0].startsWith("$'"))
			replaced = "'"+replaced.replace("'","\\'")+"'";		
		template = template.replace(matches[i][0], replaced);
	}	
	if(!isDom) return template;
	template = $(template);		
	parseNodes(template, null, (n)=>{		
		const ifNotNullAttr = n.attr("t-if-not-null");
		if(ifNotNullAttr===undefined) return;		
		const field = ifNotNullAttr;		
		var t = accessField(obj, field);
		if(t==null || t==undefined){
			n.remove();
		}else{
			n.removeAttr("t-if-not-null");
		}
	});	
	return serialize(template[0]);
}

var navbar_template;

async function UITemplateInit() {
	navbar_template = await get_text("/templates/navbar.html");	
}

function createNavbar(pms) {	
	var template = new UITemplate($(navbar_template));			
	return template.apply(null, pms);// subst(navbar_template, pms);
}

const template_build_functions = {
	't_items_list' : function(node, pms){
		var source = pms.solve(node.attr("source"));				
		var filter = node.attr("filter");
		
		console.log(filter);		
		
		if(isString(filter)) {
			filter = subst(filter, pms, false);
			filter = eval(filter);
			console.log(filter);
			source = source.filter(filter);
		}else{
			filter=null;
		}			
				
		var container = serialize(imd_select(node, "container", true).children[0].cloneNode(true));
		var item_template = serialize(imd_select(node, "item_template", true).children[0].cloneNode(true));
		var lim = node.attr("limit");				
		if(lim==undefined)
			lim = source.length;
		else
			lim = Math.min(lim, source.length);
		
		var items_str = "";		
		for(var i=0, l=lim;i<l;i++){
			//var obj = source instanceof Array ? obj[i] : 			
			var it = subst(item_template, source[i]);
			items_str+=it;
		}
		container = $(subst(container, {'items':items_str}));			
		$('t-li', container).replaceTag("li", true);		

		if(container.is("[ignore]")) {
			container = container.contents().unwrap();
		}
		
		return container;
	},
	't_navbar' : function(node, pms) {
		return navbar_template;
	}
};