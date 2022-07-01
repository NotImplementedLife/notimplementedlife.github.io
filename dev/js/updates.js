const update_style = `<div class="update">
	<span>@(project_card) <h3>@(title)</h3></span>	
	<span class="timestamp" title="@(timestamp_pretty)">@(timetext)</span><br/>				
	<p class="description">@(description)</p>
	<hr/>	
</div>`;

const update_style_no_card = `<div class="update">
	<h5>@(title)</h5>
	<span class="timestamp" title="@(timestamp_pretty)">@(timetext)</span><br/>				
	<p class="description">@(description)</p>
	<hr/>	
</div>`;

function getLocale() {
    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}


async function generate_update(update, update_style) {	
	var html = update_style;
	for(property in update) {
		var token = `@(${property})`;
		var value = update[property];
		html = html.replaceAll(token, value);
	}			
	html = html.replaceAll("@(timetext)", timeDifference(Date.now(), Date.parse(update.timestamp)));	
	var date = new Date(update.timestamp);	
	html = html.replaceAll("@(timestamp_pretty)",date.toLocaleString(getLocale()));
	if(update.project!=null) {		
		let card = await generate_card(update.project, default_card_style);
		html = html.replaceAll("@(project_card)", card[0].outerHTML);
	}
	else
		html = html.replaceAll("@(project_card)", "");
	
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
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
