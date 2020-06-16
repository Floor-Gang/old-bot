import { Command } from "../../core/models/Command";
import { Bot } from "../../core/Bot";
import { Message, MessageEmbed } from "discord.js";
import { Roles } from "../../util/Roles";


/**
 * This sends the rule embeds to a given channel
 * !pewds rules
 */
export class Rules implements Command {
  public readonly name = "rules";
  public readonly description = "Display the rules";

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message): Promise<void> {
    for (const rule of rules) {
      const embed = new MessageEmbed(rule);
      await msg.channel.send({ embed });
    }
  }
}

const rules = [
  {
    "color": 16712194,
    "image": {
      "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/brofist_Uppercase_trimmed.jpg"
    }
  },
  {
    "title": "Welcome to Floor Gang ",
    "description": "**1. Pings**\n\tPlease do not ping Pewdiepie or Sive.\n**2. Usernames** \n\tPlease make sure you have an appropriate username, no nicknames with unusual or unreadable Unicode.\n**3. NSFW/NSFL**\n\tZero tolerance for NSFW / NSFL content / discussions.\n**4. Behave nicely**\n\tThere is zero tolerance for drama, racism, hate speech, or hatred towards any user.\n**5. English only**\n\tNo other language.\n**6. No tier wars**\n\tDo not start \"tier wars\" or shame lower tiers about buying higher tiers.\n**7. Keep the chat clean**\n\tDo not discuss politics, religion or other controversial topics.\n**8. Epilepsy-causing posts**\n\tDo not post flashy images, videos or emotes that can cause epilepsy without\n\tspoiler warning.\n**9. Any Issues?**\n\tIf you have an issue with a member or something is getting out of hand, \n\tplease let us know ASAP through <@718606971384758303>.\n**10. LGBTQ+ is welcome here**\n If you do not believe in equal rights, you can leave.\n**11. Raids or spam**\n     Any user found to be participating in raiding or mass spamming this server or any other server will result in an immediate ban and termination of the user account(s) as per discord terms of service.\n**12. Don't post links unless whitelisted**\nSee <#718792102825295882>.\n**13. No advertising**\nNo unsolicited advertising or any kind of promotions within the server or DMs.\n**14. Don’t ask for stars**\nAsking for Stars is forbidden! We will remove your stars and posts if you ask for stars.\n**15. Please don’t ask us to forward messages to Felix**\n**16. The Staff have the final say in decisions enforced as per the rules**\nIf you have any issues with the enforcement, contact an admin.",
    "color": 16712194
  },
  {
    "color": 16712194,
    "image": {
      "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Voice%20channel%20rules.png"
    }
  },
  {
    "description": "**1. No loud noises**\n\tDon't purposely annoy people with loud sounds with both voice and \n\tmusic bots.\n**2. Reduce background noise**\n\tif possible.\n**3. Don’t troll**\n\tIn music bot-channel, don't play troll songs or sounds.\n**4. Don’t move or skip songs**\n\tWith music bot don't move others music in the queue or skip others music \n\tunless it was purposely played to troll or be annoying.\n",
    "color": 16712194
  },
  {
    "color": 16712194,
    "image": {
      "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Streaming%20rules.png"
    }
  },
  {
    "description": "**1. Appropriate for ages under 18**\nPlease do not stream or show any content that is not appropriate for ages under 18. This includes cards against humanity (sorry).",
    "color": 16712194
  },
  {
    "color": 16712194,
    "image": {
      "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Looking%20for%20help.png"
    }
  },
  {
    "description": "**1. Discord Mod Mail:**\n:white_small_square: To report a user for breaking the rules or needing staff’s\nhelp, send a DM to @Modmail to contact a mod and an available staff member will\nbe with you ASAP. (messages will stay in between the mod and you only.)  Trolling Mod Mail will result in a ban.\n\n:white_small_square: If you have something to report you’re not comfortable \nsending through modmail (For example issues with a staff member) You can send \nan email to Pewdiepiediscordserver@gmail.com. This Email address is only read\nby <@151063310199029760>.\n\n**2. Reddit Mod Mail:**\n:white_small_square: If you need help with the subreddit, please message the \nsubreddit's moderator team. You can do that here --> https://old.reddit.com/message/compose?to=%2Fr%2FPewdiepieSubmissions\n",
    "color": 16712194
  },
  {
    "color": 16712194,
    "image": {
      "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Additional%20terms.png"
    }
  },
  {
    "title": "Discord TOS will be enforced",
    "description": "\nThe Discord Terms of Service will be strictly enforced here. Discord community guidelines can be found at https://discord.com/guidelines and terms of service at https://discordapp.com/terms. Violation of these would result in a mute / temporary ban or even a permanent ban depending on the severity of the violation.\nBreaking the rules will have consequences. You paying for your youtube membership does not mean you can do whatever you want on this server.\nIgnorance/not reading these rules does not make you immune to them. Staff are all volunteers and may moderate at their discretion.\n",
    "color": 16712194
  }
]
