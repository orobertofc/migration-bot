import { Client, GatewayIntentBits } from 'discord.js';
import "dotenv/config";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



client.on('interactionCreate', async interaction => {

    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

    if (!interaction.isChatInputCommand()) {
        await interaction.reply('This is not a command');
        console.log(`User <@${interaction.user.id}> tried to use a command in a non-command context`);
        return;
    }

    if (interaction.commandName === 'register' ) {
        if (interaction.channel.id !== process.env.ALLOWED_CHANNELS) {
            await interaction.reply({ content: 'You can only register in <#1158452522453839922>', ephemeral: true });
            // Log the attempt to log channel on discord
            await client.channels.cache.get('1158458871942221964').send(`User <@${interaction.user.id}> tried to use a command in <#${interaction.channel.id}>`)
            console.log(`User ${interaction.user.tag} tried to register in <#${interaction.channel.id}>`);
            return;
        }

        if (!regexExp.test(interaction.options.getString('email'))) {
            await interaction.reply({ content: 'Please provide a valid email', ephemeral: true });
            // Log the invalid email on discord
            await client.channels.cache.get('1158458871942221964').send(`User <@${interaction.user.id}> provided an invalid email: ${interaction.options.getString('email')}`)
            console.log(`User ${interaction.user.tag} provided an invalid email`);
            return;
        }

        try {
            await interaction.reply({ content: 'Email registered!, please be patient and read the faq in <#1158394883581681715>', ephemeral: true });
            // Send valid email to discord channel
            await client.channels.cache.get(`1158420375932252282`).send(`<@${interaction.user.id}> has registered ${interaction.options.getString('email')}`);
            console.log(`User ${interaction.user.tag} has registered ${interaction.options.getString('email')}`);

        } catch (error) {
            await interaction.reply({message: 'There was an error while registering your email, please try again later', ephemeral: true});
            // Log the error on discord
            await client.channels.cache.get('1158458871942221964').send(`error while registering email for user <@${interaction.user.id}>`)
            console.error(error);
        }
    }
});

client.on('error', async error => {
    try {
        await client.channels.cache.get(`1158458871942221964`).send(`There was an error: ${error}`)
    } catch (error) {
        console.log("error while reporting error")
    }
    console.error(error);
})


client.login(process.env.TOKEN).then(() => console.log("Client online"));