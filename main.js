"use strict";
const request = require('request');
const discord = require('discord.js');
const client = new discord.Client();
//const config = require('./config.json')

//let api = config.api;
//let token = config.token;
//let ownerID = config.ownerID

let ownerID = process.env.owner
let api = process.env.api 
let token = process.env.token

let prefix = '?';
let jokeapi = 'https://icanhazdadjoke.com/'
let c = 'bot-commands'

function unixtodate(unix){
	var date = new Date(unix);
	var time = date.toLocaleTimeString()
	var dates = date.toLocaleDateString()
	var extended = dates +' '+ time
	return extended
}
function filter(msg,channel){
	if (msg.channel.name == channel){
		return true
	} else {
		return false
	}
}

function empty(array){
	if(array.length == 0){
		return "No More :frowning:"
	} else {
		return array
	}
}

client.on('ready', ()=>{
	console.log(`Discord bot: ${client.user.tag}`)
});

function isCommand(string){
	if ( string.startsWith(prefix) ){
		const command = string.toLowerCase().split(' ')[0].substr(1);
		return command;
	} else {
		return null;
	}
}

client.on('message', msg =>{
	const command = isCommand(msg.content)
	const messages = msg.content
	const owner = msg.author.id
	if (command == 'ping'){
		const EmbedText = new discord.MessageEmbed()
			.setTitle('Honk')
			.setColor(0xff0000)
			.setDescription('Honk Honk')
		msg.channel.send(EmbedText)
	} else if (command == 'uuid'){

		const name = messages.substr(messages.toLowerCase().indexOf('uuid') + 5)

		if (name == ''){
			msg.channel.send(`You forgot to add a name. Example: ${prefix}uuid [NAME/PLAYER]`)
			return;
		}
		if (filter(msg,'bot-commands') == false) {
			msg.channel.send("You can't use commands here.")
			return;
		}
		request({
			method: 'GET',
			url: 'https://api.mojang.com/users/profiles/minecraft/'+name,
			json: true
		}, (err,req,body) => {
			if (body == undefined){
				msg.channel.send('Undefined player')
				return;
			} else {
				const embed = new discord.MessageEmbed()
					.setTitle('UUID FOR ' + name.toUpperCase())
					.setDescription(body.id)
				msg.channel.send(embed)
			}
		})
	} else if (command == 'guild'){
		const guilds = messages.substr(messages.toLowerCase().indexOf('guild') + 6)
		if (filter(msg, c) == false) {
			msg.channel.send("You can't use commands here.")
			return;
		}
		if (guilds == ''){
			msg.channel.send(`You forgot to add a name. Example: ${prefix}guild [GUILDNAME]`)
			return;
		}
		request({
			method: 'GET',
			url: 'https://api.hypixel.net/guild?key='+api+'&name='+guilds,
			json: true
		}, (err,req,body) => {
			if (body == undefined){
				msg.channel.send("Undefined guild")
				return
			} else if(body.guild == null){
				msg.channel.send("Undefined guild")
			}else {
				let timestamp = body.guild.created;
				let players = []
				var i
				if (body.guild == null){
					msg.channel.send("Undefined guild")
					return;
				}else{
					for(i in body.guild.members){
						let newi = i
						let rank = body.guild.members[i].rank;
						request({
								method: 'GET',
								url: 'https://api.mojang.com/user/profiles/'+body.guild.members[i].uuid+'/names',
								json: true
							}, (err,req,bodys) => {
								let getlength = bodys.length
								players.push("Player: **"+bodys[getlength - 1].name + '**   Rank: ' + rank +'\n')
								if (newi == body.guild.members.length - 1 || newi == 14){
									const embed = new discord.MessageEmbed()
										.setTitle("GUILD PLAYER")
										.setColor(0x000ff)
										.setDescription("Created: "+unixtodate(timestamp)+"\n"+"Only 15 or more players max to see"+"\n"+empty(players))
										.setFooter("Jashli Bot")

									msg.channel.send(embed)
								}
								
							})
					};
				}

			}
		})
	} else if (command == 'status'){
		const name = messages.substr(messages.toLowerCase().indexOf('status') + 7)
		if (filter(msg,c) == false) {
			msg.channel.send("You can't use commands here.")
			return;
		}
		if (name == '') {
			msg.channel.send(`You forgot to add a name. Example: ${prefix}status [PLAYER/NAME]`)
			return;
		}
		request({
			method: 'GET',
			url: 'https://api.mojang.com/users/profiles/minecraft/' + name,
			json: true
		}, (err,req,body) => {
			if (body == undefined) {
				msg.channel.send('Undefined player')
				return;
			} else {
				let uuid = body.id;
				request({
					method: 'GET',
					url: 'https://api.hypixel.net/status?key='+api+'&uuid='+ uuid,
					json: true
				}, (err,req,bodys) => {
					if (bodys == undefined){
						msg.channel.send('Non hypixel player or API off')
						return
					} else {
						if (bodys.session.online == false){
							msg.channel.send("Sorry, this player is Offline")
						} else if (bodys.session.online) {
							const embed = new discord.MessageEmbed()
								.setTitle("Player Activity")
								.setDescription(bodys.session.gameType)
							msg.channel.send(embed)
						}
					}
				})
			}
		})

	} else if (command == 'flip'){
		let mathsthing = Math.round(Math.random() * 100)
		msg.channel.send("Congratulations, You've made "+mathsthing+ "M today.")
	} else if (command == 'prefix'){
		const newprefix = messages.substr(messages.toLowerCase().indexOf('prefix') + 7);
		if (owner != ownerID){
			msg.channel.send("Sorry, you don't have permission to use this command")
			return
		}
		if (newprefix.length != 1){
			msg.channel.send("Can't man you said only 1 in length")
			return
		}
		if (newprefix == ''){
			msg.channel.send(`You forgot to add the prefix. Example: ${prefix}prefix '?'`)
			return
		}
		if (newprefix == '!' || newprefix == '?' || newprefix == '.' || newprefix == '/' || newprefix == '$' || newprefix == '-'){
			prefix = newprefix
			msg.channel.send(`New prefix is now [${newprefix}]`)
		} else {
			msg.channel.send('Your input is not in my database')
		}
	} else if (command == 'help'){
		const embed = new discord.MessageEmbed()
			.setTitle("List of my Commands")
			.setColor(0x000ff)
			.setDescription(`${prefix}help\n${prefix}uuid\n${prefix}guild\n${prefix}status\n${prefix}history`)
		msg.channel.send(embed)
	} else if (command == 'history'){
		const name = messages.substr(messages.toLowerCase().indexOf('history') + 8)
		if (filter(msg,c) == false) {
			msg.channel.send("You can't use commands here.")
			return;
		}
		if (name == ''){
			msg.channel.send(`You forgot to add the name. Example: ${prefix}history [NAME]`)
			return
		}
		request({
			method: 'GET',
			url: 'https://api.mojang.com/users/profiles/minecraft/' + name,
			json: true
		}, (err, req,body) => {
			if (body == undefined){
				msg.channel.send("Undefined Player")
				return
			}
			let uuid = body.id;
			if (body == undefined){
				msg.channel.send("Request denied. Reason: Undefined player")
				return
			} else {
				request({
					method: 'GET',
					url: 'https://api.mojang.com/user/profiles/'+uuid+'/names',
					json: true
				}, (err,req,bodys) => {
					if (body ==  undefined){
						msg.channel.send("Request denied. Reason: Undefined player")
						return
					} else {
						let i;
						let playerName = []
						for(i in bodys){
							if (i == 0){
								playerName.push("Firstname: "+bodys[i].name)
							} else {
								playerName.push("Oldnames: "+bodys[i].name+ " ChangedtoAt: " +unixtodate(bodys[i].changedToAt))
							}
							if (i == bodys.length - 1){
								playerName.push("Latest name: "+bodys[i].name)
								const embed = new discord.MessageEmbed()
									.setTitle("Name history of "+name)
									.setDescription(playerName)
								msg.channel.send(embed)
							}
						}
					}
				})
			}
		})
	} else if (command == 'joke') {
		request({
			method: 'GET',
			url: jokeapi,
			json: true
		}, (err, req, body) => {
			msg.channel.send(body.joke)
		})
	} else if (command == 'channel') {
		const name = messages.substr(messages.toLowerCase().indexOf('channel') + 8)
		if (owner != ownerID){
			msg.channel.send("Sorry, you don't have permission to use this command")
			return
		}
		if (name == ''){
			msg.channel.send(`You forgot to add the name. Example: ${prefix}channel [NAME]`)
			return
		}

		c = name
		msg.channel.send("Filter changed")
	} else if (msg.content == 'I love you'){
		msg.react('❤️')
	} else if (command == 'poll'){
		const string = messages.substr(messages.toLowerCase().indexOf('poll') + 5)
		if (string == ''){
			msg.channel.send(`You forgot to add a text. Example: ${prefix}poll`)
			return
		}
		let array = string.split(',')
		if (array.length != 2){
			msg.channel.send("My max poll is only 2 :frowning:")
			return
		}


		let emoji = ["👍", "👎"] // for two

		const embed =new discord.MessageEmbed()
			.setTitle('Vote here')
			.setDescription(emoji[0]+' '+array[0]+ '\n\n'+ emoji[1] +' ' + array[1])
		msg.channel.send(embed).then(sentMessage => {sentMessage.react(emoji[0]).then(()=> {sentMessage.react(emoji[1])})})
	}
})


client.login(token)


// UUID Examples
//22ede0d98eb848bcaadff53553bd39b0
//069a79f444e94726a5befca90e38aaf5
//1d449dbed9e343bba9575a3f5992944a
//699496284c1f4174bce8f3c90ea467f2