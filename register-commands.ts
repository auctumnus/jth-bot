import 'dotenv/config'
import { REST, Routes, SlashCommandBuilder } from 'discord.js'

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('List commands for the Jotunnheim bot'),
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check that the bot is up'),
  new SlashCommandBuilder()
    .setName('year')
    .setDescription('Convert a Jotunnheim year to the different systems')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription(
          'The year to convert. Valid systems are BP, CY, AE, and GA, or "now" for the current year.'
        )
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('duration')
    .setDescription('Convert between Earth and Jotunnheim time')
    .addIntegerOption((option) =>
      option
        .setName('value')
        .setDescription('The number of years, either in JTH or Earth years.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription("Either 'jth' (for e→j) or 'earth' (for j→e)")
        .setRequired(true)
    ),
].map((command) => command.toJSON())

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

rest
  .put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
    body: commands,
  })
  .then(() => console.log('Registered slash commands!'))
  .catch(console.error)
