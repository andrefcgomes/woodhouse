import discord
from discord import FFmpegPCMAudio
from discord.ext import commands
import inspect
from random import randint
from os import listdir
from os.path import isfile, join


class Soundboard(commands.Cog):

    @commands.command()
    async def dizmealgofofinho(self, ctx):
        '''
        lol
        '''
        rima = randint(0, 9)
        await self.s(ctx, 'rimas/rima' + str(rima))

    @commands.command()
    async def listsounds(self, ctx):
        '''
        Lists available sounds
        '''
        mypath = "sounds"
        files = [f.replace(".mp3", "")
                 for f in listdir(mypath) if isfile(join(mypath, f))]
        files.sort()
        message = "```"
        message += "Sound List \n"
        for line in files:
            message+=line+"\n"
        # while len(files) > 0:
        #     line = files[:3]
        #     if len(line) < 3:
        #         for i in range(len(line), 3):
        #             line.append("")
        #     message += "{: <20} {: <20} {: <20}".format(*line) + '\n'
        #     if len(message) >= 1900:
        #         message += "```"
        #         ctx.send(message)
        #         message = "```"
        #         message += "Sound List \n"
        #     files = files[3:]
        message += "```"
        await ctx.send(message)

    @commands.command()
    async def s(self, ctx, filename):
        '''
        .s [soundname] plays a sound
        '''
        source = discord.PCMVolumeTransformer(FFmpegPCMAudio('sounds/' + filename + '.mp3'))
        ctx.voice_client.play(source, after=lambda e: print('Player error: %s' % e) if e else None)
