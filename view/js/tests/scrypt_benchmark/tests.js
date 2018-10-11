var scrypt = require('scryptsy');
var Benchmark = require('./benchmark.js')
//We use https://github.com/bestiejs/benchmark.js/
//Consider using web crypto api
//https://stackoverflow.com/questions/42772569/benchmarking-webcrypto-is-much-slower-than-third-party-libraries

var suite = new Benchmark.Suite;

var salt = "supercalifragilisticexpialidocious";
//tests cases from scrypt.pdf
var passphraseSimple = "hello world";
var passphraseLower6 = "sfgroy";
var passphraseLower8 = "ksuvnwyf";
var passphrasePrint8 = "6,uh3y[a";
var passphraseRand10 = "H.*W8Jz&r3";
var passphraseString40 = "This is a 40-character string of English";
var passphraseString80 = "This is an 80-character phrase which you probably won’t be able to crack easily.";

// We expect the result to be used with AES-GCM
// So the size key=32 bytes  for scrypt output
// IV a generated randomly and separately from the key

console.log("========================\nstarting Benchmark \n========================")
suite.add('default',function(){
    var kdfResult = scrypt(passphraseString80, salt, Math.pow(2,14), 8, 1, 32);
    var result = kdfResult.toString('hex');
  })
  .add('power15',function(){
      var kdfResult = scrypt(passphraseString80, salt, Math.pow(2,15), 8, 1, 32);
      var result = kdfResult.toString('hex');
    })
  .add('power16',function(){
      var kdfResult = scrypt(passphraseString80, salt, Math.pow(2,16), 8, 1, 32);
      var result = kdfResult.toString('hex');
    })
    .add('power17',function(){
        var kdfResult = scrypt(passphraseString80, salt, Math.pow(2,17), 8, 1, 32);
        var result = kdfResult.toString('hex');
      })
      .add('power18',function(){
          var kdfResult = scrypt(passphraseString80, salt, Math.pow(2,18), 8, 1, 32);
          var result = kdfResult.toString('hex');
        })
  .on('cycle', function(event) {
    console.log(String(event.target)+" => average time "+ String(event.target.times.cycle) + " seconds");
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({
    'async': true
  });
/*
suite.add('simple',function(){
    var kdfResult = scrypt(passphraseSimple, salt, 16384, 8, 1, 44);
    var result = kdfResult.toString('hex').toString();
  })
  .add('lower 6 char',function(){
      var kdfResult = scrypt(passphraseLower6, salt, 16384, 8, 1, 44);
      var result = kdfResult.toString('hex').toString();
    })
    .add('lower 8 char',function(){
        var kdfResult = scrypt(passphraseLower8, salt, 16384, 8, 1, 44);
        var result = kdfResult.toString('hex').toString();
      })
      .add('printable  8 char',function(){
          var kdfResult = scrypt(passphrasePrint8, salt, 16384, 8, 1, 44);
          var result = kdfResult.toString('hex').toString();
        })
        .add('rand 10 char',function(){
            var kdfResult = scrypt(passphraseRand10, salt, 16384, 8, 1, 44);
            var result = kdfResult.toString('hex').toString();
          })
          .add('string 40 char',function(){
              var kdfResult = scrypt(passphraseString40, salt, 16384, 8, 1, 44);
              var result = kdfResult.toString('hex').toString();
            })
            .add('string 80 char',function(){
                var kdfResult = scrypt(passphraseString80, salt, 16384, 8, 1, 44);
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
*/
