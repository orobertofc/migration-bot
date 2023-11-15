export function logger(message, client) {
  console.log(message);
  const server = client.guilds.cache.get('351392315870543872')
  const channel = server.channels.cache.get('1174388318839001128')
  channel.send(message)
}