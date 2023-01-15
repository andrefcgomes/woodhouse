from discord.ext import commands
import sqlite3
import discord 

class Requests(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    def _insertRequest(self, user, request):
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        c.execute("INSERT INTO requests (author,`when`, request) VALUES (?,datetime(),?)", (user, request,))
        conn.commit()
        conn.close()


    def _getRequests(self):
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        data = []
        lines = c.execute("SELECT * FROM requests ORDER BY id DESC ")
        for l in lines:
            data.append(l)
        conn.commit()
        conn.close()
        return data

    @commands.command()
    async def addrequest(self, ctx, quote):
        """Saves a quote. Example: .addrequest "[youtube link] from 0:30 to 0:32"  """
        self._insertRequest(ctx.author.id, quote)
        await ctx.send('Quote saved!')


    @commands.command()
    async def listrequests(self, ctx):
        """List requests"""
        lines = self._getRequests()
        message = "```"
        for l in lines:
            author = discord.Client().get_user(l[1])
            message += '"' + l[3] + '" - ' + author.display_name + ', ' + l[2] + '\n'
        message += "```"
        await ctx.send(message)

    @commands.command()
    async def ping(self,ctx):
        """ Ping the bot to text name """
        # await ctx.send('Pong {0}'.format(ctx.author))
        await ctx.send('Pong @' + format(ctx.author.display_name))
        print("debug: " + dir(ctx.author))
