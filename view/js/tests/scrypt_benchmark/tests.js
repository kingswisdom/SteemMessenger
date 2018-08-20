var scrypt = require('scryptsy');
var Benchmark = require('./benchmark.js')
//We use https://github.com/bestiejs/benchmark.js/
//Consider using web crypto api
//https://stackoverflow.com/questions/42772569/benchmarking-webcrypto-is-much-slower-than-third-party-libraries

var suite = new Benchmark.Suite;

var salt = "comment ca va?";
var passphrase = "hello world";
suite.add('Default_scrypt',function(){
    var kdfResult = scrypt(passphrase, salt, 16384, 8, 1, 64);
    var result = kdfResult.toString('hex').toString();
  })
  .add('Default_scrypt_lower',function(){
      var kdfResult = scrypt(passphrase, salt, 16384, 8, 1, 44);
      var result = kdfResult.toString('hex').toString();
    })
  .add('Default_scrypt_higher',function(){
      var kdfResult = scrypt(passphrase, salt, 16384, 8, 1, 128);
      var result = kdfResult.toString('hex').toString();
    })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({
    'async': true
  });
