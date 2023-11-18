import {Client, Events, GatewayIntentBits, PermissionsBitField} from 'discord.js';
import "dotenv/config";
import {checks} from "./checks.js";
import {logger} from "./logger.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



client.on(Events.InteractionCreate, async interaction => {
    try {
        // Check basic stuff
        const check_passed = await checks(interaction);
        if (check_passed === false) return;

        // Handle command
        const user = interaction.user;
        const user_id = user.id
        const platform = interaction.options.getString('platform');
        const main_server = client.guilds.cache.get('351392315870543872')

        console.log(`User ${user.tag} wants to migrate their account to ${platform}`);

        // check if user has admin perms
        if (interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
            logger(`User <@${user_id}> tried to migrate but is an admin`, client)
            await interaction.reply({content: 'admins not allowed, gtfo', ephemeral: true});
            return
        }


        // Check if user is in main server
        let user_on_main;
        try {
            user_on_main = await main_server.members.fetch(user_id)
        } catch (error) {
            await interaction.reply({content: 'You are not in the main server', ephemeral: true});
            return
        }

        // Check if user has android or ios role, meaning they are already registered
        //  Tester role can register again to claim platform role
        if (user_on_main.roles.cache.has('1174364579149643776') || user_on_main.roles.cache.has('1174364513433288745')) {
            await interaction.reply({content: 'You are already registered', ephemeral: true});
            return
        }

        // Assign roles according to platform and tester role
        switch (platform) {
            case "ios":
                await user_on_main.roles.add(['1174364579149643776', '1140598121131413506'])
                break;
            case "android":
                await user_on_main.roles.add(['1174364513433288745', '1140598121131413506'])
                break;
        }


        // Send message to user
        main_server.channels.cache.get('1174407911619952640').send(`Hey <@${user_id}>! This is the new test zone, so you will be removed from the old test server. Enjoy!`)
        await interaction.reply({
            content: 'Migration completed, you will be removed from this server in 5 seconds',
            ephemeral: true
        });

        // Kick user from test server
        setTimeout(() => {
            interaction.guild.members.kick(user_id)
            logger(`User <@${user_id}> migrated. Platform: ${platform}`, client)
        }, 5000)

    } catch (error) {
        try {
            await interaction.reply({content: 'Something went wrong, please contact an admin', ephemeral: true});
        } catch (error) {
            logger(`Error: ${error}`, client)
        }
        logger(`Error: ${error}`, client)
    }

});

client.on('error', async error => {
    logger(`Error: ${error}`, client)
})


client.login(process.env.TOKEN).then(() => console.log("Client online"));