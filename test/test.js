process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');

const server = require('../main.js')


chai.use(chaiHttp);
let should = chai.should();


describe('Products', () => {
  

describe('/Get 10 Products', () => {

it('Should get first 10 shopify products', (done)=>{
    chai.request(server)
    .get('/api/products')
    .end((err, res)=>{
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.products.length.should.equal(10);
        done()
    })

})

})

describe('/Validate and Get products', ()=>{

it('Should connect to shopify and get 10 products', (done)=>{
    chai.request(server).get('/api/validate-shopify').end((err, res)=>{

        res.should.have.status(200)


        done()
    })


})

})




    
})
