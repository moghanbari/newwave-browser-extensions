class Sanitizer {
  sanitize(setting) {
    if (!setting || !this.#isObject(setting)) {
      return {};
    }

    return this.#sanitizeSetting(setting);
  }

  #sanitizeSetting(setting) {
    const sanitizedSetting = {};

    const sanitizedUsers = this.#sanitizeUserArray(setting.users);
    if (sanitizedUsers) sanitizedSetting.users = sanitizedUsers;

    const sanitizedElements = this.#sanitizeElement(setting.elements);
    if (sanitizedElements) sanitizedSetting.elements = sanitizedElements;

    const sanitizedCategories = this.#sanitizeCategories(setting.categories);
    if (sanitizedCategories && sanitizedCategories.length !== 0)
      sanitizedSetting.categories = sanitizedCategories;

    if (setting.generalPassword)
      sanitizedSetting.generalPassword = setting.generalPassword.toString();

    return sanitizedSetting;
  }

  #sanitizeCategories(categories) {
    if (!this.#isArray(categories) || categories.length === 0) {
      return false;
    }

    const sanitized = categories
      .map(category => this.#sanitizeCategory(category))
      .filter(category => category);

    return sanitized.length === 0 ? false : sanitized;
  }

  #sanitizeCategory(category) {
    if (!category?.name) {
      return false;
    }

    const sanitizedCategory = {name: category.name.toString()};

    const sanitizedUsers = this.#sanitizeUserArray(category.users);
    if (sanitizedUsers) sanitizedCategory.users = sanitizedUsers;

    const sanitizedElements = this.#sanitizeElement(category.elements);
    if (sanitizedElements) sanitizedCategory.elements = sanitizedElements;

    const sanitizedSubCategories = this.#sanitizeSubCategories(category.subCategories);
    if (sanitizedSubCategories) sanitizedCategory.subCategories = sanitizedSubCategories;

    if (category.generalPassword)
      sanitizedCategory.generalPassword = category.generalPassword.toString();

    if (category.OverrideParentUsers)
      sanitizedCategory.OverrideParentUsers = !!category.OverrideParentUsers;

    return sanitizedCategory;
  }

  #sanitizeSubCategories(subCategories) {
    if (!this.#isArray(subCategories) || subCategories.length === 0) {
      return false;
    }

    const sanitized = subCategories
      .map(subCategory => this.#sanitizeSubCategory(subCategory))
      .filter(subCategory => subCategory);

    return sanitized.length === 0 ? false : sanitized;
  }

  #sanitizeSubCategory(subCategory) {
    if (!subCategory?.name) {
      return false;
    }

    const sanitizedSubCategory = {name: subCategory.name};

    const sanitizedUsers = this.#sanitizeUserArray(subCategory.users);
    if (sanitizedUsers) sanitizedSubCategory.users = sanitizedUsers;

    const sanitizedElements = this.#sanitizeElement(subCategory.elements);
    if (sanitizedElements) sanitizedSubCategory.elements = sanitizedElements;

    const sanitizedSites = this.#sanitizeSites(subCategory.sites);
    if (sanitizedSites) sanitizedSubCategory.sites = sanitizedSites;

    if (subCategory.generalPassword)
      sanitizedSubCategory.generalPassword = subCategory.generalPassword.toString();

    if (subCategory.OverrideParentUsers)
      sanitizedSubCategory.OverrideParentUsers = !!subCategory.OverrideParentUsers;

    return sanitizedSubCategory;
  }

  #sanitizeSites(sites) {
    if (!this.#isArray(sites) || sites.length === 0) {
      return false;
    }

    const sanitized = sites.map(site => this.#sanitizeSite(site)).filter(site => site);

    return sanitized.length === 0 ? false : sanitized;
  }

  #sanitizeSite(site) {
    if (!site?.url) {
      return false;
    }

    const sanitizedSite = {url: site.url.toString()};

    const sanitizedUsers = this.#sanitizeUserArray(site.users);
    if (sanitizedUsers) sanitizedSite.users = sanitizedUsers;

    const sanitizedElements = this.#sanitizeElement(site.elements);
    if (sanitizedElements) sanitizedSite.elements = sanitizedElements;

    if (site.generalPassword) sanitizedSite.generalPassword = site.generalPassword.toString();

    if (site.OverrideParentUsers) sanitizedSite.OverrideParentUsers = !!site.OverrideParentUsers;
    return sanitizedSite;
  }

  #sanitizeElement(element) {
    if (!this.#isObject(element)) {
      return false;
    }

    let sanitizedElement = element.usernameElementSelector
      ? {usernameElementSelector: element.usernameElementSelector.toString()}
      : {};

    sanitizedElement = element.passwordElementSelector
      ? {...sanitizedElement, passwordElementSelector: element.passwordElementSelector.toString()}
      : sanitizedElement;

    sanitizedElement = element.submitElementSelector
      ? {...sanitizedElement, submitElementSelector: element.submitElementSelector.toString()}
      : sanitizedElement;

    return Object.keys(sanitizedElement).length === 0 ? false : sanitizedElement;
  }

  #sanitizeUserArray(usersArray) {
    if (!usersArray || !this.#isArray(usersArray)) {
      return false;
    }

    const sanitized = usersArray
      .filter(user => user.username)
      .map(user => {
        const sanitizedUser = {username: user.username.toString()};
        return user.password
          ? {...sanitizedUser, password: user.password.toString()}
          : sanitizedUser;
      });

    return sanitized.length === 0 ? false : sanitized;
  }

  #isObject(param) {
    return param && param.constructor === Object;
  }

  #isArray(param) {
    return Array.isArray(param);
  }
}

export const SettingSanitizer = new Sanitizer();
