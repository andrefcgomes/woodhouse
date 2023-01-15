from discord.ext import commands
import sqlite3


class Quotes(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    def _insertQuote(self, user, quote):
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        # Insert a row of data
        data = (user, quote,)
        c.execute("INSERT INTO quotes (author,`when`, quote) VALUES (?,datetime(),?)", data)
        # Save (commit) the changes
        conn.commit()
        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
        conn.close()


    def _getLatestQuotes(self):
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        # Insert a row of data
        data = []
        lines = c.execute("SELECT * FROM quotes ORDER BY id DESC ")
        for l in lines:
            data.append(l)
        # Save (commit) the changes
        conn.commit()
        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
        conn.close()
        return data



    @commands.command()
    async def quote(self, ctx, user, quote):
        """Saves a quote. Example: .quote "John Doe" "This is a quote" """
        self._insertQuote(user, quote)
        await ctx.send('Quote saved!')


    @commands.command()
    async def listquotes(self, ctx):
        """List quotes"""
        lines = self._getLatestQuotes()
        message = "```"
        for l in lines:
            message += '"' + l[3] + '" - ' + l[1] + ', ' + l[2] + '\n'
        message += "```"
        await ctx.send(message)
