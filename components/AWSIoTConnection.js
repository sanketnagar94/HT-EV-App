import awsIot from 'aws-iot-device-sdk';

const device = awsIot.device({
  keyPath: require('../certs/private.pem.key'),
  certPath: require('../certs/certificate.pem.crt'),
  caPath: require('../certs/AmazonRootCA1.pem'),
  clientId: 'smartPlugApp',
  host: 'YOUR_AWS_IOT_ENDPOINT.iot.YOUR_REGION.amazonaws.com'
});

device.on('connect', () => {
  console.log('Connected to AWS IoT');
  device.subscribe('smartplug/data');
});

device.on('message', (topic, payload) => {
  console.log('Message received:', topic, payload.toString());
});

export default device;
