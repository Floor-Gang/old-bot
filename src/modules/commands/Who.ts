import { Command } from "../../core/models/Command";
import { Guild, GuildMember, Message, TextChannel } from "discord.js";
import { Bot } from "../../core/Bot";
import { Roles } from "../../util/Roles";


/**
 * This command will show who has a given role or not
 */
export class Who implements Command {
  public readonly name = 'who';
  public readonly description = 'For listing who has a certain role(s)';

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message): Promise<void> {
    const args = msg.content.split(' ');
    const roleNames = args.splice(2)
      .join(' ')
      .split(',')
      .map(x => x.trim());

    switch (args[1]) {
      case "isn't":
        await Who.listRoles(bot, msg, false, roleNames);
        break;
      case 'is':
        await Who.listRoles(bot, msg, true, roleNames);
        break;
      default:
        const prefix = bot.getConfig().bot.prefix;
        await msg.reply(
          `Sub commands:\n` +
          ` - ${prefix}who isn't role name 1, role name 2\n` +
          ` - ${prefix}is role name 1, role name 2`
        );
    }
  }

  /**
   * This will list all the roles of a member
   * @param bot
   * @param msg
   * @param shouldHave Whether or not they should have a role
   * @param roleNames List of role names to refer to that the member
   * shouldHave or should not have.
   */
  private static async listRoles(bot: Bot, msg: Message, shouldHave: boolean, roleNames: string[]) {
    if (!msg.guild) {
      await msg.reply("Please use this command in a guild.");
      return;
    }
    const roles = Roles.getRoles(msg.guild, roleNames).map(x => x.id);
    const list = Who.getMembers(msg.guild, shouldHave, roles);

    // now list all the members
    const channel = msg.channel as TextChannel;

    try {
      await bot.send(channel, list);
    } catch (err) {
      await bot.send(channel, "The list is too big!");
      throw err;
    }
  }

  /**
   * This will list all the roles of a member
   * @param guild Guild to refer to
   * @param shouldHave Whether or not they should have a role
   * @param roles List of role names to refer to that the member
   * shouldHave or should not have.
   */
  private static getMembers(guild: Guild, shouldHave: boolean, roles: string[]): string {
    const guildMembers = guild.members.cache.array();
    let list = 'Members:\n';

    guildMembers.forEach((member: GuildMember) => {
      if (shouldHave) {
        const hasAllRoles = roles.every(x => {
          return member.roles.cache.has(x);
        });
        if (hasAllRoles)
          list += ` - <@${member.id}>\n`;

      } else {

        const doesNotHave = roles.every(x => {
          return !member.roles.cache.has(x);
        });
        if (doesNotHave)
          list += ` - <@${member.id}>\n`;
      }
    });

    return list;
  }
}
