import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import logger from "./logger";

function deployCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName("timer")
      .setDescription("Set a timer")
      .addIntegerOption((option) => option.setName("hours").setDescription("Hours"))
      .addIntegerOption((option) => option.setName("minutes").setDescription("Minutes"))
      .addIntegerOption((option) => option.setName("seconds").setDescription("Seconds")),
  ].map((command) => command.toJSON());

  const rest = new REST({version: "9"}).setToken(process.env.TOKEN!);

  rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), {body: commands})
    .then((response) => {
      logger.info("Successfully registered application commands.");
      logger.debug(response);
    })
    .catch(logger.error);
}

export default deployCommands;
