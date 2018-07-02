

# Steem Messenger™ V0.0.5
Chat securely with the power of Steem blockchain !

![](https://steemitimages.com/DQmb1nZtQbXzJsVfzFgwXkKnjKfKW3QEYxgEG8p7u2wDKD2/image.png)

### The Steem Messenger™
___________________________________

#### What is the project about?

Steem Messenger™ is about convenience, security, and privacy. Many Steem users decided to use chats mediums like Discord, and Steemit.chat. Steem Messenger enables a secure and fast instant messaging interface between users on the Steem blockchain, without the need to trust your recipient, or any other third party. 

To make this secure and private, we use what we call the **Triple Dose Algorithm™**. Because your data is important, we carefully apply this algorithm to all messages in the network, which gives us confidence about the security and privacy of interactions between you, users, frontends, and the database.

This project is more than messaging. It is about data transfer of any type. With Steem Messenger™, you will now soon be able to chat, make a phone call, video calls, all securely, and with a great level of privacy. But not only ! You could also connect a smart object to the network, give it a username, and it would be a secure, fast, and private way to send intructions to that object. A Steem IoT ? Why not !

Our database is permissioned, and can be opened for developpers to create any frontend for it. For doing so, we created **Lara™**, a special module that will act as the trusted intermediary of the network. 

![](https://steemitimages.com/DQmNbXmHZkUTF5QrS4CPfqhPV2zZvPgWrpvxr11H5Vfquop/image.png)

The project is still in developpement stage, but has a private beta. If you wish to test the application, feel free to contact me on Discord `@Kingswisdom#7650`.


#### Technology Stack

We use a powerful implementation of the `memo.encode` function readily available on the SteemJS lib. We use Javascript/HTML/CSS for the front-end, and NodeJS for the server side. 

To support high traffic volume, for scalability, and to avoid hurting our beloved Steem Blockchain, we decided to use a *non-relationnal* database (NoSQL), MongoDB, for it's convenience and performance.

We modified our encryption system, and now, we use a 3 passes encryption protocol (the Triple Dose Algorithm™), which allow our database to be as safe as the Steem blockchain. 

Our database is permissioned, and every application that will connect to it in the future will have to respect the required protocol in order to CRUD (Create, Read, Update and Delete) on it, otherwise, it will not get any permission. This protocol respects users privacy, and gives the database it's secure nature. In order to achieve this, we created a module called **Lara™**, which will act as the trusted intermediary between users, and frontends using our shared database.



### Features
__________________________________________

- **Instant Messaging**
As Steem Messenger™ is off-chain based, we can play around the block time limitation (3 seconds per block), and we don't need to constantly stream the blockchain to find if you just received a message. Every time you receive a message, a notification sound will occur, so you'll never miss one !

- **Data transfer**
Data transfer has been one of our major concern lately and we needed to optimize the speed of encryption. We thus started to update the encryption method, in the goal of using a symmetric encryption key.

- **A new and unique encryption key**
On your first login, you will automatically generate a new pair of encryption keys. This key will serve for your messages encryption only, and will never leave your computer. **We're thus proud to introduce the Steem Messenger™ pair of keys !**

- **An original way of verifying your identity on the Steem Blockchain**
To make the database truly secure and permissioned, we decided to use the memo pair of keys. When you send a message, you also send a token generated from your private memo key to check your identity. This will preserve the database integrity, and makes it the first permissioned database on Steem ! We will/can never store or access any data/token/hash of your key on the Steem Messenger™'s server, nor on Lara™'s server. No MITM (Man In The Middle), no identity theft.

- **3 passes encryption**
With a clever use of the `steem.memo.encode` function, we achieved to build a real and unique by design end to end encryption. Every bit of data that leaves your computer is carefully encrypted : your message is encoded with your **Steem Messenger™ Private Key**, which means Lara™ and the server can't read your messages. Then, informations about your message and your identity are encrypted with Lara™'s public key. The third pass is SSL, and brings a third layer of security. **We're proud to unveil the Triple Dose Algorithm™.**

- **Keep the control on your data**
With all the controversy about data leaks lately, we decided to give you full rights to your data. Sending private messages through the blockchain can be a real privacy concern : anybody can see with who you've been talking with, at what frequency, and can determine patterns in your behavior, conducting to massive data analysis. 
Not to mention the fact that your messages on the blockchain are permanent, which poses a real problem if the encryption method used was broken. 
With Steem Messenger™, you can easily, with the click of a button, delete your conversations, leaving no track of it on the database. Plus, if the encryption method is broken someday, we can always modify our encryption algorithm, apply it to the whole database, and make it safe again.

- **Secure database**
All your messages are encrypted in your browser before they are sent to the server, providing you an E2EE (End to End Encryption). Meaning that only you and your recipient can read your own messages, as it would take 10,000 centuries to successfully brute force your Steem Messenger key with a regular computer. No institutional agency can actually decode your messages without your keys, which makes Steem Messenger™ a great medium of communication, far more secure than the actual market need.

- **Modularity is here**
With the help of the great companion **Lara™**, we are now able to share our database with other frontends developers. They will no longer have to find a solution for the authentication process and the security of an off chain database. At Steem Messenger™, we believe this factor will make the number of apps in the Steem ecosystem flourish, given the number of possibilities. From data hosting, to any kind of off chain transactions that only requires your identity to be proven.

- **No Active/posting permissions required**
We will never ever need your important keys to verify your identity. We believe generating a session token from the memo key is the perfect way to verify your identity through the Steem Blockchain without putting your account or funds at risk.

- **Widget interface**
Steem Messenger™ is designed for convenience, and modularity. As we want to extend the usage of this application to all the Steem ecosystem, we need to make a unique interface, that can fit in an extension for example.

- **User-friendly interface**
We believe mass adoption is achievable if the interface is easy to understand, and without complicated concepts. Anybody can use this application, given the fact that they have a Steem account.


### How does it work?
_____________________________________

#### Client side


![](https://cdn.steemitimages.com/DQmXwpJnVxr6ZfJUehdzJFaq3QjrUF8WzR71Wzm8A5FZpUX/image.png)

Now, this webpage is just here to present the project. Everythings happen when you click on the Steem Messenger™ button on the bottom right.

The graphic style was enhanced, providing a beautiful minimalist interface, that can integrate easily with any Steem based front-end.

You can connect to the interface by entering your personnal informations. Please remember you need exclusively your **private memo key** for your first login, as other keys would not work. Not to mention you should never use your active key and/or your master key if you are not accessing to your account's funds.

![](https://steemitimages.com/DQmPT5JhdAB4U4UaaZEh5j7WcxwpXyx9xAL7iTNegY1a6VC/image.png)

Thanks to @cryptohazard, the cryptography of Steem Messenger was updated, and has yet to be greatly improved, by adding ephemeral keys for getting forward secrecy, or switch the memo encryption to a faster method (AES-GCM).

For the moment, the app will check the public memo key associated with your username (`pubWif = result[0]["memo_key"];`) and verify if the private key you specified is valid with `steem.auth.wifIsValid(privWif, pubWif);`. If everything is ok, it will generate an authentication token between you and Lara, and then send it to the server in a encrypted state. The server will then send you a response, validating your credentials or not. If this is the first time you log in, you'll then automatically generate a new pair of keys with your own computational power (the process takes around 2 sec). 

- [`login.js`](https://github.com/kingswisdom/SteemMessenger/blob/main/assets/js/login.js)
![](https://cdn.steemitimages.com/DQmeZWu7doP3q1jCZo7xqFcNnrvoSm7TFoZFHbk1PUZFsN3/image.png)

Once you've logged in, you can now see your previous conversations you had ! You can also search for a recipient by name. Once you've selected your recipient, you'll automatically query the blockchain for your recipient's public memo key and encrypt your message with `var encoded = steem.memo.encode(uniquePrivateKey, publicMemoReceiver, text);`.

Here is how the function works :
- [`SM.js`](https://github.com/kingswisdom/SteemMessenger/blob/main/assets/js/SM.js)

![](https://cdn.steemitimages.com/DQmQXEmDfm7uSxrQFeFutwbJBPmtC4zvMQ4BHy4ffNEgvJ8/image.png)

- [`client.js`](https://github.com/kingswisdom/SteemMessenger/blob/main/assets/js/client.js)

![](https://steemitimages.com/DQmX8cWfzUMYFNVzTNQHQcp3deU8AHuRfcZHXu1ZTD9N7Gx/image.png)

Your input is transmitted to Lara™ with `socket.emit`, and you can see how your message is encrypted before it goes to the server.

Once Lara™ receive your encrypted container, she will decrypt it with her private key and check if you are who you claim to be. If Lara™ validates your identity, she'll send your encrypted message and the delivery informations to the database, and tell to the server to deliver it to your recipient. Your session token isn't stored on the server nor by Lara.

Same thing when you receive a message, you can see in SM.js, the client will decode the container and append it to your conversation.

- [`SM.js`](https://github.com/kingswisdom/SteemMessenger/blob/main/assets/js/SM.js)

![](https://steemitimages.com/DQmXm8XAvE7TbwzFefT1hKaA2HK1dhJF8fd5nugxo8Nmbkt/image.png)


The `raw` variable is the encrypted message received from the server. It is decoded with `var decoded = steem.memo.decode(ind.key, raw);`, and then, inserted in the chat box. Without your private Memo Key, nobody should be able to decode your message but you.


#### Server side

We updated the serverdb.js, which handles the Mongo database. The previous implementation didn't work as needed, and so we updated this module. Now the data is handled correctly, and it solved a major issue where users could not see incoming messages on the "Recent discussions" screen.  



### Installation guide
______________________________________

To test this release, you need Node.js, and MongoDB.

Simply use `npm install` into the directory, start `mongod`, and then run type `npm start`. You can now launch `index.ejs` !

### Private Beta Session
_______________________________________
For now, we cannot allow the public beta to be released, even though the app is ready to be used as is. The only reason retaining us is the fact that a lot of users leaked their memo keys on the blockchain lately. We will take the time to query the blockchain to find every memo key out there, and build a script that will verify if the key is a leaked one or not. By doing so, we will be able to avoid every identity theft attempts. 

### Roadmap
___________________________________

We aim to be the most secure, fast, and reliable way to interact and chat with people/groups/guilds on the Steem blockchain. For now, we are working with the goal of delivering the first public release. Here are our next steps :

- Verify if the memo key was leaked and block the connection if so
- Finish the setup of the server
- Prepare API points and API documentation
- Add a settings section, in which you can choose the language, and many more important settings to give you the best experience
- A *blacklist user* option will be added
- Better emojis ! 
- Improve graphic style
- And many secret features

### Changelogs
________________________________________
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
