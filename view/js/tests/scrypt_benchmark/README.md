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
default x 0.20 ops/sec ±7.02% (5 runs sampled) => average time 4.9214229959999996 seconds
power16 x 0.10 ops/sec ±16.18% (5 runs sampled) => average time 10.213542985 seconds
power17 x 0.05 ops/sec ±10.16% (5 runs sampled) => average time 20.036429998400003 seconds
power18 x 0.05 ops/sec ±7.91% (5 runs sampled) => average time 20.8626994698 seconds
Fastest is default

```
In Firefox I get:
```
========================
starting Benchmark
========================
default x 0.30 ops/sec ±12.16% (5 runs sampled) => average time 3.3468000000000004 seconds
power16 x 0.15 ops/sec ±3.72% (5 runs sampled) => average time 6.8134 seconds
power17 x 0.07 ops/sec ±15.61% (5 runs sampled) => average time 13.978800000000001 seconds
power18 x 0.08 ops/sec ±18.22% (5 runs sampled) => average time 12.216800000000001 seconds
Fastest is default
```

## Scrypt Parameters explanation
* scrypt article
* ethereum wallet (2^18): https://ethereum.stackexchange.com/questions/37150/ethereum-wallet-v3-format
* filippo explanation: https://blog.filippo.io/the-scrypt-parameters/
* ethereum wallet cracker : https://stealthsploit.com/2018/01/04/ethereum-wallet-cracking-pt-2-gpu-vs-cpu/

## Choice:
I recommend ```N=2^16, r=8, p=1```. I would like to increase ```N``` to ```2^18```. An attacker will not use Javascript code to attack so we are only making her job easier if we can not wait a bit longer to use our keys.
## Why do we need Scrypt?  A history of password cracking
