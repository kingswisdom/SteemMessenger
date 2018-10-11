The Steem Messenger !
______________________________

![](https://steemitimages.com/DQmb1nZtQbXzJsVfzFgwXkKnjKfKW3QEYxgEG8p7u2wDKD2/image.png)

Chat securely with the power of the Steem blockchain !

https://github.com/kingswisdom/SteemMessenger

### About the project

Steem Messenger aims to be the ultimate chat application for the Steem blockchain.

Designed for privacy, with the clever use of the Private Memo Key to authenticate yourself into the Messenger's network, you'll soon be able to safely engage with everybody on the Steem social network without needing anything more than your recipient username.

### Technology stack

For the frontend, we use Javascript in a *NodeJS style* thanks to `Browserify`. The backend is written in NodeJS, and uses MongoDB as a database.

We use the Steem blockchain as a Decentralized Public Key Infrastructure (DPKI).

User authentication is done by a fix hmac derivation from the private memo key. The user also authenticates the server with the same method.

The encryption is made with AES-GCM, for its security, and also performance.

We use a local encrypted wallet to store user keys, like the memo private key. This wallet is secured with a password derived with Scrypt. 

### Installation guide

To test this release, you need Node.js, and MongoDB.

Simply use `npm i` into the directory, start `mongod`, and then type `npm run start`. You can now go to `localhost:4000` !

### Changelogs
________________________________________

##### 0.0.6 :
- Complete redesign of the client/server logic
- SafeSocket module created
- SafeStorage module created (Scrypt)
- Switched the encryption from steem.memo to AES-GCM 
- Added a filter to reject leaked keys connexion
- Blacklist added and fully fonctionnal
- Whitelist added, not functionnal yet
- Import/export wallet functions
- *Settings* section added

##### 0.0.5 :
- Lara Module updated for better cryptography
- Triple Dose Encryption Algorithm™ updated
- Creation of the encrypted wallet on the localStorage
- Creation of the passphrase creation/login screen 
- Various bugs corrected
- Total reorganization of the code, with modules and submodules (login.js, storage.js, UI.js...)

##### 0.0.4 :
- Creation of the Lara™ module
- Triple Dose Encryption Algorithm™
- Creation of the Steem Messenger™ set of public/private keys
- *Previous discussions* section added 
- Various bugs corrected
- Improved user interface
 
##### 0.0.3 :
- Widget interface
- Total rework of the code
- Added images and files encryption (restricted to < 100 Kb files)
- Added a "return" button to return to receiver selection
- Application deployed successfully !
- Various tweaks and optimizations
- Private Beta Testing session

##### 0.0.2 :
- Improved user interface
- Added functions to client.js to interact with the index.html
- Added login interface
- Now you receive only messages that are related to you
- The *clear* function now delete only the data related to you
- Preparing the code to be deployed online with `express`
- A `process.env` variable was added, the mongo database is now ready to deploy safely

##### 0.0.1 :
- Encode/decode function created
- Using `socket.io` and `mongodb` to build the chat
- Verifies authority localy on your browser
- As a first release, you received every encoded messages from the database
- *clear* all messages function
- Simple UI
- Proof of concept released

### Contribution
___________________________________

If you would like to contribute to this project, or have any question about it, feel free to contact me on Discord @Kingswisdom#7650, or on [github](https://github.com/kingswisdom)
