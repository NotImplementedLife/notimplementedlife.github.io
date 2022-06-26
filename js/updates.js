const update_style = `<div class="update">
	<span>@(project_card) <h3>@(title)</h3></span>	
	<span class="timestamp" title="@(timestamp)">@(timetext)</span><br/>				
	<p class="description">@(description)</p>
	<hr/>	
</div>`;


function generate_update(update, update_style) {	
	var html = update_style;
	for(property in update) {
		var token = `@(${property})`;
		var value = update[property];
		html = html.replaceAll(token, value);
	}		
	html = html.replaceAll("@(timetext)", timeDifference(Date.now(), Date.parse(update.timestamp)));	
	console.log(update.project);
	html = html.replaceAll("@(project_card)", generate_card(update.project, default_card_style)[0].outerHTML);
	
	return $(html);
}



function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
