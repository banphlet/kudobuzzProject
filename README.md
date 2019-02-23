# Setup

[![Greenkeeper badge](https://badges.greenkeeper.io/banphlet/kudobuzzProject.svg)](https://greenkeeper.io/)

  ## Clone Project

```sh
git clone https://github.com/banphlet/kudobuzzProject

```
  ## Install packages 
  
```sh
    npm i     
```

## API configuration

. Download [Ngrok](https://ngrok.com/download) and 
enter command ngrok 

```ngrok http 4000```

Create an account at [Partner Dashboard](https://partners.shopify.com/login). In partner Dashoard create an app enter url in
the following format 

```
{https ngrok forwarding address}/validate-shopify

eg. https://1813ae76.ngrok.io/validate-shopify

also add {https ngrok forwarding address}/shopify-callback to the whitelist urls


```


Create ```.env``` file in root of Project. 

Required parameters eg. 
```
merchantUrl = https://nanak.myshopify.com/admin
access_token =402c4baa67eecc44554545452342344e
apiKey = c6526dca309d63c17d4343wwer34   ////////////from partner dashboard
apiSecret = 1dfdfdddfdfdfd25f7ba2773c33de9f //////////////from partner dashboard
proxyAddress = https://1813ae76.ngrok.io  ///////////proxy address from ngrok/////

````

Start the app using ``` node main.js```

# Usage
Three routes are exposed in the api 

1. ```products```

make a get request on Postman to ```http://127.0.0.1:4000/api/products/``` to get first  10 products from shopify 
for the merchant.

2.  ```validate-shopify```

On the browser make a get request to this endpoint at ```http://127.0.0.1:4000/api/validate-shopify/```

3. ```shopify-callback``` 

Callback for shopify return url.


# Tests

``` npm test ```


