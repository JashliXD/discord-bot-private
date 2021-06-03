"use strict";
const request = require('request');
const discord = require('discord.js');
const client = new discord.Client();
const dotenv = require('dotenv').config()

let api = process.env.api
let token = process.env.token
let ownerID = process.env.ownerID

let version = '1.1.9'

let prefix = '?';
let jokeapi = 'https://icanhazdadjoke.com/'

let remember = []


let url = 'https://waifupictures.000webhostapp.com/waifu/'
let animelist = ['AkiraKogami.jpg', 'Ayaki.png', 'Chika.jpg', 'Jasmine.jpg', 'Ichika.png', 'KiraraBernstein.jpg', 'Kyouko.jpg', 'Makina_Irisu.png', 'Rem.jpg', 'REMILIA_SCARLET.jpg', 'Shiro.png', 'Yoshino.png','Hayasaka.png','Emilia.png','Kaguya.jpg','Megumin.jpg','Ram.png']
let animename = ['Akira Kogami', 'Kamisato Ayaka', 'Chika Fujiwara', 'Jasmine Kashiro', 'Ichika Nakano', 'Kirara Bernstein', 'Kyouko Hori', 'Makina Irisu', 'Rem', 'Remilia Scarlet', 'Shiro', 'Yoshino Himekawa','Ai Hayasaka', 'Emilia', 'Kaguya Shinomiya', 'Megumin', 'Ram']
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
	// BLOCK
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
	} else if (command == 'prefix'){
		if (msg.channel.name == 'verify'){
			return
		}
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
			msg.channel.send(body.joke)
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
	} else if (command == 'remember'){
		if (msg.channel.name == 'verify'){
			return
		}
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
		if (msg.channel.name == 'verify'){
			return
		}
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
		console.log(rawArray)
		let array = rawArray.split(',')
		// damage,strength,cd,multiplier
		let weapondamage = parseInt(array[0])
		let strength = parseInt(array[1])
		let critdamage = parseInt(array[2])
		let additivemultiplier = parseInt(array[1])

		let errors = []

		if (weapondamage == NaN){
			errors.push('Damage')
		}
		if (strength == NaN){
			errors.push('Strength')
		}
		if (critdamage == NaN){
			errors.push('Crit Damage')
		}
		if (additivemultiplier == NaN){
			errors.push('Multiplier')
		}

		if (errors.length != 0){
			console.log('All errors:',errors)
			return
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
			uuid = body.id
			request({
				method: 'get',
				url: 'https://api.hypixel.net/player?key='+api+'&uuid='+uuid,
				json:true
			},(err,req,bodys)=> {
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
	}
})


client.login(token)


// UUID Examples
//22ede0d98eb848bcaadff53553bd39b0
//069a79f444e94726a5befca90e38aaf5
//1d449dbed9e343bba9575a3f5992944a
//699496284c1f4174bce8f3c90ea467f2
