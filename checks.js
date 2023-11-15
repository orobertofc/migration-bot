export async function checks(interaction) {
  if (!interaction.isCommand()) return false;

  if (interaction.commandName !== 'migrate') {
    await interaction.reply({content: 'Invalid command', ephemeral: true});
    return false
  }

  if (interaction.guildId !== '845369462302572605') {
    await interaction.reply({content: 'This command is only available in the test server', ephemeral: true});
    return false
  }

  return true
}