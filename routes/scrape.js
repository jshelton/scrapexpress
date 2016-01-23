
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


var express = require('express');
var router = express.Router();

/* GET  listing. */
router.get('/', function(req, res, next) {

  url = 'http://www.imdb.com/title/tt1229340/';

  console.log('a request was made');
    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
        console.log('the request was sent out and we are being called back')
        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            console.log('loaded web page');
            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};


            $('.header').filter(function(){
                console.log('processed the title headers');
                var data = $(this);
                title  = data.children().first().text();

                release = data.children().last().children().text();



                json.title = title;
                json.release = release;                                

                $('.star-box-giga-star').filter(function(){
                    var data = $(this);
                    rating = data.text();
                    json.rating = rating;
                })

            })


        } else
        {
            console.log('there was an error');
        }

        fs.writeFile('output.json', JSON.stringify(json,null,4), function(err){
            console.log('File successfully written!  - check your project directory for the output.json file');
        })

        res.render('scrape', json);

    });
})

module.exports = router;
