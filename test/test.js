'use strict';
process.env.NODE_ENV = 'test';


require('dotenv').config()

let chai = require('chai');
let chaiHttp = require('chai-http');
var nock = require('nock');

const server = require('../main.js')


chai.use(chaiHttp);
let should = chai.should();
chai.expect()


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


it('Should redirect to shopify for authentication', (done)=>{
    chai.request(server).get('/api/validate-shopify').redirects(0).end((err, res)=>{
        res.should.have.status(302)
        done()
    })


})

})




    
})
