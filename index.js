const startTime = process.hrtime();
// https://www.npmjs.com/package/node-webcam
const nodeWebcam = require('node-webcam');


const options = {
	width: 1920/8,
	height: 1080/8,
	quality: 100,
	frames: 1,
	delay: 0,
	//saveShots: true,
	output: 'png',
	//device: false,
	callbackReturn: 'base64'
};

const cam = nodeWebcam.create(options);
const capTime = process.hrtime();
cam.capture('test', (err, data) => {
	const endTime = process.hrtime();
	if(err) {
		throw(err);
	}
	const buf = Buffer.from(data, 'base64');
	console.log(buf.length)
	console.log(capTime, endTime, endTime[0] - capTime[0])
})
