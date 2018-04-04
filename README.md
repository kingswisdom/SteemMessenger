
# SteemMessenger V0.0.2
Chat securely with the power of Steem blockchain !

![](https://steemitimages.com/DQmb1nZtQbXzJsVfzFgwXkKnjKfKW3QEYxgEG8p7u2wDKD2/image.png)

### The Steem Messenger
___________________________________

#### What is the project about?

Steem Messenger is about convenience, security, and privacy. Many Steem users decided to use chats mediums like Discord, and Steemit.chat. Steem Messenger enable a secure and fast instant messaging interface between users on the Steem blockchain, without the need to trust your recipient, or any third party. This is a Proof of Concept. The project is still in developpement stage, and this release is not yet hosted on our servers.


#### Technology Stack

We use a combination of Javascript, and of course, HTML and CSS for the frontend. We also implemented the `require` function in our client side with  `Browserify`. We use `socket.io` , `socket.io-client` and `MongoDB`. `express` was added to dependencies, and will be used for the public release.

    

### Features
__________________________________________

For now, the features included are :

- **Login screen with client sided authority** 
With the power of the Steem blockchain, and a little bit of clever thinking, we created a login form that is both secure and trustless. Your login information is loaded in the browser, meaning that your private memo key is safe. 

- **Instant private end-to-end encrypted messaging, based on your account's keys**
With a clever use of the function `steem.memo.encode` included in `steemjs`, we made a chat system where only you and your recipient can read them. In case there is a data leak, your content will be safe, as long as you keep your private memo key in a safe place. 

- **Keep the control on your data**
With all the controversy about data leaks lately, we decided to give you full rights to your data. We believe your messages belongs to you. So we integrated a function to delete every message at once between you and your recipient. The *clear discussion* button gives you the ability to delete all the messages you own on the database in just one click, making this chat legal-proof, wich means it can't be used as a legal material. We believe a chat session should be just like talking to somebody in real life. We know words fly, and writing remains, so we decided to make the writing as volatil as speach.

- **Secure database**
All your messages are encrypted in your browser before they are sent to the server, providing you an E2EE (End to End Encryption). Meaning that only you and your recipient can read your messages, as it would take 10,000 centuries to successfully brute force your memo key with a regular computer. No institutional agency can actually decode your messages without your memo key, wich make Steem Messenger a great medium of communication. 

- **Unique webpage**
Steem Messenger is designed for convenience, and modularity. As we want to extend the usage of this application to all the Steem ecosystem, we need to make a unique interface, that can fit in an extension for example. 

- **User-friendly interface**
We believe mass adoption is achievable if the interface is easy to understand, and without complicated concepts. Any person can use this application, given the fact that they have a Steem account. 


### How does it work?
_____________________________________

#### Client side

We heavily upgraded the user interface, and added a lot of small functionnalities that adds up, and gives you this powerful communication tool. Here's the welcome page :

![](https://steemitimages.com/DQmULZJLEv6fdMZFXvdghaWhdzrG4nUtks9tPuPDvH4thPF/image.png)

Click on *Start*, and you'll be redirected to the login interface seamlessly.

![hello.gif](https://steemitimages.com/DQmcg9w45igZS7UqveSQcdL3mVwBuY3Uc9imq5fSm32jZLy/hello.gif)

You can connect to the interface by entering your personnal informations. Please remember you need exclusively your **private memo key**, as other keys would not work with the encryption feature. 

![](https://steemitimages.com/DQmVkk4tnSV76QKTjZKco7rCuMKRBLktKXVyDAfd46Tpsow/login.gif)

It will check the public memo key associated with your username (`pubWif = result[0]["memo_key"];`) and verify if the private key you specified is valid with `steem.auth.wifIsValid(privWif, pubWif);`. If everything is ok, your private key is then stored on a local var with `var privateMemoKey = privWif;`.

![](https://steemitimages.com/DQmQTY5LWYXXrm7uFfhDB3VuzRcZq832eCPahcXseaUPWoy/image.png)

Once you've logged in, you can then set your recipient name and your message in the specified form, and start messaging with your recipient.

Once you've chose your recipient, it will fetch automatically your recipient public memo key (`publicMemoReceiver = result[0]["memo_key"];`), and encrypt your message with `var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);`.

Here is how the function works :

![](https://steemitimages.com/DQmdiWR4XZ3x6tiH4FFUmHGMQQC3KaU7cf8a9kfor36MbL7/image.png)


Your input is transmitted to the server with `socket.emit`, and you can see your message is encrypted before it goes to the server. 

The data is then saved in the database.

Same thing when you receive a message, this is what happen :

![](https://steemitimages.com/DQmdqoGfxpnaZWTKSWsX6YSxSTdp5ci2QwEaefNSEAc2YoP/image.png)


The `raw` variable is the encrypted message received from the server. It is decoded with `var decoded = steem.memo.decode(privateMemoKey, raw);`, and then, inserted in the chat box. Without your private Memo Key, nobody should be able to decode your message but you.


#### Server side

The server now has a new function. It automaticaly retrieves all the messages related to you from the database with `chat.find({tags: { $all: [user, receiver]}})`. 

We also added a `process.env` variable pointing towards the database location to be ready when we'll deploy this application. We kept the local address to the database in the code for dev purpose.

![](https://steemitimages.com/DQmNfywPer1D5YpvEkH94QADezWGMTNtS3c2DyFASpx9J2L/image.png)

### Installation guide
______________________________________

To test this release, you need Node.js, and MongoDB. 

Simply use `npm install` into the directory, start `mongod`, and then run type `npm start`. You can now launch `index.html` !

### Roadmap
___________________________________

We aim to be the most secure, fast, and reliable way to interact and chat with people/groups/guilds on the Steem blockchain. For now, we are working with the goal of delivering the first public release. Here are our next steps :

- Automatically fetch all the user data from the blockchain. 
- Add receiver/sender profile's picture from Steem.
- Host the very first alpha public release.

### Changelogs
________________________________________

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
