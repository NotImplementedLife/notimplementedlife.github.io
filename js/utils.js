const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get_text(url) {
	var result = null;
	await fetch(url).then(function (response) {								
		return response.text();
	}).then(function (data) {						
		result = data;		
	}).catch(function (err) {		
		console.warn('Something went wrong.', err);
	}).catch(e => {
		console.log(e);
  });
  return result;
}

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

$.fn.replaceTag = function(tag, copyAttributes = true) {
	return this.each(function() {
		const newTag = tag || this.dataset.tag;
		
		if (!newTag.length) {
			return true;
		}
		
		const replacement = document.createElement(tag);
		
		if (copyAttributes) {			
			for (let attr of this.attributes) {
				replacement.setAttribute(attr.nodeName, attr.nodeValue);
			}
		}

		replacement.innerHTML = this.innerHTML;
		
		this.replaceWith(replacement);
	});
};


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute)
         return Math.round(elapsed/1000) + ' seconds ago';    
    else if (elapsed < msPerHour) 
         return Math.round(elapsed/msPerMinute) + ' minutes ago';    
    else if (elapsed < msPerDay )
         return Math.round(elapsed/msPerHour ) + ' hours ago';    
    else if (elapsed < msPerMonth)
        return Math.round(elapsed/msPerDay) + ' days ago';    
    else if (elapsed < msPerYear) 
        return Math.round(elapsed/msPerMonth) + ' months ago';    
    else
        return Math.round(elapsed/msPerYear ) + ' years ago';   
}

Date.prototype.toShortFormat = function() {

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];
    
    const day = this.getDate();
    
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    
    const year = this.getFullYear();
    
    return `${day}-${monthName}-${year}`;  
}

function isString(s) { return typeof s === 'string' || s instanceof String; }