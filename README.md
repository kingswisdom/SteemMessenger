# SteemMessenger V0.0.1
Chat securely with the power of Steem blockchain !

In this post, I will explain the SteemMessenger Project, the state of developpement, features, and how everything works !

![](https://steemitimages.com/DQmX7bzCq1jxYxb8FyzyTt2Xp3xLMwCy8TcVgm9M8mpNDEZ/image.png)

### The Steem Messenger

- What is the project about?
Steem Messenger is about convenience, security, and privacy. Many Steem users decided to use chats mediums like Discord, and Steemit.chat. Steem Messenger enable a secure and fast instant messaging interface between users on the Steem blockchain, without the need to trust your recipient, or any third party. This is a Proof of Concept. The project is still in developpement stage, and this release is not yet hosted on our servers.


- Technology Stack
We use a combination of Javascript, and of course, HTML and CSS for the frontend. We also implemented the `require` function in our client side with  `Browserify`. We use `socket.io` , `socket.io-client`and `MongoDB`.

    

### Features
__________________________________________

For now, the features included are :


- Client sided authority. You no longer have to trust anybody for your keys. Everything runs directly on your browser, meaning that your private memo key is safe. 

- Sending/Receiving encrypted messages, based on your account's keys.
With a clever use of the function `steem.memo.encode` included in `steemjs`, we made a chat system where only you and your recipient can read them. In case there is a data leak, your content will be safe, as long as you keep your private memo key in a safe place. 

- Delete messages. We believe your messages belongs to you. So we integrated a function to delete every message between you and your recipient. 

- Secure database. All messages are encrypted in your browser before they are sent to the server, providing you an E2EE (End to End Encryption). Meaning that only you and your recipient can read your messages, as it would take 10,000 centuries to successfully brute force your memo key with a regular computer.




### How does it work?
_____________________________________

First, the client side (`client.js`). Here is the log in screen.

![](https://steemitimages.com/DQmQETvDFXKCewftSu54BNzFDaRFKhL4562qpAGKKUTcpFD/image.png)

When you enter your private memo key, and press "Log in", this is what happens :
![](https://steemitimages.com/DQmfYhUuu4A61Bs9Lr3N3HE2CcSA4THBpGMUEXTSVFfDg91/image.png)

It will check the public memo key associated with your username (`pubWif = result[0]["memo_key"];`) and verify if the private key you specified is valid with `steem.auth.wifIsValid(privWif, pubWif);`. If everything is ok, your private key is then stored on a local var with `var privateMemoKey = privWif;`.

You will then have access to the chat page like this :

![](https://steemitimages.com/DQmQh5wcErp5cP2APyJvBrdieqfGZ3JoeQrrjhY7Xbj5xkT/image.png)

You can then set your recipient name and your message in the specified forms. Press enter, and this will happen :

![](https://steemitimages.com/DQmWLngvAtje5BNeA9N8U4hzhHeSijRGE89BxXDQJfBUmqM/image.png)

It will fetch automatically your recipient public memo key (`publicMemoReceiver = result[0]["memo_key"];`), and encrypt your message with `var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);`.

Your input is transmitted to the server with `socket.emit`, and you can see your message is encrypted before it goes to the server. 

The data is then saved in the database.

Same thing when you receive a message, this is what happen :

![](https://steemitimages.com/DQmbktYGPk7eVtvaBeL2h9eHhRRZypy2k62HLZ8hZeKT1ym/image.png)

The `raw` variable is the encrypted message received from the server. It is decoded with `var decoded = steem.memo.decode(privateMemoKey, raw);`, and then, inserted in the chat box. Without your private Memo Key, nobody should be able to decode your message but you.

![](https://steemitimages.com/DQmZMBcyLdP1bzyhB6PnGgXB7LNNqhTCS5PDeZPgUwT8G3J/image.png)



### Roadmap

We aim to be the most secure, fast, and reliable way to interact and chat with people/groups/guilds on the Steem blockchain. For now, we are working with the goal of delivering the first public release. Here are our next steps :

- Add many social functionalities
- Multiple chats 
- Improve UI 

### Contribution

If you would like to contribute to this project, or have any question about it, feel free to contact me on Discord @Kingswisdom#7650, or on [github](https://github.com/kingswisdom)
