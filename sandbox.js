const { Client, Intents, Message, MessageEmbed, User, MessageAttachment, Guild } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//importer json fil for å skjule token så det ikke blir resatt hver gang vi pusher botten til main
let config = require('./config.json');

const prefix ="+";

// GAME VARIABLES
let bankBalances = {};
// GAME VARIABLES

client.once('ready', (message) =>{
    client.user.setPresence({ activities: [{ name: '+help', type: 'PLAYING' }], status: 'online' });
    
    //Når botten skrus på, finn en kanal kalt disaster, deretter send en melding der hvor boten pinger alle.
    if(client.channels.cache.find(channel => channel.name === 'disaster')){

    const channel = client.channels.cache.find(channel => channel.name === 'disaster')

    const id = channel ? channel.id : null;

    client.channels.cache.get(`${id}`).send("@everyone disaster is online!");

    } else{
        const channel = client.channels.cache.find(channel => channel.name === 'general')

        const id = channel ? channel.id : null;

        client.channels.cache.get(`${id}`).send("You need to create a channel for disaster bot-on messages called [disaster]");
    }
});



client.on("messageCreate", message =>{
    function getBitcoin() {
    
        if (bankBalances[message.author.id] == null ) {
            bankBalances[message.author.id] = 10;
            message.channel.send("You were given 10 BTC")
        } else { 
            message.channel.send("You have already recieved your startup money")
        }
    }
    
    function bet() {
        if (args[2] > 4 || args[1] > bankBalances[message.author.id] || args[1] == null) {
            message.channel.send("You must have the amount of money you bet and bet on a random number from 1 to 4")
        } else if (args[2] == Math.round(Math.random()*4+1)) {
            bankBalances[message.author.id] += args[1]*4;
            message.channel.send(`You Won! New balance is ${bankBalances[message.author.id]} BTC`)
        } else {
            message.channel.send("Better luck next time!")
            bankBalances[message.author.id] -= args[1];
        }
    }

    
    //let mention = message.mentions.user.first();

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    switch (args[0]){
        case"help":
        case"Help":
            let embed = new MessageEmbed()
                    .setTitle(`Disaster bot`)
                    .addFields(
                        { name: 'getbitcoin', value: `get the bitcoin for your game :partying_face:`},
                        { name: 'bet', value: `Bet some bitcoin!`},
                        { name: 'bal', value: `shows you your bitcoin balance :moneybag:`},
                    )
                    .setColor("#0099ff")
                    .setAuthor("Helene,Jakob,Szymon")
                    .setTimestamp()
                message.channel.send({ embeds: [embed]});
        break;
        case "getTeamsMessages":
        break;

        // GAME SECTION //

        case "getbitcoin":
        case "Getbitcoin":
        case "get":
        getBitcoin();
        break;

        case "bet":
              bet();
        break;
        case "bal": 
        case"Balance": 
        case "balance":
        message.channel.send(`You have ${bankBalances[message.author.id]} BTC`);
        break;
        case"value":
                async function fetch(){
                const fetch = require("node-fetch");
                let data = await fetch(`http://api.coinlayer.com/api/live?access_key=223df91f83bcba306ce587bce6cc0fd8`).then(res =>
                res.json()) .catch(console.error())
                let btcvalue = Math.round(bankBalances[message.author.id] * data.rates.BTC);
                let embed1 = new MessageEmbed()
                    .setTitle(`Your bitcoin value:`)
                    .addFields(
                        {name:"your bitcoin: ", value: `${bankBalances[message.author.id]}`},
                        {name: "value: ", value: `${btcvalue} $`}
                    )
                    .setColor("#0099ff")
                    .setTimestamp()
                message.channel.send({ embeds: [embed1]});
                };
                fetch();
        break;
        default:
            message.channel.send("this is not a valid command, to see all commands type +help");
        break; 
    };
});
client.login(config.token);




