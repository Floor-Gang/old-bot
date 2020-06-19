import { Guild, Message, Role } from "discord.js";
import { Bot } from "../core/Bot";


export class Roles {
  public static getRoles(guild: Guild, roleNames: string[]): Role[] {
    const guildRoles = guild.roles.cache.values();
    const rolesToLower = roleNames.map(x => x.toLowerCase());
    const roles: Role[] = [];


    for (const role of guildRoles) {
      if (rolesToLower.includes(role.name.toLowerCase())) {
        roles.push(role);
      }
    }

    return roles;
  }

  public static hasRole(roles: Role[], reference: string[]): boolean {
    return roles.some((x) => reference.includes(x.id));
  }

  public static isAdmin() {
    return function(target: Object, key: string, method: PropertyDescriptor) {
      const original = method.value;

      method.value = function(...args: any[]) {
        const bot = args[0] as Bot;
        const msg = args[1] as Message;

        if (!msg.member) {
          msg.reply("Please use this command in a guild.");
          return null;
        }
        const config = bot.getConfig();
        const isAdmin = Roles.hasRole(
          msg.member.roles.cache.array(),
          config.bot.admin_roles
        );

        if (isAdmin) {
          original.apply(this, args);
          return isAdmin;
        } else {
          msg.reply("You must be an admin to use this command.");
          return null;
        }
      }

      return method;
    }
  }

  public isAdminUtil(bot: Bot, msg: Message) {
    if (bot && msg) {
      if (!msg.member)
        return false;
      const config = bot.getConfig();
      return Roles.hasRole(
        msg.member.roles.cache.array(),
        config.bot.admin_roles
      );
    }
  }
}
