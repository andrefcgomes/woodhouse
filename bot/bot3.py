from discord.ext import commands
from cogs.music import Music
from cogs.quotes import Quotes
from cogs.requests import Requests
from cogs.soundboard import Soundboard
# Suppress noise about console usage from errors
TOKEN = 'NTcyOTQ4ODA3OTgyMTIwOTc4.XMjwWg.AAMPizHx-xxrf6PcgEnoVYAOczk'

bot = commands.Bot(command_prefix=commands.when_mentioned_or("."), description='Bom dia!')

@bot.event
async def on_ready():
    print('Logged in as {0} ({0.id})'.format(bot.user))
    print('------')


bot.add_cog(Music(bot))
bot.add_cog(Requests(bot))
bot.add_cog(Quotes(bot))
bot.add_cog(Soundboard())
bot.run(TOKEN)
