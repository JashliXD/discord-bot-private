"use strict";
const request = require('request');
const discord = require('discord.js');
const client = new discord.Client();
//const config = require('./config.json')

//let api = config.api;
//let token = config.token;
//let ownerID = config.ownerID

let swearList = ['fuck','nigga','nigger','fuk','jackass','idiot','idiut','jackas','fuck you','fu\'ck', 'f\'uck','motherfucker','you son of a bitch','asshole', 'dickhead'] // To delete message with
let sweardetection = ["Please stop swearing", "Swear Detected", "Don't swear", "Batō o yamete kudasai", "Yamate"]
let ezlist = ["Wait... This isn't what I typed!","Anyone else really like Rick Astley?","Hey helper, how play game?", "Sometimes I sing soppy, love songs in the car.","I like long walks on the beach and playing Hypixel","Please go easy on me, this is my first game!","You're a great person! Do you want to play some Hypixel games with me?","In my free time I like to watch cat videos on Youtube", "When I saw the witch with the potion, I knew there was trouble brewing.", "If the Minecraft world is infinite, how does the sun revolve around it?","Hello everyone! I am an innocent player who loves everything Hypixel.","Plz give me doggo memes!"]
let version = '1.1.9'

let ownerID = process.env.ownerID
let api = process.env.api 
let token = process.env.token

let prefix = '?';
let jokeapi = 'https://icanhazdadjoke.com/'

let remember = []


let url = 'https://waifupictures.000webhostapp.com/waifu/'
let animelist = ['AkiraKogami.jpg', 'Ayaki.png', 'Chika.jpg', 'Jasmine.jpg', 'Ichika.png', 'KiraraBernstein.jpg', 'Kyouko.jpg', 'Makina_Irisu.png', 'Rem.jpg', 'REMILIA_SCARLET.jpg', 'Shiro.png', 'Yoshino.png']
let animename = ['Akira Kogami', 'Kamisato Ayaka', 'Chika Fujiwara', 'Jasmine Kashiro', 'Ichika Nakano', 'Kirara Bernstein', 'Kyouko Hori', 'Makina_Irisu', 'Rem', 'Remilia Scarlet', 'Shiro', 'Yoshino Himekawa']
console.log(animename.length, animelist.length)
let randomized;
let randomized2;
let randomhypixel;
let randomsweardetect;
function unixtodate(unix){
	var date = new Date(unix);
	var time = date.toLocaleTimeString()
	var dates = date.toLocaleDateString()
	var string = dates +' '+ time
	return string
}


function empty(array){
	if(array.length == 0){
		return "No More :frowning:"
	} else {
		return array
	}
}

function m(n,d){
	x=(''+n).length,p=Math.pow,d=p(10,d)
	x-=x%3
	return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3]
}


function isitalic(text){
	if(text.startsWith('_') && text.endsWith('_')){
		const str = '\\'+text
		return str
	} else {
		return text
	}
}

client.on('ready', ()=>{
	console.log(`Discord bot: ${client.user.tag}`)
	client.user.setActivity("Anime")
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
	if (swearList.some(word => msg.content.includes(word.toLowerCase()))){
		randomsweardetect = Math.floor(Math.random() * sweardetection.length)
		msg.delete()
		msg.channel.send(sweardetection[randomsweardetect])
			.then(messages => setTimeout(()=> {
				messages.delete()
			}, 5000))
			.catch(console.error)
		
	}else if (msg.content.toLowerCase() == 'ez'){
		randomhypixel = Math.floor(Math.random() * ezlist.length)
		msg.delete()
		msg.channel.send(ezlist[randomhypixel])
	}
	// BLOCK
	if (command == 'ping'){
		const EmbedText = new discord.MessageEmbed()
			.setTitle('Meow')
			.setColor(0xff0000)
			.setDescription('Meow Meow')
		msg.channel.send(EmbedText)
	} else if (command == 'uuid'){

		const name = messages.substr(messages.toLowerCase().indexOf('uuid') + 5)

		if (name == ''){
			msg.channel.send(`You forgot to add a name. Example: ${prefix}uuid [NAME/PLAYER]`)
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
								players.push("Player: "+isitalic(bodys[getlength - 1].name) + ' Rank: ' + rank +'\n')
								console.log(players)
								if (newi == body.guild.members.length - 1 || newi == 14){
									const embed = new discord.MessageEmbed()
										.setTitle("GUILD PLAYER")
										.setColor(0x000ff)
										.setDescription("Created: "+unixtodate(timestamp)+"\n"+empty(players))
										.setFooter("Jashli Bot")

									msg.channel.send(embed)
								}
								
							})
					};
				}

			}
		})
	} else if (command == 'status'){
		let name1 = messages.substr(messages.toLowerCase().indexOf('status') + 7)
		const name = isitalic(name1)
		console.log(name)
		let uuid
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
				uuid = body.id;
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
							const embed = new discord.MessageEmbed()
								.setTitle(name)
								.setURL('https://sky.shiiyu.moe/stats/'+name)
								.setThumbnail('https://crafatar.com/renders/body/'+uuid)
								.addField('Online', '🔴')
							msg.channel.send(embed)
						} else if (bodys.session.online) {
							const embed = new discord.MessageEmbed()
								.setTitle(name)
								.setURL('https://sky.shiiyu.moe/stats/'+name)
								.setThumbnail('https://crafatar.com/renders/body/'+uuid)
								.addField('Online', '🟢')
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
		console.log("Someone is trying to change prefix. Their ID: "+msg.author.id)
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
			.setDescription(`${prefix}help\n${prefix}uuid\n${prefix}guild\n${prefix}status\n${prefix}history\n${prefix}`)
			.setFooter('Made by Jashwi')
		msg.channel.send(embed)
	} else if (command == 'history'){
		const name = messages.substr(messages.toLowerCase().indexOf('history') + 8)
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
									.setFooter('Made by Jashwi')
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
	} else if (msg.content == 'I love you'){
		msg.react('❤️')
	} else if (command == 'poll'){
		const string = messages.substr(messages.toLowerCase().indexOf('poll') + 5)
		if (string == ''){
			msg.channel.send(`You forgot to add a text. Example: ${prefix}poll`)
			return
		}
		let array = string.split(',')
		if (array.length == 1 || array.length >=9){
			if (array.length >=9){
				msg.channel.send(":frowning: No, that was too many")
			}
			if (array.length <= 2){
				msg.channel.send(":frowning: No, that was only 2. It should be more than 2")
			}
			return
		}


		let emoji = ["👍", "👎"] // for two
		let emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬']
		if (array.length == 3){
			const embed =new discord.MessageEmbed()
				.setTitle(array[0])
				.setDescription(emoji[0]+' '+array[1]+ '\n\n'+ emoji[1] +' ' + array[2])
				.setFooter('Made by Jashwi')
			msg.channel.send(embed).then(sentMessage => {sentMessage.react(emoji[0]).then(()=> {sentMessage.react(emoji[1])})})
		} else {
			let pushed = []
			let Title = array[0]
			var i
			var newi
			var l = i + 1
			for (i in array){
				array = array.filter(e => e !== Title)
				pushed.push(emojis[i]+' '+array[i]+ '\n')
				newi = i
				if (newi == array.length - 1){
					const embed = new discord.MessageEmbed()
						.setTitle(Title)
						.setDescription(pushed)
						.setFooter('Made by Jashwi')

					msg.channel.send(embed).then(sentMessage=> {
						var a;
						for (a in array){
							sentMessage.react(emojis[a])
						}
					})
				}
			}
		}
	} else if (command == 'player'){
		const uuid = messages.substr(messages.toLowerCase().indexOf('player') + 7)
		request({
			method: 'get',
			url: 'https://api.mojang.com/user/profiles/'+uuid+'/names',
			json: true
		}, (err,req,body) => {
			if (body == undefined){
				msg.channel.send('UUID Undefined')
				return
			}

			let player = body[body.length - 1].name
			const embed = new discord.MessageEmbed()
				.setTitle('Player name')
				.setDescription(player)

			msg.channel.send(embed)
		})
	} else if (command == 'skin'){
		const commands = messages.substr(messages.toLowerCase().indexOf('skin') + 5)
		let issplitted = commands.split(' ')

		const name = issplitted[1]
		const com = issplitted[0].toLowerCase()
		let uuid

		if (name == ''){
			msg.channel.send('You forgot the add the name')
			return
		}
		if (com == ''){
			msg.channel.send(`Command not found try ${prefix}skin [body, head, steal, avatar] [IGN]`)
			return
		}
		request({
			method: 'GET',
			url: 'https://api.mojang.com/users/profiles/minecraft/'+name,
			json: true
		}, (err, req, body) => {
			if(body == undefined){
				msg.channel.send("Undefined player")
				return
			}
			uuid = body.id
			let name_1 = body.name
			if (com == 'body'){
				const embed = new discord.MessageEmbed()
					.setTitle('Skin from '+name_1)
					.setImage('https://crafatar.com/renders/body/'+uuid)
				msg.channel.send(embed)
			} else if (com == 'steal'){
				const embed = new discord.MessageEmbed()
					.setTitle('Skin from '+name)
					.setImage('https://crafatar.com/skins/'+uuid)
				msg.channel.send(embed)
			}else if (com == 'head'){
				const embed = new discord.MessageEmbed()
					.setTitle('Skin from '+name)
					.setImage('https://crafatar.com/renders/head/'+uuid)
				msg.channel.send(embed)

			}else if(com == 'avatar'){
				const embed = new discord.MessageEmbed()
					.setTitle('Skin from '+name)
					.setImage('https://crafatar.com/avatars/'+uuid)
				msg.channel.send(embed)
			} else {
				msg.channel.send('Unknown command')
			}
		})
	} else if (command == 'version'){
		msg.channel.send(version)
	} else if (command == 'remember'){
		if (owner != ownerID){
			return
		}
		const key = messages.substr(messages.toLowerCase().indexOf('remember') + 9)
		if (key == ''){
			return
		}

		remember.push(key)
		msg.channel.send('Added to database')
	} else if (command == 'database'){
		if (owner != ownerID){
			return
		}
		const clear = messages.substr(messages.toLowerCase().indexOf('database') + 9)
		if (clear == ''){
			if (remember == ''){
				msg.channel.send('None')
			} else {
				msg.channel.send(remember)
			}
		} else if ('clear'){
			remember = []
			msg.channel.send('Cleared')
			return
		}
	} else if (command == 'waifu'){
		randomized = Math.floor(Math.random() * animelist.length + 1)
		randomized2 = Math.floor(Math.random() * 101)
		const embed = new discord.MessageEmbed()
			.setTitle('Your waifu is '+ animename[randomized])
			.addField('Cuteness', randomized2+'%')
			.setImage(url+animelist[randomized])
			.setDescription('Cuteness is just a randomized number')
			.setFooter('Made by Jashli')
		msg.channel.send(embed)
	} else if (command == 'bank'){
		const coins = messages.substr(messages.toLowerCase().indexOf('bank') + 5)
		return
	}
})


client.login(token)


// UUID Examples
//22ede0d98eb848bcaadff53553bd39b0
//069a79f444e94726a5befca90e38aaf5
//1d449dbed9e343bba9575a3f5992944a
//699496284c1f4174bce8f3c90ea467f2