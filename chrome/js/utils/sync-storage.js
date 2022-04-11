export class SyncStorage {
  constructor(browser) {
    this.runtime = browser.runtime;
    this.storageArea = browser.storage.sync;
  }

  get(keys) {
    return new Promise(resolve => {
      this.storageArea.get(keys, resolve);
    });
  }

  set(items) {
    return new Promise((resolve, reject) => {
      this.storageArea.set(items, () => {
        const {lastError} = this.runtime;
        if (lastError) return reject(lastError);
        resolve();
      });
    });
  }

  delete(keys) {
    this.storageArea.remove(keys, () => {});
  }
}
