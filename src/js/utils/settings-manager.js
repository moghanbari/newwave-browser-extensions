import {SettingsProvider} from './settings-provider';
import {SettingSanitizer} from './settings-sanitizer';
import {SyncStorage} from './sync-storage';
import {LZString} from './lz-string.js';

class Settings {
  #storageKey = 'password-extension-storage-key';
  #loaded = false;

  async getCategories() {
    if (!this.#loaded) {
      await this.#loadFromStorage();
    }
    return SettingsProvider.getCategoryNames();
  }

  async getSubCategories(categoryName) {
    if (!this.#loaded) {
      await this.#loadFromStorage();
    }
    return SettingsProvider.getSubCategoryNames(categoryName);
  }

  async getSites(categoryName, subCategoryName) {
    if (!this.#loaded) {
      await this.#loadFromStorage();
    }
    return SettingsProvider.getSiteNames(categoryName, subCategoryName);
  }

  async getUsers(categoryName, subCategoryName, siteName) {
    if (!this.#loaded) {
      await this.#loadFromStorage();
    }
    return SettingsProvider.getUserNames(categoryName, subCategoryName, siteName);
  }

  async getPassword(categoryName, subCategoryName, siteName, userName) {
    if (!this.#loaded) {
      await this.#loadFromStorage();
    }
    return SettingsProvider.getPassword(categoryName, subCategoryName, siteName, userName);
  }

  async save(setting) {
    setting = await this.#saveToStorage(setting);
    if (setting) {
      SettingsProvider.setSetting(setting);
      this.#loaded = true;
      return JSON.stringify(setting);
    }
  }

  async load() {
    const setting = await this.#loadFromStorage();
    this.#loaded = true;
    return setting;
  }

  async #loadFromStorage() {
    const storageValue = await SyncStorage.get(this.#storageKey);
    if (storageValue && storageValue[this.#storageKey]) {
      const compressedString = storageValue[this.#storageKey];
      const settingStr = LZString.decompressFromUTF16(compressedString);
      let setting;
      try {
        setting = JSON.parse(settingStr);
      } catch {
        setting = {};
      }
      SettingsProvider.setSetting(setting);
      return setting;
    }
    return false;
  }

  async #saveToStorage(setting) {
    try {
      setting = SettingSanitizer.sanitize(setting);
    } catch {
      setting = {};
    }
    if (Object.entries(setting).length >= 0) {
      let settingStr = JSON.stringify(setting);
      settingStr = LZString.compressToUTF16(settingStr);
      await SyncStorage.set({[this.#storageKey]: settingStr});
      return setting;
    }

    return false;
  }
}
export const SettingsManager = new Settings();
