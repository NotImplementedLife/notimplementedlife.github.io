async function load_database() {
	let json = await get_json('/database/projects.json');	
	const projects = json.map(prj => Object.assign(new Project, prj));
	
	json = await get_json('/database/updates.json');
	const updates = json.map(upd => Object.assign(new Update, upd));	
	
	for(var proj of projects) {		
		proj.latest_version=null;
		let data = await api_get_repo_latest(proj["internal-name"]);
		console.log(data);
		if(typeof data["tag_name"] !== 'undefined') {
			proj.latest_version = data["tag_name"];
		}
		if(typeof data["assets"] !== 'undefined') {							
			if(typeof data["assets"][0]["browser_download_url"] !== 'undefined') {
				proj.download_link = data["assets"][0]["browser_download_url"];
			}
		}		
	}
	
	var now = Date.now();
	for(var i=0;i<updates.length;i++){
		if(updates[i].project!=null) {
			const prj = projects.filter((p)=>p['internal-name'].toLowerCase()==updates[i].project.toLowerCase());
			if(prj.length>0)
				updates[i].project = prj[0];
			else
				updates[i].project = null;
		}
		
		updates[i].date = new Date(updates[i].timestamp);
		updates[i].time_diff = timeDifference(now, updates[i].date);
		updates[i].date_str = new Date(updates[i].timestamp).toShortFormat();				
	}
		
	updates.sort((u1, u2)=> u2.date - u1.date);
	
	return [projects, updates];
}

async function api_get_repo_latest(repo_name) {
	let data = await get_json(`https://api.github.com/repos/NotImplementedLife/${repo_name}/releases/latest`);
	return data;
}