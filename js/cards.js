const default_card_style = 
`<div class="project_card">
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>		
</div>`;

const simple_card_style = 
`<div class="project_card simple">
	<span class="project_name">@(name)</span>
	<span class="project_platform @(platform)"></span>		
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