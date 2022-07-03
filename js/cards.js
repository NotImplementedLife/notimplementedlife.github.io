const default_card_style = 
`<div class="project_card clickable" meta="@(internal-name)">
	<span class="project_status @(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>			
</div>`;

const simple_card_style = 
`<div class="project_card simple clickable" meta="@(internal-name)">
	<span class="project_status @(status)" title="@(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>		
</div>`;

const card_card_style =
`<div class="project_card card col-md-3 clickable" style="cursor:pointer" meta="@(internal-name)">
  @(elem_icon)
  <img class="card-img-top" src="res/@(type).png">
  <div class="card-body">
	<h5 class="project_name card-title text-center">
		<span class="project_status @(status)" title="@(status)"></span>
		@(name)
		<span class="project_platform @(platform)" style="display:inline-block"></span>		
	</h5>								
  </div>
</div>`;

const modal_card_style =
`<div class="project_card modal modal-dialog" role="document">
	<div class="modal-content">
	  <div class="modal-header">
		<h5 class="modal-title">@(name)
			<br/>
			<small><a href="./view.html?project=@(internal-name)">View full page</a></small>
		</h5>		
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		  <span aria-hidden="true">&times;</span>
		</button>		
	  </div>
	  <div class="modal-body">
		<span class="project_status @(status)"></span>
		<span class="project_platform @(platform)"></span>			
		<span class="cuteness-alert @(cats)"></span>			
		<p>@(description)</p>
		<hr/>
		@(download)
		@(links)		
		@(updates)		
	  </div>
	  <div class="modal-footer">		
		<!--button type="button" class="btn btn-primary">Save changes</button>
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button-->
	  </div>
	</div>
  </div>`;
  
 const full_card_style =
`<div class="project_card">	
	  <div>
		<h5>
		<span class="project_status @(status)"></span>
		@(name)		
		<span class="project_platform @(platform)"></span>			
		<span class="cuteness-alert @(cats)"></span>			
		</h5>
	  </div>
	  <div>						
		<p>@(description)</p>
		<hr/>
		@(download)
		@(links)		
		@(updates)		
	  </div>	  
  </div>`;


async function generate_card(proj, card_style) {
	var html = card_style;
	for(property in proj) {
		var token = `@(${property})`;
		var value = proj[property];
		html = html.replaceAll(token, value);
	}
	
	if(proj.icon!=null) {
		html = html.replaceAll("@(elem_icon)",`<img src="data:image/png;base64,${proj.icon}"/>`);
	}
	else {
		html = html.replaceAll("@(elem_icon)","");
	}
	
	if(proj.ref!=null) {
		var urls = $("<div>");
		urls.append("<h4>External links</h4><hr/>")
		for(var name in proj.ref) {
			var caption = name;			
			var url = proj.ref[name];			
			
			if(caption=="github") caption="Source code";
			urls.append(`<a href='${url}'>${caption}</a><br/>`);
		}
		urls.append("<br/>");
		html = html.replaceAll("@(links)",urls[0].outerHTML);
	}
	else {
		html = html.replaceAll("@(links)","");
	}	

	if(html.includes("@(download)")) {
		if(proj.latest_version==null) {
			let data = await api_get_repo_latest(proj["internal-name"]);
			if(typeof data["tag_name"] !== 'undefined') {							
				proj.latest_version = data["tag_name"];
			}
			if(typeof data["assets"] !== 'undefined') {							
				if(typeof data["assets"][0]["browser_download_url"] !== 'undefined') {
					proj.download_link = data["assets"][0]["browser_download_url"];
				}
			}
		}	
		
		if(proj.latest_version==null) {
			html=html.replaceAll("@(download)","");
		}
		else {
			var dld = $("<div>");
			dld.append("<h4>Download</h4><hr/>");
			dld.append(`<p>Latest version <b>${proj.name} ${proj.latest_version}</b> <a href="${proj.download_link}">Download</a></p>`);			
			html=html.replaceAll("@(download)",dld[0].outerHTML);
		}				
	}
	
	if(html.includes("@(updates)")) {	
		var upd = $("<div>");		
		for(var i in updates) {
			if(updates[i].project == proj) {
				let u = await generate_update(updates[i], update_style_no_card);
				upd.append(u);				
			}
		}
		if(upd.html()=="") {
			upd.append("<p align='center'>No posts yet.</p>")
		}
		upd.prepend("<h4>Updates</h4><hr/>");
		html=html.replaceAll("@(updates)",upd[0].outerHTML);
	}						
	
	var obj = $(html);
	$('span.cuteness-alert.true', obj).prop("title", "Cuteness alert : this project contains cats");	
	return obj;
}