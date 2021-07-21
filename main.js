"use strict";
const request = require('request');
const discord = require('discord.js');
const client = new discord.Client();
//const dotenv = require('dotenv').config()

let api = process.env.api
let token = process.env.token
let ownerID = process.env.ownerID

let channels = require('./channel.json')
let mods = require('./owner.json')
let bots = require('./bot.json')

let version = '1.1.9'

let prefix = '?';
let jokeapi = 'https://icanhazdadjoke.com/'

let remember = []

let url = 'https://waifupictures.000webhostapp.com/waifu/'
let murl = 'https://waifupictures.000webhostapp.com/'
let animelist = ['AkiraKogami.jpg', 'Ayaki.png', 'Chika.jpg', 'Jasmine.jpg', 'Ichika.png', 'KiraraBernstein.jpg', 'Kyouko.jpg', 'Makina_Irisu.png', 'Rem.jpg', 'REMILIA_SCARLET.jpg', 'Shiro.png', 'Yoshino.png','Hayasaka.png','Emilia.png','Kaguya.jpg','Megumin.jpg','Ram.png']
let animename = ['Akira Kogami', 'Kamisato Ayaka', 'Chika Fujiwara', 'Jasmine Kashiro', 'Ichika Nakano', 'Kirara Bernstein', 'Kyouko Hori', 'Makina Irisu', 'Rem', 'Remilia Scarlet', 'Shiro', 'Yoshino Himekawa','Ai Hayasaka', 'Emilia', 'Kaguya Shinomiya', 'Megumin', 'Ram']
const welcomearray = [
	"Everyone welcome &user&!",
	"&user& just showed up!",
	"Hey Hey &user&. Welcome to **McLaren's Pub**!",
	"Hello &user&, Welcome to **McLaren's Pub**!",
	"Glad you're here, &user&!",
	"Hello &user&, Welcome to Family Friendly Server called **McLaren's Pub**!!",
	"Ey &user& just joined the server!",
	"Welcome, &user&. We hope you brought pizza!!",
	"Welcome &user&!!"
]
const farewellarray =[
	"&user& just left the server. :sob:",
	"Bye Bye &user&. :sob:",
	"&user& left. :sob:"
]
console.log(animename.length, animelist.length)
let randomized;
let randomizer
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

function isBot(msg){
	if (bots.some(r => msg.author.id.includes(r))){
		return true
	} else {
		return false
	}
}

function isOwner(msg){
	if (mods.some(r => msg.author.id.includes(r))){
		return true
	} else {
		return false
	}
}

function m(n,d){var x=(''+n).length,p=Math.pow,d=p(10,d)
x-=x%3
return Math.round(n*d/p(10,x))/d+" kMBTQE"[x/3]}

function k (rep) {
 	rep = rep+''; // coerce to string
 	if (rep < 1000) {
    	return rep; // return the same number
 	}
  	if (rep < 10000) { // place a comma between
    	return rep.charAt(0) + ',' + rep.substring(1);
	}
    // divide and format
  	return (rep/1000).toFixed(rep % 1000 != 0)+'k';
}

function damageOutput(num){
	if (num > 1000000){
		return m(num,1)
	}
	if(num > 10000){
		return k(num)
	} else {
		return num
	}
}
let strictvariable = true;
let mathurl = murl;
let mathjson = ["ejson1.json","normaljson2.json","hjson3.json"];
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
let active = false

client.on('message', msg =>{
	const command = isCommand(msg.content)
	const messages = msg.content
	const owner = msg.author.id
	// MESSAGE
	if (command == 'ping'){
		if (msg.channel.name == 'verify'){
			return
		}
		const EmbedText = new discord.MessageEmbed()
			.setTitle('Meow')
			.setColor(0xff0000)
			.setDescription('Meow Meow')
		msg.channel.send(EmbedText)
	} else if (command == 'uuid'){
		if (msg.channel.name == 'verify'){
			return
		}
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
		if (msg.channel.name == 'verify'){
			return
		}
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
			if (body.guild == null){
				msg.channel.send('Guild doesn\'t exist')
				return
			}
			const guildowner = body.guild.members[0].uuid
			let ownername = 'None'
			let playercount = body.guild.members.length
			// get ownername
			request({
				method: 'get',
				url: 'https://api.mojang.com/user/profiles/'+guildowner+'/names',
				json: true
			}, (err,req,bodys)=>{
				const embed = new discord.MessageEmbed()
					.setTitle(body.guild.name)
					.setFooter('Made by Jashwi')
					.addFields({name:'Owner',value:bodys[bodys.length - 1].name,inline:true},{name:'Playercount',value:playercount,inline:true},{name:'Coins',value:body.guild.coins,inline:true},{name:'Created',value:unixtodate(body.guild.created),inline:true})
				msg.channel.send(embed)
			})
		})
	} else if (command == 'status'){
		if (msg.channel.name == 'verify'){
			return
		}
		let name1 = messages.substr(messages.toLowerCase().indexOf('status') + 7)
		const name = isitalic(name1)
		let names
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
				console.log(body)
				uuid = body.id;
				names = isitalic(body.name);
				request({
					method: 'GET',
					url: 'https://api.hypixel.net/status?key='+api+'&uuid='+ uuid,
					json: true
				}, (err,req,bodys) => {
					console.log(bodys)
					if (bodys == undefined){
						msg.channel.send('Non hypixel player or API off')
						return
					} else {
						let ifonline = bodys.session.online;
						let thumbnail = 'https://craftar.com/renders/body/'+uuid;
						let game = bodys.session.gameType
						let location = 'None'
						let rewrite = 'None'
						let simplified = 'None'
						if (game == 'SKYBLOCK'){
							simplified = 'Skyblock'
						} else if (game == 'BEDWARS'){
							simplified = 'Bedwars'
						} else if (game == 'SKYWARS'){
							simplified = 'Skywars'
						}
						if (game == 'SKYBLOCK'){
							location = bodys.session.mode
							if (location == 'hub'){
								rewrite = 'Hub'
							} else if (location == 'mining_1'){
								rewrite = 'Gold Mines'
							} else if (location == 'mining_2'){
								rewrite = 'Deep Caverns'
							} else if (location == 'mining_3'){
								rewrite = 'Dwarven Mines'
							} else if (location == 'combat_1'){
								rewrite = 'Spider\'s Den'
							} else if (location == 'combat_2'){
								rewrite = 'Blazing Fortress'
							} else if (location == 'combat_3'){
								rewrite = 'The End'
							} else if (location == 'farming_1'){
								rewrite = 'The Barn'
							} else if (location == 'dungeon_hub'){
								rewrite = 'Dungeon Hub'
							} else if (location == 'dungeon'){
								rewrite = 'Dungeon'
							} else if (location == 'dynamic'){
								rewrite = 'Private Island'
							}
						}

						let statusLogo = ['🔴','🟢']
						let status = 'None'

						if (ifonline == true){
							status = statusLogo[1]
						} else {
							status = statusLogo[0]
						}
						console.log(status)
						console.log(simplified)
						console.log(rewrite)
						const embed = new discord.MessageEmbed()
							.setTitle(name)
							.addFields({name:'Online',value:status},{name:'Game',value: simplified},{name:'Lobby',value:rewrite})
							.setThumbnail('https://crafatar.com/renders/head/'+uuid)
							.setFooter('Made by Jashwi')

						msg.channel.send(embed)
					}
				})
			}
		})

	} else if (command == 'flip'){
		if (msg.channel.name == 'verify'){
			return
		}
		let mathsthing = Math.round(Math.random() * 100)
		msg.channel.send("Congratulations, You've made "+mathsthing+ "M today.")
	} else if (command == 'prefix' && isOwner(msg)){
		if (msg.channel.name == 'verify'){
			return
		}
		const newprefix = messages.substr(messages.toLowerCase().indexOf('prefix') + 7);
		console.log("Someone is trying to change prefix. Their ID: "+msg.author.id)
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
		if (msg.channel.name == 'verify'){
			return
		}
		const embed = new discord.MessageEmbed()
			.setTitle("List of my Commands")
			.setColor(0x000ff)
			.setDescription(`${prefix}help\n${prefix}uuid\n${prefix}guild\n${prefix}status\n${prefix}history\n${prefix}`)
			.setFooter('Made by Jashwi')
		msg.channel.send(embed)
	} else if (command == 'history'){
		if (msg.channel.name == 'verify'){
			return
		}
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
								playerName.push("Firstname: "+isitalic(bodys[i].name))
							} else {
								if (i != bodys.length - 1){
									playerName.push('Oldnames: '+isitalic(bodys[i].name))
								}
							}
							if (i == bodys.length - 1){
								playerName.push("Latest name: "+isitalic(bodys[i].name))
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
		if (msg.channel.name == 'verify'){
			return
		}
		request({
			method: 'GET',
			url: jokeapi,
			json: true
		}, (err, req, body) => {
			msg.channel.send(a.joke)
		})
	} else if (msg.content == 'I love you'){
		if (msg.channel.name == 'verify'){
			return
		}
		msg.react('❤️')
	} else if (command == 'poll'){
		if (msg.channel.name == 'verify'){
			return
		}
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
		if (msg.channel.name == 'verify'){
			return
		}
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
		if (msg.channel.name == 'verify'){
			return
		}
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
		if (msg.channel.name == 'verify'){
			return
		}
		msg.channel.send(version)
	} else if (command == 'remember' && isOwner(msg)){
		if (msg.channel.name == 'verify'){
			return
		}
		const key = messages.substr(messages.toLowerCase().indexOf('remember') + 9)
		if (key == ''){
			return
		}

		remember.push(key)
		msg.channel.send('Added to database')
	} else if (command == 'database' &&isOwner(msg)){
		if (msg.channel.name == 'verify'){
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
		if (msg.channel.name == 'verify'){
			return
		}
		randomized = Math.floor(Math.random() * animelist.length)
		randomized2 = Math.floor(Math.random() * 101)
		const embed = new discord.MessageEmbed()
			.setTitle('Your waifu is '+ animename[randomized])
			.addField('Cuteness', randomized2+'%')
			.setImage(url+animelist[randomized])
			.setDescription('Cuteness is just a randomized number')
			.setFooter('Made by Jashli')
		msg.channel.send(embed)
	} else if (command == 'bank'){
		if (msg.channel.name == 'verify'){
			return
		}
		const coins = messages.substr(messages.toLowerCase().indexOf('bank') + 5)
		return
	} else if (command == 'damage'){
		if (msg.channel.name == 'verify'){
			return
		}
		const rawArray = messages.substr(messages.toLowerCase().indexOf('damage') + 7)
		if (rawArray == ''){
			msg.channel.send(`You forgot to add Weapon Damage, Strength, Crit Damage, and Multiplier. Example: ${prefix}damage [Damage],[Strength],[CritDamage],[Combat Level]`)
			return
		}
		console.log(rawArray)
		let array = rawArray.split(',')
		// damage,strength,cd,multiplier
		let weapondamage = parseInt(array[0])
		let strength = parseInt(array[1])
		let critdamage = parseInt(array[2])
		let combatlvl = parseInt(array[3])

		console.log(weapondamage,strength,critdamage,combatlvl)

		let errors = []

		let additivemultiplier
		let extramultiplier
		if (isNaN(weapondamage)){
			errors.push('Damage')
		}
		if (isNaN(strength)){
			errors.push('Strength')
		}
		if (isNaN(critdamage)){
			errors.push('Crit Damage')
		}
		if (isNaN(combatlvl)){
			errors.push('Combat Level')
		}
		
		console.log(errors.length)

		if (errors.length != 0){
			console.log('All errors:',errors)
			msg.channel.send('All errors: '+ errors)
			return
		}

		if (combatlvl > 60){
			msg.channel.send('Combat level is too high')
			return
		} else if (combatlvl < 1){
			msg.channel.send('Combat level too low')
			return
		}

		if (weapondamage < 0 || strength < 0){
			msg.channel.send('Weapond damage, Strength can\'t be lower than zero')
			return
		}

		if (combatlvl > 50){
			extramultiplier = combatlvl - 50
			additivemultiplier = (50 * 4) + extramultiplier
			console.log(additivemultiplier)
		} else {
			additivemultiplier = combatlvl * 4
			console.log(additivemultiplier)
		}

		

		

		

		const olddamage = (5 + weapondamage + strength/5) * (1 + strength/100) * (1 + critdamage / 100) * (1 + additivemultiplier / 100)
		const damage = (5 + weapondamage) * (1 + strength/100) * (1 + critdamage / 100) * (1 + additivemultiplier / 100)

		const embed = new discord.MessageEmbed()
			.setTitle('Damage')
			.addFields(
				{name: 'Old damage', value: damageOutput(olddamage,2),inline:true},
				{name: 'New damage', value: damageOutput(damage,2),inline:true}
			)
			.setFooter('Made by Miko Iino')
		msg.channel.send(embed)
	} else if (command == 'verify'){
		const name = messages.substr(messages.toLowerCase().indexOf('verify') + 7)
		setTimeout(()=> {msg.delete()},1000)

		if (msg.channel.name != 'verify'){
			return
		}

		if (name == ''){
			msg.channel.send(`You forgot your name. Example: ${prefix}verify [IGN/NAME]`).then(m=>{setTimeout(()=>{m.delete()},3000)}).catch(console.error)
			return
		}

		let uuid
		request({
			method:'get',
			url:'https://api.mojang.com/users/profiles/minecraft/'+name,
			json:true
		}, (err,req,body) => {
			if (body == undefined){
				msg.channel.send('Player doesn\'t exist').then(m => {setTimeout(()=>{m.delete()},3000)}).catch(console.error)
				return
			}
			uuid = body.id
			request({
				method: 'get',
				url: 'https://api.hypixel.net/player?key='+api+'&uuid='+uuid,
				json:true
			},(err,req,bodys)=> {
				if (body.player == null){
					msg.channel.send('None hypixel player').then(m => {setTimeout(()=>{m.delete()},3000)}).catch(console.error)
					return
				}
				if (bodys.player.socialMedia == undefined){
					msg.channel.send('You haven\'t put your discord on hypixel.').then(m => {setTimeout(()=>{m.delete()},3000)}).catch(console.error)
					return
				}
				const playerSocial = bodys.player.socialMedia.links.DISCORD
				const id = msg.author.id
				const user = client.users.cache.get(id)

				if (playerSocial == user.tag){
					const role = msg.guild.roles.cache.find(role => role.name === 'Verified')
					const role1 = msg.guild.roles.cache.find(role => role.name === 'member')
					if (msg.member.roles.cache.has(role.id)) {
						console.log('Already verified')
					} else {
						msg.member.roles.add(role).catch(console.error)
					}
					if (msg.member.roles.cache.has(role1.id)) {
						console.log('Already member')
					} else {
						msg.member.roles.add(role1).catch(console.error)
					}
				} else {
					msg.channel.send('Update your social media on hypixel.').then(m => {setTimeout(()=>{m.delete()},3000)}).catch(console.error)
				}
			})
		})
	} else if (command == 'test'){
		const filter = response => {
			return response.content
		}

		msg.channel.send('Say something and i\'ll say what you said.')
			.then(()=>{
				msg.channel.awaitMessages(filter, {max:1, time:20000, errors: ["time"]})
					.then(collected => {
						msg.channel.send('You said '+collected.first().content)
					})
					.catch(collected => {
						msg.channel.send('No one say something :frowning:')
					})
			})
	} else if (command == 'math'){

		let difficulty
		let msgid = msg.author.id

		let answer
		let question
		let theiranswer

		msg.channel.send('How hard? Is it Easy, Normal or Hard')
			.then(()=>{
				msg.channel.awaitMessages(m => m.author.id === msgid, {max:1, time:10000, errors: ["time"]})
					.then(collected => {
						difficulty = collected.first().content.toLowerCase()
						if (difficulty == 'easy'){
							
							request({
								method: 'get',
								url: mathurl+mathjson[0],
								json: true
							}, (err,req,body)=> {

								randomizer = Math.floor(Math.random() * body.length)
								question = body[randomizer].question
								answer = body[randomizer].answer
								msg.channel.send(question)
									.then(()=>{
										msg.channel.awaitMessages(m => m.author.id === msgid, {max:1, time:30000, errors: ["time"]})
											.then((collected2)=> {
												if (body[randomizer].answer.some(r => collected2.first().content.includes(r))){
													console.log(collected2.first().author.id)
													msg.channel.send("Your answer is correct!!!!!")
												} else {
													msg.channel.send('Your answer is wrong. :pensive:')
												}
											})
											.catch(()=> {
												msg.reply('Looks like you didn\'t finish in time.... (30 seconds)')
											})
									})
									.catch(console.error)
							})
						} else if (difficulty == 'normal' && msgid == collected.first().author.id){
							request({
								method: 'get',
								url: mathurl+mathjson[1],
								json: true
							}, (err,req,body)=> {

								randomizer = Math.floor(Math.random() * body.length)
								question = body[randomizer].question
								answer = body[randomizer].answer
								msg.channel.send(question)
									.then(()=>{
										msg.channel.awaitMessages(m => m.author.id === msgid, {max:1, time:60000, errors: ["time"]})
											.then((collected2)=> {
												if (body[randomizer].answer.some(r => collected2.first().content.includes(r))){
													msg.channel.send("Your answer is correct!!!!!")
												} else {
													msg.channel.send('Your answer is wrong. :pensive:')
												}
											})
											.catch(()=> {
												msg.reply('Looks like you didn\'t finish in time.... (60 seconds)')
											})
									})
									.catch(console.error)
							})
						} else if (difficulty == 'hard' && msgid == collected.first().author.id){
							request({
								method: 'get',
								url: '',
								json: true
							}, (err,req,body)=> {
								randomizer = Math.floor(Math.random() * body.length)
								question = body[randomizer].question
								answer = body[randomizer].answer
								msg.channel.send(question)
									.then(()=> {
										msg.channel.awaitMessages(m => m.author.id === msgid, {max:1,time:90000,errors:["time"]})
											.then(collected2=> {
												if (answer.some(r => collected2.first().content.includes(r))){
													msg.channel.send("Congratulations. Your answer is")
													setTimeout(()=> {msg.channel.send("Correct!!! :partying_face:")},2000)
												} else {
													msg.channel.send("Congratulations. Your answer is")
													setTimeout(()=> {msg.channel.send("Wrong!!! :satisfied:")},2000)
												}
											})
											.catch(() => {
												msg.reply("Looks like you didn't finish in time.... (90 seconds)")
											})
									})

							})
						} else {
							msg.channel.send(difficulty + ' is not an option.')
						}
					})
					.catch(collected => {
						msg.channel.send('You didn\'t respond in 10 seconds. :sob:')
					})
			})
	} else if (command == 'd' || command == 'dungeon' || command == 'dung'){
		const filter = respond => {
			return respond.author.id === msg.author.id
		}
		let cute_name;
		let name;

		let playercatalevel
		let playercataxp
		let playercumulative

		let desirecatalevel

		let desirecataxp
		let cata50xpleft
		let playernextlevel
		let playernextlevelcataxp

		const cumulative = [50,75,110,160,230,330,470,670,950,1340,1890,2665,3760,5260,7380,10300,14400,20000,27600,38000,52500,71500,97000,132000,180000,243000,328000,445000,600000,800000,1065000,1410000,1900000,2500000,3300000,4300000,5600000,7200000,9200000,12000000,15000000,19000000,24000000,30000000,38000000,48000000,60000000,75000000,93000000,116250000]
		msg.channel.send("What's your IGN?")
			.then(()=> {
				msg.channel.awaitMessages(filter, {max:1,time:30000,errors:["time"]})
					.then(collected => {
						name = collected.first().content
						msg.channel.send("What's the profile name or fruit name")
							.then(()=> {
								msg.channel.awaitMessages(filter, {max:1,time:30000,errors:["time"]})
									.then(collected1=> {
										cute_name = collected1.first().content
										msg.channel.send('What catacomb level you want to get?')
											.then(()=> {
												msg.channel.awaitMessages(filter, {max:1,time:30000, errors:["time"]})
													.then(collected2 => {
														request({
															method: 'get',
															url: 'https://sky.shiiyu.moe/api/v2/dungeons/'+name+'/'+cute_name,
															json: true
														}, (err,req,body)=> {

															if (body.error != undefined){
																msg.channel.send(body.error)
																return
															}

															desirecatalevel = parseInt(collected2.first().content)
															if (isNaN(desirecatalevel)){
																msg.channel.send('Desire catalevel is NaN')
																return
															} else if (desirecatalevel > 50 || desirecatalevel < 1){
																msg.channel.send('Only catacomb 1-50')
																return
															}
															playercatalevel = body.dungeons.catacombs.level.level
															playernextlevel = playercatalevel + 1

															playercataxp = body.dungeons.catacombs.level.xpCurrent

															playercumulative = body.dungeons.catacombs.level.xp
															

															desirecataxp = cumulative[desirecatalevel-1] - playercumulative
															cata50xpleft = cumulative[49] - playercumulative
															playernextlevelcataxp = cumulative[playernextlevel-1] - playercataxp

															if (playercatalevel > desirecatalevel){
																msg.channel.send('Desire catacombs level can\'t be lower than your catacombs level')
																return
															}

															const embed = new discord.MessageEmbed()
																.setTitle("Hypixel Skyblock Dungeons Calculator")
																.addFields(
																	{name: "Catacombs **"+playercatalevel+"** to **"+desirecatalevel+"**", value:desirecataxp.toFixed(2)+ " cata xp needed", inline:true},
																	{name: "Catacombs **"+playercatalevel+"** to **"+playernextlevel+"**", value:playernextlevelcataxp.toFixed(2)+ " cata xp needed", inline:true},
																	{name: "Catacombs **"+playercatalevel+"** to **50**", value:cata50xpleft.toFixed(2)+ " cata xp needed",inline:true}
																	)
															msg.channel.send(embed)
														})
													})
											})
									})
							})
					})
			})

	}

	// MY COMMANDS
	if (command == 'delete' && isOwner(msg)){
		const c = messages.substr(messages.toLowerCase().indexOf('delete')+7)
		if (c == ''){
			msg.channel.send('You didn\'t put anything').then(msg=> {msg.delete()})
			return
		}
		const limit = 99
		var num = parseInt(c)
		if (isNaN(num)){
			msg.channel.send('Input is not a number.').then(msg=> {msg.delete()})
			return
		}
		if (num == 1){
			num = 2
		}
		if (num > limit){
			msg.delete()
			return
		}

		msg.channel.send('You deleted '+c+' message').then(msg => {msg.delete({timeout: 2000})})
		msg.channel.bulkDelete(num)
	} else if (command == 'dadjoke' && isOwner(msg)){
		const option = messages.substr(messages.toLowerCase().indexOf('dadjoke') + 8)
		if (option == ''){
			msg.channel.send("You forgot true or false.")
		}
		if (option == 'false'){
			active = false
			msg.channel.send("dad joke is now FALSE")
			return
		} else if (option == 'true'){
			active = true
			msg.channel.send("dad joke is now TRUE")
			return
		}
	}

	if (command == 'strict' && isOwner(msg)){
		isOwner(msg)
		const option = messages.substr(messages.toLowerCase().indexOf('strict') + 7)
		if (option == 'open'){
			strictvariable = true
			console.log('strict On')
			msg.delete()
		} else if (option == 'close'){
			strictvariable = false
			console.log('strict Off')
			msg.delete()
		} else {
			msg.delete()
		}
	}


	if (msg.author.bot == true && !channels.some(r => msg.channel.name.includes(r)) && !isBot(msg)){
		if (strictvariable){
			console.log(channels.some(r => msg.channel.name.includes(r)))
			msg.delete({timeout:1000})
			msg.channel.send('Bot message has been deleted. Don\'t use commands here.').then(r => {r.delete({timeout:3000})})
			return
		} else {
			return
		}
		
		//824316488051064913
	}

	// SPAM FOR MEE9 rank
	if (command == 'del'){
		msg.delete({timeout:250})
	}
	if (command == 'dog'){
		request({
			method: 'get',
			url: "https://dog.ceo/api/breeds/image/random",
			json: true
		}, (err,req,body)=> {
			msg.channel.send("Woof Woof *Dog noises")
			msg.channel.send(body.message)
		})
	}
	// dad joke moment
	let str = msg.content.split(' ')
	if (msg.content.toLowerCase().startsWith('im') && active){

		// checker
		for (i in str){
			if (str[i].toLowerCase() == 'idiot'){
				return
			} else if (str[i].toLowerCase() == 'stupid'){
				return
			} else if (str[i].toLowerCase() == 'stopid'){
				return
			} else if (str[i].toLowerCase() == 'idiut'){
				return
			} else if (str[i].toLowerCase() == 'idi-ot'){
				return
			} else if (str[i].toLowerCase() == 'i-diot'){
				return
			} else if (str[i].toLowerCase() == 'idi-ot'){
				return
			} else if (str[i].toLowerCase() == 'retarded'){
				return
			} else if (str[i].toLowerCase() == 'retard'){
				return
			}
		}

		msg.channel.send('Hi' +msg.content.slice(2,msg.content.length)+ " Im Kaguya :joy_cat:")
	}
	// #count / only count bot can talk / delete user text if not numbers
	if (msg.channel.name == 'counting'){
		if (isBot(msg) && msg.author.bot == true){
			return
		} else if (!isBot(msg) && msg.author.bot == true){
			msg.delete()
		}
		let number = Number(msg.content)
		if (isNaN(number)){
			msg.delete()
		}
	}
})

let welcomepickedsentence
let stringforwelcome

client.on('guildMemberAdd', (member)=> {
	const channel = member.guild.channels.cache.find(channel => channel.name == 'arrival-and-departures')
	welcomepickedsentence = welcomearray[Math.floor(Math.random() * 9)]
	stringforwelcome = welcomepickedsentence.replace("&user&", member)
	channel.send(stringforwelcome)
})

let farewellpickedsentence
let stringforfarewell

client.on('guildMemberRemove', (member)=> {
	const channel = member.guild.channels.cache.find(channel => channel.name == 'arrival-and-departures')
	farewellpickedsentence = farewellarray[Math.floor(Math.random() * 3)]
	stringforfarewell = farewellpickedsentence.replace("&user&", member)
	channel.send(stringforfarewell)
})

client.login(token).catch(console.error)



// UUID Examples
//22ede0d98eb848bcaadff53553bd39b0
//069a79f444e94726a5befca90e38aaf5
//1d449dbed9e343bba9575a3f5992944a
//699496284c1f4174bce8f3c90ea467f2
