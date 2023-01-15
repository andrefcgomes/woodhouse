import asyncio

import discord
import youtube_dl
from discord import FFmpegPCMAudio
from discord.ext import commands
import sqlite3

youtube_dl.utils.bug_reports_message = lambda: ''
ytdl_format_options = {
    # 'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0'  # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)
ffmpeg_options = {
    'options': '-vn'
}


class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.url = data.get('url')

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            # take first item from a playlist
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(FFmpegPCMAudio(filename, **ffmpeg_options), data=data)


class Music(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def join(self, ctx, *, channel: discord.VoiceChannel):
        """Joins a voice channel"""
        if ctx.voice_client is not None:
            return await ctx.voice_client.move_to(channel)
        await channel.connect()



    @commands.command()
    async def entrada(self, ctx, *, url):
        """Set entrance song from youtube url"""
        self._setUserEntrance(ctx.author.id, url)
        return None

    @commands.command()
    async def stream(self, ctx, *, url):
        """Streams from a youtube url """
        print(url)
        async with ctx.typing():
            player = await YTDLSource.from_url(url, loop=self.bot.loop)
            ctx.voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)
        ctx.send(ctx.voice_client.source.volume)

        await ctx.send('Now playing: {}'.format(player.title))

    @commands.command()
    async def volume(self, ctx, volume: int):
        """Changes the player's volume"""

        if ctx.voice_client is None:
            return await ctx.send("Not connected to a voice channel.")

        ctx.voice_client.source.volume = volume / 100
        await ctx.send("Changed volume to {}%".format(volume))

    @commands.command()
    async def stop(self, ctx):
        """Stops music"""
        if ctx.voice_client.is_playing():
            await ctx.voice_client.stop()

    @commands.command()
    async def leave(self, ctx):
        """Disconnects the bot from voice"""
        await ctx.voice_client.disconnect()



    def _getUserEntrance(self, user_id):
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        data = []
        lines = c.execute("SELECT * FROM songs WHERE user_id = ?", (user_id,))
        for l in lines:
            data.append(l)
        conn.commit()
        conn.close()
        if len(data) > 0:
            return data[0]
        return None


    def _setUserEntrance(self, user_id, url):
        current_entrance = self._getUserEntrance(user_id)
        conn = sqlite3.connect('bot.db')
        c = conn.cursor()
        if current_entrance is None:
            c.execute("INSERT INTO songs (user_id,url) VALUES (?,?)", (user_id, url,))
        else:
            c.execute("UPDATE songs SET url = ? WHERE user_id = ? ", (url, user_id,))
        conn.commit()
        conn.close()
        return True

    # @play.before_invoke
    # @yt.before_invoke
    @stream.before_invoke
    async def ensure_voice(self, ctx):
        if ctx.voice_client is None:
            if ctx.author.voice:
                await ctx.author.voice.channel.connect()
            else:
                await ctx.send("You are not connected to a voice channel.")
                raise commands.CommandError("Author not connected to a voice channel.")
        elif ctx.voice_client.is_playing():
            ctx.voice_client.stop()

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):

        if before.channel is None and after.channel is not None:
            entrance = self._getUserEntrance(member.id)
            if len(self.bot.voice_clients) > 0:
                voice_client = self.bot.voice_clients[0]
                if entrance is not None:
                    player = await YTDLSource.from_url(entrance[2], loop=self.bot.loop)
                    voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)
                else:
                    player = await YTDLSource.from_url("https://www.youtube.com/watch?v=O-bxRwp76BM", loop=self.bot.loop)
                    voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)
                # await member.guild.system_channel.send('Welcome {0.mention}.'.format(member))



