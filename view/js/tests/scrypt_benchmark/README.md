Benchmark and configuration for scrypt
-------------------------------------
We use https://github.com/bestiejs/benchmark.js/
First download benchmark.js, platform.js and lodash.js.
Second bundle the benchmmark js for the browser:

```
browserify tests.js -o bundle.js
```

Now fire ```index.html``` in your browser and look in the console for the result.

## Some results
Settings: VM with 2 cpus, 3GB of RAM running Ubuntu
Using directly ```node tests.js``` (outside of the browser)
```
========================
starting Benchmark
========================
default x 0.38 ops/sec ±14.89% (6 runs sampled) => average time 2.651413617 seconds
power15 x 0.24 ops/sec ±1.35% (5 runs sampled) => average time 4.1795559346 seconds
power16 x 0.12 ops/sec ±1.62% (5 runs sampled) => average time 8.406441287000002 seconds
power17 x 0.06 ops/sec ±5.65% (5 runs sampled) => average time 17.863167007 seconds
power18 x 0.03 ops/sec ±2.32% (5 runs sampled) => average time 36.5808561954 seconds
Fastest is default

```
In Firefox I get:
```
========================
starting Benchmark
========================
default x 0.72 ops/sec ±7.56% (6 runs sampled) => average time 1.3905 seconds
power15 x 0.33 ops/sec ±18.72% (5 runs sampled) => average time 3.0620000000000003 seconds
power16 x 0.18 ops/sec ±7.46% (5 runs sampled) => average time 5.6842 seconds
power17 x 0.08 ops/sec ±14.08% (5 runs sampled) => average time 12.9344 seconds
power18 x 0.10 ops/sec ±2.06% (5 runs sampled) => average time 10.2472 seconds
Fastest is default
```

## Scrypt Parameters explanation
* scrypt article
* ethereum wallet (2^18): https://ethereum.stackexchange.com/questions/37150/ethereum-wallet-v3-format
* filippo explanation: https://blog.filippo.io/the-scrypt-parameters/
* ethereum wallet cracker : https://stealthsploit.com/2018/01/04/ethereum-wallet-cracking-pt-2-gpu-vs-cpu/
*  https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2015/march/enough-with-the-salts-updates-on-secure-password-schemes/

## Choice:
I recommend ```N=2^16, r=8, p=1```. I would like to increase ```N``` to ```2^18``` (remember the default is ```2^14```). An attacker will not use Javascript code to attack so we are only making her job easier if we can not wait a bit longer to use our keys.
## Why do we need Scrypt?  A history of password cracking
