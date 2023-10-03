/* eslint-disable @typescript-eslint/no-empty-function -- intentional*/
/* eslint-disable no-console -- intentional*/

/* eslint-disable @typescript-eslint/ban-types -- intentional*/

class LoggerService {
  debugMode = false;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- intentional
    if (typeof window !== 'undefined' && window) {
      this.debugMode =
        process.env.NODE_ENV === 'development'
          ? true
          : JSON.parse(localStorage.getItem('megp:debug') ?? 'false');
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
