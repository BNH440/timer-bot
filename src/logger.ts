const bunyan = require("bunyan"),
  bformat = require("bunyan-format"),
  formatOut = bformat({outputMode: "short"});

const logger = bunyan.createLogger({
  name: "bot",
  serializers: bunyan.stdSerializers,
  streams: [
    {
      level: process.env.LOG_LEVEL || 'info',
      stream: formatOut,
    },
    {
      level: "trace",
      type: "rotating-file",
      path: "./output.log",
      period: "1d",
      count: 3
    },
  ],
});

export default logger;