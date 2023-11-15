import { REST, Routes } from 'discord.js';
import "dotenv/config";

// NOTE TO SELF:
// COMMAND NAMES AND DERIVATIVES CANNOT CONTAIN HIGH CASE LETTERS

const commands = [
    // {
    //     name: 'register',
    //     description: 'Register your email so you can download the game',
    //     options: [
    //         {
    //             name: 'email',
    //             description: 'The email you want to play with',
    //             type: 3,
    //             required: true
    //         }
    //     ],
    // },
    {
        name: 'migrate',
        description: 'Migrate your account from the old server to the new one',
        type: 1,
        options: [
            {
                name: 'platform',
                description: 'The platform you play on',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'IOS',
                        value: 'ios'
                    },
                    {
                        name: 'Android',
                        value: 'android'
                    }
                ],
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