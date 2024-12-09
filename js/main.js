var sess_params;
var template_keys = {};

title="NotImpLife";
base_url = "/";

function display_page(template) {	
	$("#context").empty();	
	if(typeof template === 'string' || template instanceof String) {			
		//window.history.pushState({'url':`${base_url}/#/${template}` }, null);			
		template_keys[template].apply($("#context"), sess_params);
	} else {
		template.apply($("#context"), sess_params);
	}
}

$(document).ready(async function(){	
	var context = $("#context");
	var loading_screen = $("#loading_screen");		
	
	async function fade_out(x, N){		
		for(var i=0;i<=N;i++){
			x.css("opacity", (N-i)/N);
			await sleep(10);
		}
	}	
	
	var [projects, updates] = await load_database();
	sess_params = new TemplateParams({
		'projects' : projects,
		'updates' : updates,
		'home' : {}, 'about': {}, 'dev':{}, 'search':{}		
	});
	
	await UITemplateInit();

	$("#navbar").replaceWith(createNavbar(sess_params));	
	
	template_keys['/home'] = await loadUITemplate("/templates/home_page.html");
	template_keys['/projects'] = await loadUITemplate("/templates/projects_view.html");			
	template_keys['/projects/:internal-name'] = await loadUITemplate("/templates/project_view.html");
	template_keys['/about'] = await loadUITemplate("/templates/about_page.html");	
	template_keys['/dev'] = await loadUITemplate("/templates/dev_page.html");
	template_keys['/search'] = await loadUITemplate("/templates/search_page.html");
	
	if(window.location.hash==""){
		window.location.replace("/#/home");
	}	
	navigatePage(window.location.hash.substring(1));
		
	//await sleep(2000);
	await fade_out(loading_screen, 20);
	loading_screen.remove();	
})

/*window.addEventListener('popstate', e => {    
	console.log(`Back: ${e.state}`);
});*/

var ev;

window.navigation.addEventListener("navigate", (e) => {	
	ev = e;
	console.log(ev.hashChange);
	if(e.hashChange){				
		const url = e.destination.url.split('#')[1];
		
		navigatePage(url);		
	}
});

function query2dict(q){
	var d = {}
	for(var [k,v] of q.entries()) d[k]=v;
	return d;
}

function navigatePage(hash){	
	const splits = hash.split('?');
	const path = splits[0];
	const getParams = query2dict(new URLSearchParams(splits.length>1 ? splits[1] : ""));
	loadPage(path, getParams);
}

function template_path_match(t, p, obj) {
	if(t.length!=p.length) return undefined;	
	const l = t.length;	
	//console.log(`?: ${t}, ${p}`)
	for(var i=0;i<l;i++) {
		if(t[i]==p[i]) {
			if(!(p[i] in obj)){
				return undefined;
			}
			obj = obj[p[i]];
			continue;
		}
		if(p[i].startsWith(':')){			
			var f = p[i].substring(1);			
			console.log(obj);
			obj = obj.filter((o)=> f in o && o[f].toLowerCase()==t[i].toLowerCase());					
			if(obj.length==0) return undefined;
			obj = obj[0];
			continue;			
		}
		return undefined;
	}
	//console.log(`match: ${t}, ${p}`)
	
	return obj;	
}


function fix_template(template) {
	var t_splits = template.split('/').filter(i => i);
	
	for(var p in template_keys){
		var obj = template_path_match(t_splits, p.split('/').filter(_=>_), sess_params.params);
		if(obj != undefined){
			return [p, obj];
		}
	}
	return [undefined, undefined];	
}

function loadPage(template, getParams){		
	console.log(`Navigate: ${template} ? ${getParams?.toString()}`);
	sess_params.params['query'] = getParams;
	var [template, obj] = fix_template(template);
	
	if(template == undefined) {
		display_page('x');
	}
	else {			
		sess_params.params['target'] = obj;		
		display_page(template);
	}
}

function perform_search(e) {
	var fd = new FormData(e.srcElement);
	var data = {};
	for(var [k,v] of fd.entries()) data[k]=v;
	
	if('key' in data){		
		window.location = `/#search?key=${data['key']}`;
	}		
	
	return false;	
}

function search_in_object(key) {
	return (it) => {		
		var keys = Object.keys(it);
		for(var k of keys) {
			if(!isString(it[k])) continue;
			if(it[k].toLowerCase().includes(key)) 
				return true;
		}		
		return false;
	}	
}
