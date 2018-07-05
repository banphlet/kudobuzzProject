'use strict';

require('dotenv').config()

var express  = require('express');
var bodyParser = require('body-parser');
var request = require('request')
const nonce = require('nonce')();
const querystring = require('querystring');
var crypto = require('crypto')
const cookie = require('cookie');
var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

const Router = express.Router();


app.use('/api', Router)



////////////////get first ten items from shop//////////////
Router.get('/products', (req, res)=>{

request.get(`${process.env.merchantUrl}/products.json?access_token=${process.env.access_token}&limit=10`, {json: true}, (err, response, body)=>{
if(err) return res.json(err)
if(body.errors) return res.json(body)
res.json(body)
})

})


Router.get('/validate-shopify', (req, res)=>{
    const state = nonce();
    const url = `${process.env.merchantUrl}/oauth/authorize?client_id=${process.env.apiKey}&scope=read_products&state=${state}&redirect_uri=${process.env.proxyAddress}/api/shopify-callback`

    res.cookie('state', state);
    res.redirect(url);

})


Router.get('/shopify-callback', (req, res)=>{
    const { shop, hmac, code, state } = req.query;
    if(!shop || !hmac || !code || !state) return res.json({Error: 'Required parameters not provided'})

    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
    crypto
    .createHmac('sha256', process.env.apiSecret)
    .update(message)
    .digest('hex'),
    'utf-8'
  );

  let hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)


if (!hashEquals) {
  return res.status(400).send('HMAC validation failed');
}


const accessTokenUrl =  process.env.merchantUrl + '/oauth/access_token';
const payLoad = {
    client_id: process.env.apiKey,
    client_secret: process.env.apiSecret,
    code: code,
  };

  
  request.post(accessTokenUrl, { json: payLoad },(error, r, accessBody)=>{
    if(error){
       return res.status(error.statusCode).send(error);
    }

    if(accessBody.error) return res.json(accessBody)
    const accessToken = accessBody.access_token


    //////////////////get products/////////
request.get(`${process.env.merchantUrl}/products.json?access_token=${accessToken}&limit=10`,{json: true}, (productErr, productResponse, productBody)=>{
    if(productErr){
        return res.status(productErr.statusCode).send(productErr);
     }


     res.json(productBody)

})
  })


})





app.listen(4000, ()=>{
    console.log('app listening on port 4000')
});


module.exports = app
