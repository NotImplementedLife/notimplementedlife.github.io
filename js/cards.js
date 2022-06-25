const default_card_style = 
`<div class="project_card">
	<span class="project_status @(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>			
</div>`;

const simple_card_style = 
`<div class="project_card simple">
	<span class="project_status @(status)" title="@(status)"></span>
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>		
</div>`;

const card_card_style =
`<div class="project_card card col-lg-3">
  <img class="card-img-top" src="res/game.png">
  <div class="card-body">
	<h5 class="project_name card-title text-center">
		<span class="project_status @(status)" title="@(status)"></span>
		@(name)
		<span class="project_platform @(platform)"></span>
	</h5>								
  </div>
</div>`;


function generate_card(proj, card_style) {
	var html = card_style;
	for(property in proj) {
		var token = `@(${property})`;
		var value = proj[property];
		html = html.replaceAll(token, value);
	}
	return $(html);
}