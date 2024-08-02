console.log("OK");

function create_nitro_nds_file(){
	const args = [
		'-7', '/FSPDS7.elf',
		'-9', '/FSPDS9.elf',
		'-b', '/icon.bmp',  '"FSPDS"',
		'-d', '/nitro',
		'-c', '/FSPDS.nds',
	]		
	callMain(args);
}

$(document).ready(function(){
	$('#btn_download').click(async function(){
		create_index_file();
		create_nitro_nds_file();		
		downloadFileFromFS("/FSPDS.nds", "FSPDS_Nitro.nds");
	});
})