import chalk from 'chalk';
import fs from 'fs';

function appendToLogFile(message: string): void {
  const timestamp = new Date().toLocaleString('ko-KR');
  message = `\n\n-- ${timestamp} --\n${message}`;
  fs.appendFile('.log', message, e => {
    if (e) Log.error(e.toString());
  });
}

export class Log {
  public static info(message: string): void {
    appendToLogFile(`[INFO]\n${message}`);
    console.log(`${chalk.green('INFO')} ${message}`);
  }

  public static warn(message: string): void {
    appendToLogFile(`[WARN]\n${message}`);
    console.log(`${chalk.yellow('WARN')} ${message}`);
  }

  public static error(message: string): void {
    appendToLogFile(`[ERROR]\n${message}`);
    console.log(`${chalk.red('ERROR')} ${message}`);
  }
}

process.on('uncaughtException', e => {
  Log.error(e.toString());
});

process.on('warning', e => {
  Log.warn(e.toString());
});
