import {DiscordFeature} from "./types/DiscordFeature.js";
import {Events, Message} from "discord.js";

export const HeyKetchup: DiscordFeature = {
    name: 'hey-ketchup',
    init: client => client.on(Events.MessageCreate, on)
}

async function on(message: Message) {
    if (message.content === '<@' + message.client.user.id + '>' || message.content === '<@#' + message.client.user.id + '>' ) {
        await message.reply({
            content: '',
            embeds: [
                {
                    description: [
                        '**Hey there!** 👋',
                        '',
                        "i'm ketshap, a discord bot designed to bake random github features into discord. currently, i produce " +
                        "a lot of clean and detailed embeds for servers to provide the most detailed experience for github embeds.",
                        '',
                        "also, i'm open-source... so feel free to hit up contributions @ https://github.com/Ketshap/ketshap"
                    ].join('\n'),
                    footer: {
                        text: 'proudly made by shindou mihou'
                    }
                }
            ]
        })
    }
}

