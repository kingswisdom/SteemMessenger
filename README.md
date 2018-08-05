
# Steem Messenger V0.0.3
Chat securely with the power of Steem blockchain !

![](https://steemitimages.com/DQmb1nZtQbXzJsVfzFgwXkKnjKfKW3QEYxgEG8p7u2wDKD2/image.png)

### The Steem Messenger
___________________________________

#### What is the project about?

Steem Messenger is about convenience, security, and privacy. Many Steem users decided to use chats mediums like Discord, and Steemit.chat. Steem Messenger enables a secure and fast instant messaging interface between users on the Steem blockchain, without the need to trust your recipient, or any third party. The project is still in developpement stage.


#### Technology Stack

We use a powerful implementation of the `memo.encode` function readily available on the SteemJS lib. We use Javascript/HTMl/CSS for the front-end, and NodeJS for the server side. We use a *non-relationnal* database (NoSQL), MongoDB, for it's scalability, and to support high traffic volume. We use a 3 passes encryption protocol, which allow our database to be as safe as the Steem blockchain. Our database is permissioned, and every application that will connect to it in the future will have to respect the required protocol in order to CRUD (Create, Read, Update and Delete) on it, otherwise it will not get any permission. In order to achieve this, we created a module called **Lara**, which will act as the trusted intermediary between users, and frontends using our shared database.



### Features
__________________________________________

- **Instant Messaging**
As Steem Messenger is off-chain based, we can play around the block time limitation (3 seconds per block), and we don't need to constantly stream the blockchain to find if you just received a message.

-**Data transfer**
As we don't rely on transfers to send messages securely, we can also play around the memo size limitation (2kb), which gives us the ability to theoretically send any size of file. We thus added the possibility to encrypt images and files and to send them to your recipient. Note that it can take quite a lot of time to encrypt a large size image, so we restricted the size limit to 100 Kb **for the moment**. Files are not stored on our database **for the moment**, which means your receiver will only receive them if he is connected. It also means when you disconnect from the app, or refresh the page, the image will disappear from the chat.

- **A new and unique encryption key**
On your first login, you will automatically generate a new pair of encryption keys. This key will serve for your messages encryption only, and will never leave your computer. **We're thus proud to introduce the Steem Messenger pair of keys !**

- **An original way of verifying your identity on the Steem Blockchain**
To make the database truly secure and permissioned, we decided to use the memo pair of keys. When you send a message, you also send your private memo key to check your identity. This will preserve the database integrity, and makes it the first permissioned database on Steem ! We will never store any data/token/hash of your key on the Steem Messenger server, nor on Lara server. Plus, if someone achieve to steal your memo key, he would not be able to see your own messages, as they're encrypted with your Steem Messenger key. No MITM (Man In The Middle), no identity theft.

- **3 passes encryption**
With a clever use of the `steem.memo.encode` function, we achieved to build a real and unique by design end to end encryption. Every bit of data that leaves your computer is carefully encrypted : your message is encoded with your **Steem Messenger Private Key**, which means Lara and the server can't read your message. Then, informations about your message and your identity are encrypted with Lara's public key. The third pass is SSL, and brings a third layer of security.

- **Keep the control on your data**
With all the controversy about data leaks lately, we decided to give you full rights to your data. Sending private messages through the blockchain can be a real privacy concern : anybody can see with who you've been talking with, at what frequency, and can determine patterns in your behavior, conducting to massive data analysis. Not to mention the fact that you could not delete your messages, which poses a real problem if the encryption method used was broken. With Steem Messenger, you can easily with the click of a button delete your conversations, and leaving no track of it on the database. Plus, if the encryption method is broken someday, we can always modify our encryption algorithm, and make our database safe again.

- **Secure database**
All your messages are encrypted in your browser before they are sent to the server, providing you an E2EE (End to End Encryption). Meaning that only you and your recipient can read your own messages, as it would take 10,000 centuries to successfully brute force your Steem Messenger key with a regular computer. No institutional agency can actually decode your messages without your Steem Messenger key, which makes Steem Messenger a great medium of communication, far more secure than the actual market need.

- **No Active/posting permissions required**
We will never ever need your important keys to verify your identity. We believe the memo key is the perfect way to verify your identity without putting your account or funds at risk.

- **Widget interface**
Steem Messenger is designed for convenience, and modularity. As we want to extend the usage of this application to all the Steem ecosystem, we need to make a unique interface, that can fit in an extension for example.

- **User-friendly interface**
We believe mass adoption is achievable if the interface is easy to understand, and without complicated concepts. Any person can use this application, given the fact that they have a Steem account.


### How does it work?
_____________________________________

#### Client side


![](https://steemitimages.com/DQmULZJLEv6fdMZFXvdghaWhdzrG4nUtks9tPuPDvH4thPF/image.png)

Now, this webpage is just here to present the project. Everythings happen when you click on the Steem Messenger button on the bottom right.

![SM.gif](https://steemitimages.com/DQmYwtdrL13kHvdRZJ4cJnHVD6JR7fGrowDnee6S8GoBXZN/SM.gif)

You can connect to the interface by entering your personnal informations. Please remember you need exclusively your **private memo key**, as other keys would not work. Not to mention you should never use your active key and your passwords if you are not accessing your account's funds.

It will check the public memo key associated with your username (`pubWif = result[0]["memo_key"];`) and verify if the private key you specified is valid with `steem.auth.wifIsValid(privWif, pubWif);`. If everything is ok, your private key is then sent to Lara, which will verify your identity. The server will then send you a response, validating your credentials or not. If this is the first time you log in, you'll then automatically generate a new pair of keys with your own computationnal power (the process takes around 2 sec). Your keys are then stored in a encrypted state into your browser, and only you can decode those keys. You can also import/export keys, for exemple to share the same key between your phone and your computer.


![](https://steemitimages.com/DQmTTioiTaFt5DFmBtRTXtF1cGci812JRMKU8wZRsedf3U4/image.png)

Once you've logged in, you can now see your previous conversations you had ! You can also search for a recipient by name. Once you've selected your recipient, you'll automatically query the blockchain for your recipient's public memo key and encrypt your message with `var encoded = steem.memo.encode(uniquePrivateKey, publicMemoReceiver, text);`.

Here is how the function works :

![](https://steemitimages.com/DQmT9D1ovX8Gd38EUE6uMvpHqL9rRP2Yyw3t1rSCdzQFomf/image.png)

Your input is transmitted to Lara with `socket.emit`, and you can see how your message is encrypted before it goes to the server.

Once Lara receive your encrypted container, she will decrypt it with her private key and check if you are who you claim to be. If Lara validates your identity, she'll send your encrypted message and the delivery informations to the database, and tell to the server to deliver it to your recipient. Your memo key is deleted right after your identity confirmation.

Same thing when you receive a message, this is what happen :

![](https://steemitimages.com/DQmXm8XAvE7TbwzFefT1hKaA2HK1dhJF8fd5nugxo8Nmbkt/image.png)


The `raw` variable is the encrypted message received from the server. It is decoded with `var decoded = steem.memo.decode(ind.key, raw);`, and then, inserted in the chat box. Without your private Memo Key, nobody should be able to decode your message but you.


#### Server side

The server now has a new function. It automaticaly retrieves all the messages related to you from the database with `chat.find({tags: { $all: [user, receiver]}})`.

The server is now hosted on one of our domain, and we are starting our first private Beta testing session. More on this below.

![](https://steemitimages.com/DQmNfywPer1D5YpvEkH94QADezWGMTNtS3c2DyFASpx9J2L/image.png)

### Installation guide
______________________________________

To test this release, you need Node.js, and MongoDB.

Simply use `npm install` into the directory, start `mongod`, and then run type `npm start`. You can now launch `index.html` !

### Private Beta Session
_______________________________________

We are searching for a few people to test the messenger for a given period of time. Every person selected will have to choose one friend to test the application. If you are interested in testing one of the most exciting project on this blockchain, please feel free to submit your application in the comments section.

### Roadmap
___________________________________

We aim to be the most secure, fast, and reliable way to interact and chat with people/groups/guilds on the Steem blockchain. For now, we are working with the goal of delivering the first public release. Here are our next steps :

- Add previous conversations list
- Improve graphic style
- Add many features

### Changelogs
________________________________________

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
