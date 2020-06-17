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
      "color": 16712194,
      "fields": [
        {
          "name": "1. Pings",
          "value": "Please do not ping Pewdiepie or Sive."
        },
        {
          "name": "2. Usernames",
          "value": "Please make sure you have an appropriate username, no nicknames with unusual or unreadable Unicode."
        },
        {
          "name": "3. NSFW/NSFL",
          "value": "Zero tolerance for NSFW / NSFL content / discussions."
        },
        {
          "name": "4. Behave nicely",
          "value": "There is zero tolerance for drama, racism, hate speech, or hatred towards any user."
        },
        {
          "name": "5. English only",
          "value": "No other language."
        },
        {
          "name": "6. No tier wars",
          "value": "Do not start \"tier wars\" or shame lower tiers about buying higher tiers."
        },
        {
          "name": "7. Keep the chat clean",
          "value": "Do not discuss politics, religion or other controversial topics."
        },
        {
          "name": "8. Epilepsy-causing posts",
          "value": "Do not post flashy images, videos or emotes that can cause epilepsy without spoiler warning."
        },
        {
          "name": "9. Any Issues?",
          "value": "If you have an issue with a member or something is getting out of hand,  please let us know ASAP through <@718606971384758303>."
        },
        {
          "name": "10. LGBTQ+ is welcome here",
          "value": "If you do not believe in equal rights, you can leave."
        },
        {
          "name": "11. Raids or spam",
          "value": "Any user found to be participating in raiding or mass spamming this server or any other server will result in an immediate ban and termination of the user account(s) as per discord terms of service."
        },
        {
          "name": "12. Don't post links unless whitelisted",
          "value": "See <#718792102825295882>."
        },
        {
          "name": "13. No advertising",
          "value": "No unsolicited advertising or any kind of promotions within the server or DMs."
        },
        {
          "name": "14. Don’t ask for stars",
          "value": "Asking for Stars is forbidden! We will remove your stars and posts if you ask for stars."
        },
        {
          "name": "15. Please don’t ask us to forward messages to Felix",
          "value": "‎"
        },
        {
          "name": "16. The Staff have the final say in decisions enforced as per the rules",
          "value": "If you have any issues with the enforcement, contact an admin."
        }
      ]
    },
    {
      "color": 16712194,
      "image": {
        "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Voice%20channel%20rules.png"
      }
    },
    {
      "color": 16712194,
      "fields": [
        {
          "name": "1. No loud noises",
          "value": "Don't purposely annoy people with loud sounds with both voice and music bots."
        },
        {
          "name": "2. Reduce background noise",
          "value": "if possible."
        },
        {
          "name": "3. Don't troll",
          "value": "In music bot-channel, don't play troll songs or sounds."
        },
        {
          "name": "4. Don’t move or skip songs",
          "value": "With music bot don't move others music in the queue or skip others music unless it was purposely played to troll or be annoying."
        }
      ]
    },
    {
      "color": 16712194,
      "image": {
        "url": "https://filedn.com/ly4bfrMUzAzRiq7eeCRgK1X/pewds/Streaming%20rules.png"
      }
    },
    {
      "color": 16712194,
      "fields": [
        {
          "name": "1. Appropriate for ages under 18",
          "value": "Please do not stream or show any content that is not appropriate for ages under 18. This includes cards against humanity (sorry)."
        }
      ]
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
