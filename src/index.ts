import {
  ActivityType,
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  Interaction,
  SystemChannelFlagsBitField,
} from 'discord.js'
import {
  convertYear,
  earthYearsToJthYears,
  jthYearsToEarthYears,
} from './convertYear'
import { TOKEN } from './env'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const statii: [
  string,
  {
    type:
      | ActivityType.Playing
      | ActivityType.Streaming
      | ActivityType.Listening
      | ActivityType.Watching
      | ActivityType.Competing
  }
][] = [
  [
    'the death of thousands of Dhimze soldiers',
    { type: ActivityType.Watching },
  ],
  ['Jelus and that prince in their bedroom', { type: ActivityType.Watching }],
  ['Bairteréass painting', { type: ActivityType.Watching }],
  ['the screams from the TSC front line', { type: ActivityType.Listening }],
  ['the gospel of Wīḍyā ﷽', { type: ActivityType.Listening }],
  [
    'in horror as the brass giants tear my comrades to shreds',
    { type: ActivityType.Watching },
  ],
  ['a rigged Doccábh election', { type: ActivityType.Competing }],
  ['with Ashnan femboys', { type: ActivityType.Playing }],
  ['with my catperson frágn partner', { type: ActivityType.Playing }],
  ['yabujin with the former king of TSC', { type: ActivityType.Listening }],
]

const randomStatus = () => statii[Math.floor(Math.random() * statii.length)]

const setStatus = () => {
  const [text, type] = randomStatus()
  client.user?.setActivity(text, type)
}

const stringifyYear = (year: {
  value: number
  system: {
    name: string
    currentYear: number
    yearLengthInJTHDays?: number | undefined
  }
}) => {
  if (year.system.name === 'AE' && year.value < 0) {
    year.system.name = 'BE'
    year.value = -year.value
  }
  if (year.system.name === 'BP') {
    return (
      ` - **${year.value}${year.system.name}** ` +
      `(${Math.round(jthYearsToEarthYears(year.value))} earth years ago)`
    )
  }
  const isEstimate = !year.system.yearLengthInJTHDays
  return ` - **${year.value}${year.system.name}**${isEstimate ? '\\*' : ''}`
}

client.once('ready', () => {
  console.log(
    `logged in as ${client.user?.username}#${client.user?.discriminator}`
  )
  setStatus()
  setInterval(setStatus, 10_000)
})

const cmds: Record<
  string,
  (interaction: ChatInputCommandInteraction) => Promise<any>
> = {
  help: async (interaction) => {
    await interaction.reply(
      `Known commands:\n` +
        ' - `help`: Lists the commands that this bot accepts.\n' +
        ' - `ping`: Replies with "hello!" if the bot is up.\n' +
        ' - `year`: Convert between years in different systems.\n' +
        ' - `duration`: Convert between Earth and Jotunnheim durations.\n'
    )
  },
  ping: async (interaction) => {
    await interaction.reply(`hello!`)
  },
  year: async (interaction) => {
    const input = interaction.options.getString('input', true)
    const years = convertYear(input)
    if (!years) {
      await interaction.reply({
        content: 'That is not a valid year.',
        ephemeral: true,
      })
      return undefined
    }
    await interaction.reply(
      `The year **${input}** is equivalent to:\n` +
        years.map(stringifyYear).join('\n') +
        '\n\\* This system has no information about year length.'
    )
  },
  duration: async (interaction) => {
    const value = interaction.options.getInteger('value', true)
    const to = interaction.options.getString('to', true)
    if (to !== 'earth' && to !== 'jth') {
      await interaction.reply({
        content: 'Type either "earth" or "jth".',
        ephemeral: true,
      })
      return undefined
    }
    const converter =
      to === 'earth' ? jthYearsToEarthYears : earthYearsToJthYears
    const finalValue = converter(value).toFixed(2)

    const original = to === 'earth' ? 'Jotunnheim' : 'Earth'
    const converted = to === 'earth' ? 'Earth' : 'Jotunnheim'

    await interaction.reply(
      `${value} ${original} years is equivalent to **${finalValue} ${converted} years**.`
    )
  },
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction
  await cmds[commandName](interaction)
})

client.login(TOKEN)

const goInvisible = () => {
  client.user?.setStatus('invisible')
}

process.on('exit', () => {
  goInvisible()
  process.exit()
})
process.on('SIGINT', () => {
  goInvisible()
  process.exit()
})
