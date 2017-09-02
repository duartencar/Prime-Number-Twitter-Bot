console.log('The bot is starting');

var Twit = require('twit');

var config = require('./config');

var math = require('mathjs');

const readMultipleFiles = require('read-multiple-files');

var T = new Twit(config);

var x = 0, y;

var v, k;

var biggest;

var n;

//File related

readMultipleFiles(['largestPrime.txt', 'numberOfPrimes.txt'], 'utf8', (err, contents) => {
  if (err) {
    throw err;
  }
 
  x = parseInt(contents[0], 10);

  biggest = x;

  n = parseInt(contents[1], 10);

  bot();
});

//File related

function bot ()
{
  function initialValues()
  {
    console.log("x = " + x);

    console.log("biggest = " + biggest);

    console.log("n = " + n);
  }

  function updatePrimeFile(x)
  {
    var fs = require("fs");

    var writerStream = fs.createWriteStream('largestPrime.txt');

    // Write the data to stream with encoding to be utf8
    writerStream.write(x.toString(),'UTF8');

    // Mark the end of file
    writerStream.end();

    // Handle stream events --> finish, and error
    writerStream.on('finish', function()
    {
        console.log("largestPrime.txt updated");
    });

    writerStream.on('error', function(err)
    {
       console.log(err.stack);
    });
  }

  function updateNumberFile(x)
  {
    var fs = require("fs");

    var writerStream = fs.createWriteStream('numberOfPrimes.txt');

    // Write the data to stream with encoding to be utf8
    writerStream.write(x.toString(),'UTF8');

    // Mark the end of file
    writerStream.end();

    // Handle stream events --> finish, and error
    writerStream.on('finish', function()
    {
        console.log("numberOfPrimes.txt updated");
    });

    writerStream.on('error', function(err)
    {
       console.log(err.stack);
    });
  }

  initialValues();

  var msg;

  function tweetIt(msg)
  {
    var tweet = {status: msg};

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response)
    {
      if(err)
        console.log("Something went wrog! " + msg);
      else   
        console.log("\nTWITED: " + tweet.status);
    }
  }

  var stream =T.stream('user');

  stream.on('follow', followed);

  function followed (eventMsg)
  {
    var name = eventMsg.source.name;

    var screenName = eventMsg.source.screen_name;

    tweetIt('Thanks ' + '@' + screenName + ' for following me! #primeFinder')
  }

  function isPrime (z)
  {
    for(var i = 3; i < math.sqrt(z) + 1; i += 2)
    {
      if(z % i == 0)
      {
        updateX();
        
        return false;
      }
    }

    return true;
  }

  function updateBiggest (z)
  {    
    biggest = z;

    updateMsg(biggest);
  }

  function counter()
  {
    n++;
  }

  function updateX ()
  {
    x += 2;

    //console.log('updated x = ' + x);
  }

  function cal()
  {
    if(isPrime(x) == true)
    {
      updateBiggest(x);
      
      counter();
      
      if(n % 500000 == 0)
      {
        tweetIt('The biggest prime until now is ' + biggest + '! #primeFinder');
        updatePrimeFile(biggest);
        updateNumberFile(n);
      }
      
      else if(n % 10000 == 0)
      {
        console.log('found ' + n + ' primes -> ' + biggest);
        updatePrimeFile(biggest);
        updateNumberFile(n);
      }

      if(x < 0)
        console.log('OVERFLOW: ' + x);
    }
    else
      updateX();
  }

  function updateMsg (biggest)
  {
    msg = 'The biggest prime until now is ' + biggest + '!';

    updateX();
  }

  setInterval(cal, 1);
}