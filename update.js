import { REST, Routes } from 'discord.js';
import "dotenv/config";

const commands = [
    {
        name: 'register',
        description: 'Register your email so you can download the game',
        options: [
            {
                name: 'email',
                description: 'The email you want to play with',
                type: 3,
                required: true
            }
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}