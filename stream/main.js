const peer = new Peer({ key : '2vsb0i4lsqcnxw29' });


navigator.getUserMedia = navigator.getUserMedia;

if (navigator.getUserMedia) {

	peer.on('open', id => $('#myid').append(id));

	// config stream
	const config = { audio: true, video: true };
	
	// function play stream
	var playStream = stream => {
			var video = document.querySelector('#localVideo');
			video.srcObject = stream;
			video.onloadedmetadata = e => video.play();
    	}

    var errorStream = err => console.log(new Error(err.name));

    //stream
    navigator.getUserMedia( config, playStream, errorStream);

} 
