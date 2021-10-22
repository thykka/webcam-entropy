// https://www.npmjs.com/package/node-webcam
const nodeWebcam = require('node-webcam');
// https://github.com/dy/image-pixels
const pixels = require('image-pixels');

const options = {
	sourceWidth: 640,
	sourceHeight: 480,
	outWidth: 120,
	outHeight: 32
};

const webcamOptions = {
	width: options.sourceWidth,
	height: options.sourceHeight,
	quality: 100,
	frames: 1,
	delay: 0,
	//saveShots: true,
	output: 'png',
	//device: false,
	callbackReturn: 'base64'
};
const pixOptions = {
	type: 'image/png',
	//clip: [0,0,640,480],
	clip: [
		options.sourceWidth/2-options.outWidth/2,
		options.sourceHeight/2-options.outHeight/2,
		options.sourceWidth/2+options.outWidth/2,
		options.sourceHeight/2+options.outHeight/2
	].map(v => Math.round(v))
};

const cam = nodeWebcam.create(webcamOptions);

const glyphs = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. '.split('').reverse();

async function processWebcamData(error, data) {
	if(error) {
		throw(error);
	}
	const imageData = await pixels(data,pixOptions);
	//console.log(imageData);
	const g = [];
	for(let i = 0,v; i<imageData.data.length; i+=4) {
		v=imageData.data[i+1]||0;
		g.push(glyphs[Math.floor(v/255*glyphs.length)])
	}
	console.log(g.join(''))
	getEntropy();
}
function getEntropy() {
	cam.capture('test', processWebcamData);
}

getEntropy();
