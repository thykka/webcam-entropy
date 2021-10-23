// https://www.npmjs.com/package/node-webcam
const nodeWebcam = require('node-webcam');
// https://github.com/dy/image-pixels
const pixels = require('image-pixels');
// https://www.npmjs.com/package/random-seed
const gen = require('random-seed');
const crypto = require('crypto');
const fs = require('fs');

const options = {
	sourceWidth: 640,
	sourceHeight: 480,
	outWidth: 640, // May be used to crop the output. Must not be larger than sourceWidth
	outHeight: 480,
	outFile: 'test.dat',
	outBytesPerImage: 1, // how many bytes to generate from a single seed
	append: true, // if false, will delete outFile before starting to write
};

const webcamOptions = {
	width: options.sourceWidth,
	height: options.sourceHeight,
	quality: 100,
	frames: 1,
	delay: 0,
	saveShots: false,
	output: 'png',
	//device: false,
	callbackReturn: 'base64'
};
const pixOptions = {
	type: 'image/png',
	//clip: [0,0,640,480],
	clip: [
		options.sourceWidth /2-options.outWidth /2,
		options.sourceHeight/2-options.outHeight/2,
		options.sourceWidth /2+options.outWidth /2,
		options.sourceHeight/2+options.outHeight/2
	].map(v => Math.round(v))
};

const cam = nodeWebcam.create(webcamOptions);
let imageData, hash, rndGen;

async function processWebcamData(error, data) {
	if(error) {
		throw(error);
	}
	imageData = await pixels(data,pixOptions); // TODO: fix memory leak
	if(imageData && imageData.data[0]!==0) { // ensure this isn't a blank frame
		writeRandom(imageData.data)
	}
	setTimeout(getEntropy,1)
}


function writeRandom(data) {
	hash = crypto.createHash('blake2b512').update(data).digest('utf8');
	rndGen = gen.create(hash);
	stream.write(
		Buffer.from(Int8Array.from({length:options.outBytesPerImage},()=>rndGen(0x1fe)-0xff))
	);
}

function getEntropy() {
	cam.capture('test', processWebcamData);
}

if(!options.append) {
	fs.unlinkSync(options.outFile);
}
const stream = fs.createWriteStream(options.outFile, {flags: 'a'})

process.on('SIGINT', () => {
	// attempt graceful exit
	stream.end();
	console.log('\nWrote file ' + options.outFile)
	process.exit();
})


getEntropy();
