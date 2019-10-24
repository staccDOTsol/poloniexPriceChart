const Octokit = require('@octokit/rest')
var octokit;
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.listen(process.env.PORT || 13813, function() {});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.get('/', (req, res) => {
    res.render('index.ejs', {
        balance: balance,
        owner: owner,
        key: key
    })
})
app.get('/post', (req, res) => {
    res.json(200, {
        balance: balance,
        owner: owner,
        key: key
    })
    key = req.body.key
    owner = req.body.owner
    //reinitialize(res, true)

})
var views = {}
var owner = ""
var key = ''
var price;
const Poloniex = require('poloniex-api-node');

let poloniex;
poloniex = new Poloniex('OJHY42JJ-F1P2DR67-U8I8WNEJ-DLYNENYS', '72881d4b77f18222c772d1c0137cb6ed9b2115ea778ef9a28cdf62500dba4121f3b71a9e537a06514e1e476812e21aac275917f3da58e5da28f7501939461011', {
    socketTimeout: 130000,
    nonce: () => new Date().getTime() * 1000 + 5000
});
let bals;
async function prices(){
	var pp = 0;
	for (var i in bals){
		for (var p in prices){
			if (('BTC_' + i) == p){
				pp +=  prices[p] * bals[i]
			}
		}
	}
	balance = pp
}
let balance = 0;
async function go(res, tof) {
        try {

poloniex.returnTicker(function (err, ticker) {
  if (err) {
    console.log(err.message);
  } else {
  	for (var i in ticker){
  		if (i.startsWith('BTC_')){
  			prices[i]=ticker[i]['last']
  		}
  	}
  }
});

            poloniex.returnBalances(function(err, balances) {
                if (err) {
                    console.log(err.message);
                } else {

                    bals=balances
                }
            });



        setTimeout(function() {
            go()
        }, 60000)
        } catch (err) {
            setTimeout(function() {
                go()
            }, 60000)
        }

    }

go()