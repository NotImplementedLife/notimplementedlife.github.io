
async function get_json(url) {
	var result = null;
	await fetch(url).then(function (response) {								
		return response.json();
	}).then(function (data) {						
		result = data;		
	}).catch(function (err) {		
		console.warn('Something went wrong.', err);
	}).catch(e => {
		console.log(e);
  });  
  return result;
}

async function db_get_projects() {
	let json = await get_json('./db/projects.json');	
	return json.map(prj => Object.assign(new Project, prj));
}