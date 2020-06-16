import { Command } from "../../core/models/Command";
import { Bot } from "../../core/Bot";
import { Guild, Message, Role } from "discord.js";
import { Roles } from "../../util/Roles";


/**
 * Admin management command
 * - ${prefix} admin add Role a, role b, role c
 ` - ${prefix} admin remove Role a, role b, role c
 ` - ${prefix} admin list
 */
export class Admin implements Command {
  public readonly name = "admin";
  public readonly description = "Admin management commands";

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message) {
    if (!msg.member)
      return;

    // args = ["<bot prefix>", "admin", "command"]
    const args = msg.content.split(' ');
    const roleNames = args.splice(3)
      .join(' ')
      .split(',')
      .map(x => x.trim());
    const roles = Roles.getRoles(msg.guild as Guild, roleNames);


    switch (args[2]) {
      case 'add':
        await Admin.add(bot, msg, roles);
        break;
      case 'remove':
        await Admin.remove(bot, msg, roles);
        break;
      case 'list':
        await Admin.list(bot, msg);
        break;
      default:
        await Admin.help(bot, msg);
        break;
    }
  }

  private static async add(bot: Bot, msg: Message, roles: Role[]) {
    let config = bot.getConfig();
    let added = 'Added Roles```\n';

    for (const role of roles) {
      added += ` - ${role.name}\n`;
      config.bot.admin_roles.push(role.id);
    }

    added += '```';
    bot.setConfig(config);
    await msg.reply(added);
  }

  private static async remove(bot: Bot, msg: Message, roles: Role[]) {
    let config = bot.getConfig();
    let removed = 'Removed Roles```\n';

    config.bot.admin_roles.forEach((role, i) => {
      const roleToRemove = roles.find(x => x.id == role);

      if (roleToRemove) {
        removed += ` - ${roleToRemove.name}\n`;
        config.bot.admin_roles.splice(i);
      }
    });

    removed += '```';
    bot.setConfig(config);
    await msg.reply(removed);
  }

  private static async list(bot: Bot, msg: Message) {
    const config = bot.getConfig();
    const guild = msg.guild as Guild;
    let list = 'Admin Roles:\n'

    for (const roleID of config.bot.admin_roles) {
      const role = await guild.roles.fetch(roleID);
      if (role)
        list += ` - ${role.name}\n`;
    }

    await msg.reply(list);
  }

  private static async help(bot: Bot, msg: Message) {
    const config = bot.getConfig();
    const prefix = config.bot.prefix;

    await msg.reply(
      'Admin Commands\n' +
      ` - ${prefix} admin add Role a, role b, role c\n` +
      ` - ${prefix} admin remove Role a, role b, role c\n` +
      ` - ${prefix} admin list`
    );
  }
}
