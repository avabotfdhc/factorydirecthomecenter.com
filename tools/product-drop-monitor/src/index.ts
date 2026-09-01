import { loadConfig } from "./config.js";
import { log } from "./logger.js";
import { runLogin } from "./login.js";
import { runMonitor } from "./monitor.js";
import { NotifierHub } from "./notify/index.js";
import { runProbe } from "./probe.js";
import { errorMessage } from "./util.js";

const USAGE = `
product-drop-monitor

  npm run login              Open a browser, log in by hand, save the session
  npm run probe              Load the page and report what every selector matches
  npm run monitor            Watch for stock (headed — recommended)
  npm run monitor:headless   Watch for stock with no visible window
  npm run test-notify        Fire one test alert down every enabled channel

Config lives in config.json (copy config.example.json to start).
`;

async function main(): Promise<void> {
  const [command = "monitor", ...rest] = process.argv.slice(2);
  const headless = rest.includes("--headless") ? true : rest.includes("--headed") ? false : undefined;

  switch (command) {
    case "login":
      await runLogin();
      break;

    case "probe":
      await runProbe();
      break;

    case "monitor":
      await runMonitor({ headless });
      break;

    case "test-notify": {
      const config = loadConfig();
      const notify = new NotifierHub(config.notify);
      log.info(`Sending a test alert to: ${notify.channelNames.join(", ")}`);
      await notify.urgent(
        "Test alert",
        `If you're reading this, alerts work. Watching: ${config.target.name}.`,
        { url: config.target.productUrl, fields: { Channel: notify.channelNames.join(", ") } },
      );
      break;
    }

    case "help":
    case "--help":
    case "-h":
      console.log(USAGE);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log(USAGE);
      process.exitCode = 1;
  }
}

main().catch((err) => {
  log.error(errorMessage(err));
  process.exitCode = 1;
});
