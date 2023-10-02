import { Client, GatewayIntentBits } from 'discord.js';
import "dotenv/config";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) {
        await interaction.reply('This is not a command');
        console.log(`User ${interaction.user.tag} tried to use a command in a non-command context`);
        return;
    }

    if (interaction.commandName === 'register' ) {
        // if (interaction.channel.id !== 'process.env.CHANNEL_ID') {
        //     interaction.reply('You can only register in <#1158420409901912085>');
        // }

        if (!regexExp.test(interaction.options.getString('email'))) {
            await interaction.reply('Please provide a valid email');
            console.log(`User ${interaction.user.tag} provided an invalid email`);
            return;
        }

        try {
            await interaction.reply({ content: 'Email registered!, please be patient and read the faq in <#1158420409901912085>' });
            await client.channels.cache.get(`1158420375932252282`).send(`<@${interaction.user.id}> has registered ${interaction.options.getString('email')}`);

            console.log(`User ${interaction.user.tag} has registered ${interaction.options.getString('email')}`);
        } catch (error) {
            await interaction.reply('There was an error while registering your email, please try again later');
            console.error(error);
        }
    }
});

client.login(process.env.TOKEN).then(() => console.log("Client online"));