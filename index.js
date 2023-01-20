var express = require('express');
var bodyParser = require('body-parser');
const crypto = require('crypto');

var app = express();
var port = 3525;

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});
app.post('/', function(req, res){
	
    
    // A sample webhook coming from MetaMap
    const WEBHOOK_PAYLOAD = req.body;
    const MERCHANT_SECRET = '3NG8oytbvsC55nP6bQsVOT5C1';
    
    // MetaMap hashes your webhook payload
    const signature = crypto.createHmac('sha256', MERCHANT_SECRET).update(JSON.stringify(WEBHOOK_PAYLOAD)).digest('hex');
    console.log(signature);
    
    function verify(signature, secret, payloadBody) {
        let hash = crypto.createHmac('sha256', secret);
        hash = hash.update(payloadBody).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    }    
    let isValidPayload;
    
    isValidPayload = verify(signature, MERCHANT_SECRET, JSON.stringify(WEBHOOK_PAYLOAD));
    console.log(isValidPayload);
	res.status(200).send({
		message: 'POST Home route working fine!'
	});
});

app.listen(port, function(){
	console.log(`Server running in http://localhost:${port}`);
	console.log('Defined routes:');
	console.log('	[GET] http://localhost:3525/');
});
