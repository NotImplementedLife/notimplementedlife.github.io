function Project() {
	this.name = "project_name";
	this.category = "";	
	this.is_homebrew = false;	
	this.platform = "";
	this.type = "";	
	this.description = "A brief description...";
	this.status = "development";
	this.cats = false;
	return this;
};

function Update() {
	this.title = "title";
	this.description = "description";
	this.date = Date.now();
	this.project = null;
}