/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

class LoggerService {
  debugMode = false;

  constructor() {
    if (typeof window !== 'undefined' && window) {
      this.debugMode = JSON.parse(
        localStorage.getItem('megp:debug') ?? 'false',
      );
    }
  }

  public get log(): Function {
    return this.debugMode ? console.log.bind(window.console) : (): void => {};
  }
  public get debug(): any {
    return this.debugMode ? console.debug.bind(window.console) : (): void => {};
  }
  public get info(): any {
    return this.debugMode ? console.info.bind(window.console) : (): void => {};
  }
  public get warn(): any {
    return this.debugMode ? console.warn.bind(window.console) : (): void => {};
  }

  public get error(): Function {
    return this.debugMode ? console.error.bind(window.console) : (): void => {};
  }

  public get table(): Function {
    return this.debugMode ? console.table.bind(window.console) : (): void => {};
  }
}

const logger = new LoggerService();

export default logger;
