console.log('The bot is starting');

var Twit = require('twit');

var config = require('./config');

var math = require('mathjs');

var T = new Twit(config);

var x = 5;

var biggest = 0;

var n = 2;


/*var params = {
  q: 'rainbow',
  count: 5
};

T.get('search/tweets', params, gotData);

function gotData(err, data, response)
{
  var tweets = data.statuses;

  for(var i = 0; i < tweets.length; i++)
    console.log(tweets[i].text + "\n");
}*/
function bot ()
{
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

    tweetIt('Thanks ' + '@' + screenName + ' for following me! #PrimeFinder')
  }

  function isPrime (z)
  {
    //console.log("Entered is Pirme = " + z);

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
    //console.log("Updated biggest = " + z);
    
    biggest = z;

    updateMsg(biggest);

    //console.log(msg);
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
      
      if(n % 1000000 == 0)
        tweetIt('The biggest prime until now is ' + biggest + '!');

      if(n % 100000 == 0)
        console.log('found 100000 primes-> ' + biggest);
      if(n % 1000 == 0)
        console.log('found 1000 primes -> ' + biggest);
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

  //setInterval(tweetIt, 1000 * 3, 'The biggest prime until now is ' + biggest + '!');
}

bot();