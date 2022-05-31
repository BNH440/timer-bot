import logger from "./logger";
import Timer, {TimerEvent} from "easytimer.js";
import {client} from "./bot";
import {Message, TextChannel} from 'discord.js';

const currentTimers: Timer[] = [];

async function setTimer(time: number, channelId: string) {
  let channel = await client.channels.fetch(channelId).then(channel => channel as TextChannel);
  let id = currentTimers.push(new Timer({
    countdown: true,
    startValues: {
      seconds: time
    }
  }));
  currentTimers[id - 1].start();
  logger.info(`Timer started for ${time} seconds with id ${id} in channel ${channelId}`);
  let message: Message;
  var executed = false;
  currentTimers[id - 1].addEventListener("secondsUpdated", async (e: TimerEvent) => {

    let secondsRemaining = currentTimers[id - 1].getTotalTimeValues().seconds;

    logger.info(`Timer ${id} updated to ${secondsRemaining} seconds`);

    if (secondsRemaining <= 10) {
      if (!executed) {
        message = await channel.send({
          content: `Timer \`${id}\` will end <t:${Math.round(Date.now() / 1000) + secondsRemaining}:R>`
        });
        executed = true;
      }
    }
    if (secondsRemaining < 1) {
      // @ts-ignore
      await message.edit({
        content: `Timer \`${id}\` has ended`
      })
    }
  });
  return id;
}

async function stopTimer(id: number) {
  if (currentTimers[id - 1]) {
    currentTimers[id - 1].stop();
    logger.info(`Timer stopped for id ${id}`);
  } else {
    logger.error(`Timer with id ${id} not found`);
    throw new Error(`Timer with id ${id} not found`);
  }
}

export {setTimer, stopTimer};