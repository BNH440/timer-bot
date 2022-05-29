import Discord from "discord.js";
import logger from "./logger";
import {setTimer, stopTimer} from "./timer";

const client = new Discord.Client({intents: []});

function discordBot() {
  client.on("ready", (client) => {
    logger.info(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(" /timer", {
      type: "LISTENING",
    });
  });

  client.on("interactionCreate", async (interaction) => {
      if (interaction.isButton()) {
        let timerId = interaction.customId;
        await interaction.deferReply();
        await stopTimer(parseInt(timerId));
        await interaction.editReply(`Timer with id \`${timerId}\` stopped`);
      }

      if (interaction.isCommand()) {
        if (interaction.commandName === "timer") {
          let h = interaction.options.getInteger("hours") || 0;
          let m = interaction.options.getInteger("minutes") || 0;
          let s = interaction.options.getInteger("seconds") || 0;
          let time = (h * 3600) + (m * 60) + s;
          if (time == 0) return;
          await interaction.deferReply();
          let timerId = await setTimer(time, interaction.channelId);
          await interaction.editReply({
            content: `Set a timer for \`${h}h:${m}m:${s}s\` with id \`${timerId}\``,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    label: "Stop",
                    style: 4,
                    customId: `${timerId}`,
                  }
                ],
              },
            ]
          });
        }
      }
      //   if (interaction.commandName === "clearpoints") {
      //     if ((interaction.member as GuildMember).permissions.has("ADMINISTRATOR")) {
      //       interaction.reply({
      //         content: "Are you sure?",
      //         components: [
      //           {
      //             type: 1,
      //             components: [
      //               {
      //                 type: 2,
      //                 label: "Cancel",
      //                 style: 2,
      //                 customId: "cancelButton",
      //               },
      //               {
      //                 type: 2,
      //                 label: "Clear Points",
      //                 style: 4,
      //                 customId: "clearButton",
      //               },
      //             ],
      //           },
      //         ],
      //       });
      //     } else {
      //       interaction.reply({content: "You don't have permission to do that.", ephemeral: true});
      //     }
      //   }
      //   if (interaction.commandName === "userpoints") {
      //     await interaction.deferReply();
      //     if (interaction.options.getUser("user") != null) {
      //       let user = interaction.options.getUser("user")!;
      //       let points = await getUserPoints(user.id);
      //       interaction.editReply({embeds: [points], allowedMentions: {users: []}});
      //     } else {
      //       let user = interaction.user;
      //       let points = await getUserPoints(user.id);
      //       interaction.editReply({embeds: [points], allowedMentions: {users: []}});
      //     }
      //   }
      // }
    }
  );

  client.login(process.env.TOKEN);
}

export {discordBot, client};
