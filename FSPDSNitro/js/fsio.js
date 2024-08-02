async function copyFileToFS(file, path){
	let buffer = await new Promise((resolve) => {
		 let fileReader = new FileReader();
		 fileReader.onload = (e) => resolve(fileReader.result);
		 fileReader.readAsArrayBuffer(file);
	});	
	const data = new Uint8Array(buffer);	
	FS.writeFile(path, data);
}

async function copyServerFileToFS(url, path){
	function read(url){
		return new Promise(function(resolve){
			var oReq = new XMLHttpRequest();
			oReq.open("GET", url, true);
			oReq.responseType = "arraybuffer";
			oReq.onload = function(oEvent) {
				var arrayBuffer = oReq.response;			  
				var byteArray = new Uint8Array(arrayBuffer);
				resolve(byteArray);
			};
			oReq.send();
		});
	}	
	const data = await read(url);	
	FS.writeFile(path, data);
}

async function downloadFileFromFS(path, download_name=null) {
	if(download_name==null){
		download_name = path.split('/');
		download_name = download_name[download_name.length-1];
	}
	const data = FS.readFile(path);
	const url = window.URL.createObjectURL(new Blob([data]));
	const link = document.createElement('a');
    link.href = url;
	link.setAttribute('download', download_name);
	document.body.appendChild(link);
    link.click();
    link.remove();
}