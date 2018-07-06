'use strict';
process.env.NODE_ENV = 'test';


require('dotenv').config()

let chai = require('chai');
let chaiHttp = require('chai-http');
var nock = require('nock');
var crypto = require('crypto')
const querystring = require('querystring');


const server = require('../main.js')


chai.use(chaiHttp);
let should = chai.should();
let expect = chai.expect


describe('Products', () => {
  

describe('/Get 10 Products', () => {

it('Should get first 10 shopify products', (done)=>{

   nock(`${process.env.merchantUrl}`)
     .get(`/products.json?access_token=${process.env.access_token}&limit=10`)
     .reply(200, {
         products:  []
    }
 ); 

    chai.request(server)
    .get('/api/products')
    .end((err, res)=>{
        console.log(res.body)
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.products.length.should.equal(0);
        done()
    })

})

})

describe('/Validate and Get products', ()=>{

    before(()=>{
        this.code = 34; this.shop = process.env.merchantUrl;  this.state = 1;
        var message = querystring.stringify({code: this.code, shop: this.shop, state: this.state})
        this.hmac = Buffer.from(crypto.createHmac('sha256', process.env.apiSecret)
        .update(message)
        .digest('hex'),  'utf-8')

       
      nock(`${process.env.merchantUrl}`)
      .post('/oauth/access_token')
      .reply(200, {
        access_token:  '49'
        }
      ); 

      nock(`${process.env.merchantUrl}`)
      .get('/products.json?access_token=49&limit=10')
      .reply(200, {
        products: []
        }
      ); 
    

        
    })


it('Should redirect to shopify for authentication', (done)=>{
    chai.request(server).get('/api/validate-shopify').redirects(0).end((err, res)=>{
        res.should.have.status(302)
        done()
    })
})


it('Should return Required parameters not provided ', (done)=>{
    chai.request(server).get('/api/shopify-callback').query({}).end((err,res)=>{
        res.should.have.status(200);
        expect(res.body.Error).to.equal('Required parameters not provided')
        done()
    })
})

it('Should return HMAC validation failed', (done)=>{


    chai.request(server).get('/api/shopify-callback').query({hmac: this.hmac, code: 34,shop: process.env.merchantUrl, state: 2  }).end((err,res)=>{
        res.should.have.status(400);
       expect(res.body).to.equal('HMAC validation failed'); 
        done(); 
    })
})


it('Should generate access_token and get 10 products', (done)=>{


    chai.request(server).get('/api/shopify-callback').query({hmac: this.hmac, code: 34,shop: process.env.merchantUrl, state: 1  }).end((err,res)=>{
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.products.length.should.equal(0);
        done(); 
    })
})


})




    
})
