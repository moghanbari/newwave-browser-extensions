class Settings {
  setSetting(setting) {
    this.setting = setting;
  }

  getCategories() {
    if (!this.setting) {
      return false;
    }

    return this.setting?.categories;
  }

  getCategoryNames() {
    if (!this.setting) {
      return false;
    }

    return this.#getNames(this.setting?.categories);
  }

  getSubCategory(categoryName) {
    const category = this.#getCategoryByName(categoryName);

    return category?.subCategories;
  }

  getSubCategoryNames(categoryName) {
    const category = this.#getCategoryByName(categoryName);
    return this.#getNames(category?.subCategories);
  }

  getSiteNames(categoryName, subCategoryName) {
    const subCategory = this.#getSubCategoryByName(categoryName, subCategoryName);
    return this.#getUrls(subCategory.sites);
  }

  getPassword(categoryName, subCategoryName, siteName, username) {
    if (!this.setting) {
      return '';
    }
    let password = this.setting.generalPassword || '';

    let user = this.#getUser(this.setting.users, username);
    if (user?.password) {
      password = user.password;
    }

    const category = this.#getCategoryByName(categoryName);
    if (category.generalPassword) {
      password = category.generalPassword;
    }
    user = this.#getUser(category.users, username);
    if (user?.password) {
      password = user.password;
    }

    const subCategory = this.#getSubCategoryByName(categoryName, subCategoryName);
    if (subCategory.generalPassword) {
      password = subCategory.generalPassword;
    }
    user = this.#getUser(subCategory.users, username);
    if (user?.password) {
      password = user.password;
    }

    const site = this.#getSiteByName(categoryName, subCategoryName, siteName);
    if (site.generalPassword) {
      password = site.generalPassword;
    }
    user = this.#getUser(site.users, username);
    if (user && user.password) {
      password = user.password;
    }

    return password;
  }

  getUserNames(categoryName, subCategoryName, siteName) {
    if (!this.setting) {
      return [];
    }

    let usernames = this.#getUsernames(this.setting.users);

    const category = this.#getCategoryByName(categoryName);
    let newUserNames = this.#getUsernames(category.users);
    if (category?.overrideParentUsers) {
      usernames = [];
    }

    usernames = [...new Set([...usernames, ...newUserNames])];

    const subCategory = this.#getSubCategoryByName(categoryName, subCategoryName);
    newUserNames = this.#getUsernames(subCategory.users);
    if (subCategory?.overrideParentUsers) {
      usernames = [];
    }
    usernames = [...new Set([...usernames, ...newUserNames])];

    const site = this.#getSiteByName(categoryName, subCategoryName, siteName);
    newUserNames = this.#getUsernames(site.users);
    if (site?.overrideParentUsers) {
      usernames = [];
    }
    return [...new Set([...usernames, ...newUserNames])];
  }

  getUserNameElementSelector(categoryName, subCategoryName, siteName) {
    return this.#getElementObject(categoryName, subCategoryName, siteName)?.userNameElementSelector;
  }

  getPasswordElementSelector(categoryName, subCategoryName, siteName) {
    return this.#getElementObject(categoryName, subCategoryName, siteName)?.passwordElementSelector;
  }

  getSubmitElementSelector(categoryName, subCategoryName, siteName) {
    return this.#getElementObject(categoryName, subCategoryName, siteName)?.submitElementSelector;
  }

  #getElementObject(categoryName, subCategoryName, siteName) {
    let elementSelectors = this.setting?.elementSelectors || {};

    const category = this.#getCategoryByName(categoryName);
    elementSelectors = { ...elementSelectors, ...(category?.elementSelectors || {}) };

    const subCategory = this.#getSubCategoryByName(categoryName, subCategoryName);
    elementSelectors = { ...elementSelectors, ...(subCategory?.elementSelectors || {}) };

    const site = this.#getSiteByName(categoryName, subCategoryName, siteName);
    return { ...elementSelectors, ...(site?.elementSelectors || {}) };
  }

  #getUser(array, username) {
    if (!array || !Array.isArray(array)) {
      return false;
    }

    return array.find(item => item && item.username == username) || false;
  }

  #getSiteByName(categoryName, subCategoryName, siteName) {
    const subCategory = this.#getSubCategoryByName(categoryName, subCategoryName);

    if (!subCategory) {
      return false;
    }

    return this.#findArrayElementByName(subCategory.sites, siteName);
  }

  #getSubCategoryByName(categoryName, subCategoryName) {
    const category = this.#getCategoryByName(categoryName);

    if (!category) {
      return false;
    }

    return this.#findArrayElementByName(category.subCategories, subCategoryName);
  }

  #getCategoryByName(categoryName) {
    if (!this.setting) {
      return false;
    }

    return this.#findArrayElementByName(this.setting.categories, categoryName);
  }

  #getNames(array) {
    return this.#extractArrayProperty(array, 'name');
  }

  #getUsernames(array) {
    return this.#extractArrayProperty(array, 'username');
  }

  #getUrls(array) {
    return this.#extractArrayProperty(array, 'url');
  }

  #extractArrayProperty(array, propertyName) {
    if (!array || !Array.isArray(array)) {
      return [];
    }

    return array.map(item => item && item[propertyName]).filter(value => value);
  }

  #findArrayElementByName(array, name) {
    if (!array || !Array.isArray(array)) {
      return false;
    }

    return array.find(item => item?.name === name) || false;
  }
}

export const SettingsProvider = new Settings();
