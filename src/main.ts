import { discordBot } from "./bot";
import deployCommands from "./deployCommands";

require("dotenv").config();

deployCommands();

// Start the discord bot
discordBot();
