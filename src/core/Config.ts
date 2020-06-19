import yaml from 'yaml';
import mkdirp from 'mkdirp';
import fs from 'fs';


export type BotConfig = {
  token: string;
  prefix: string;
  admin_roles: string[]
}


/**
 * This is the configuration for the bot
 */
export class Config {
  public static readonly rootPath = './config';
  public static readonly defPath = `${Config.rootPath}/config.yml`;
  public bot: BotConfig;

  constructor() {
    this.bot = {
      token: '',
      prefix: '.',
      admin_roles: []
    }
  }

  /**
   * This will get a current config or if one doesn't already exist it will
   * make a new one.
   */
  public static getConfig(): Config {
    if (fs.existsSync(Config.defPath)) {
      const data = fs.readFileSync(Config.defPath);
      const storedConfig = yaml.parse(data.toString());
      return Config.checkIntegrity(storedConfig);
    } else
      return Config.genConfig();
  }

  /**
   * This creates a new configuration file
   */
  public static genConfig(): Config {
    let config = new Config();

    if (!fs.existsSync(Config.rootPath))
      mkdirp.sync(Config.rootPath);

    let yamlify = yaml.stringify(config);
    fs.writeFileSync(Config.defPath, yamlify);

    return config;
  }

  /**
   * This saves a given config
   */
  public static store(config: Config): void {
    let yamlify = yaml.stringify(config);

    fs.writeFileSync(Config.defPath, yamlify);
  }

  /**
   * This makes sure that all the parts of the configuration are there
   */
  public static checkIntegrity(obj: any): Config {
    const defaultConfig = new Config();
    let newConfig = obj;

    // Check bot config
    if (newConfig.bot) {
      Object.keys(defaultConfig.bot).forEach((key: string) => {
        // @ts-ignore
        const botConfig = defaultConfig.bot[key];

        if (botConfig == undefined) {
          console.log("Editing: " + key);
          // @ts-ignore
          newConfig.bot[key] = defaultConfig.bot[key];
        }
      })
    } else {
      newConfig.bot = defaultConfig.bot;
    }


    Config.store(newConfig);
    return newConfig as Config;
  }
}
