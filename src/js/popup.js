import { SettingsManager } from './utils/settings-manager';

function setPassword(password) {
  const passwordField = document.getElementById('password');
  passwordField.value = password;
}

//  async SettingManager.load() to load the setting into memory
//  async getCategories()
//  async getSubCategories(categoryName)
//  async getSites(categoryName, subCategoryName)
//  async getUsers(categoryName, subCategoryName, siteName) {
//  async getPassword(categoryName, subCategoryName, siteName, userName)

async function loadCredentials() {
  const credentials = await fetch('https://us-east-1-testdev.nw.adesa.com/static-components/extension/credentials.json');
  if (credentials) {
    const credentialsJson = await credentials.json();
    await SettingsManager.save(credentialsJson);
  }
}

async function loadSubcategories() {
  const subCategories = await SettingsManager.getSubCategories('Adesa');

  const envsDropdown = document.getElementById('env');
  if (subCategories.length > 0) {
    subCategories.map(subCat => {
      const option = document.createElement('option');
      option.value = subCat;
      option.text = subCat;
      envsDropdown.appendChild(option);
    })
  }
}

async function loadUsers() {
  const categories = await SettingsManager.getCategories();
  const users = categories[0].users;

  const envsDropdown = document.getElementById('username');
  if (users.length > 0) {
    users.map(({ username }) => {
      const option = document.createElement('option');
      option.value = username;
      option.text = username;
      envsDropdown.appendChild(option);
    })
  }
}

window.onload = async function () {
  await SettingsManager.load();

  await loadCredentials();

  await loadSubcategories();

  await loadUsers();

  document.getElementById('env').onchange = async function (e) {
    const selectedEnv = e.target.value;

    const sites = await SettingsManager.getSites('Adesa', selectedEnv);
    const siteUrl = sites[0];
    document.getElementById('url').value = siteUrl;

    const subCategories = await SettingsManager.getSubCategoriesObj('Adesa');
    const selectedPassword = subCategories.find(s => s.name === selectedEnv).generalPassword;
    document.getElementById('password').value = selectedPassword;

    // switch (selectedEnv) {
    //   case 'testDev/.com':
    //     targetUrl = 'https://buy.test1.adesa.com/';
    //     setPassword('Bengals@22q1');
    //     break;
    //   case 'qa/.com':
    //     targetUrl = 'https://buy.test2.adesa.com/';
    //     setPassword('Bears@22q1');
    //     break;
    //   case 'uat/.com':
    //     targetUrl = 'https://buy.uat1.adesa.com/';
    //     setPassword('Argonauts@22q1');
    //     break;
    //   case 'prepProd/.com':
    //     targetUrl = 'https://buy.test3.adesa.com/';
    //     setPassword('Colts@22q1');
    //     break;
    //   case 'testDev/.ca':
    //     targetUrl = 'https://buy.test1.adesa.ca/';
    //     setPassword('Bengals@22q1');
    //     break;
    //   case 'qa/.ca':
    //     targetUrl = 'https://buy.test2.adesa.ca/';
    //     setPassword('Bears@22q1');
    //     break;
    //   case 'uat .ca':
    //     targetUrl = 'https://buy.uat1.adesa.ca/';
    //     setPassword('Argonauts@22q1');
    //     break;
    //   case 'prepProd/.ca':
    //     targetUrl = 'https://buy.test3.adesa.ca/';
    //     setPassword('Colts@22q1');
    //     break;

    //   default:
    //     break;
    // }

    document.getElementById('username').selectedIndex = 1
  };

  document.getElementById('go').onclick = function () {
    const newUrl = document.getElementById('url').value;
    if (newUrl.length != 0) {
      // chrome.tabs.create({ url: newUrl });
      chrome.tabs.update({ url: newUrl });
      closePopUp();
    }
  };

  document.getElementById('settings').onclick = function () {
    if (window.chrome) {
      chrome.runtime.openOptionsPage(err => {
        console.error(`Error: ${err}`);
      });
    } else if (window.browser) {
      window.browser.runtime.openOptionsPage().catch(err => {
        console.error(`Error: ${err}`);
      });
    }
  };

  document.getElementById('copy-username').onclick = async function () {
    const username = document.getElementById('username').value;
    await navigator.clipboard.writeText(username);
  };

  document.getElementById('copy-password').onclick = async function () {
    const password = document.getElementById('password').value;
    await navigator.clipboard.writeText(password);
  };

  document.getElementById('fill').onclick = async function () {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
      console.log(tabs);
      const { id: tabId } = tabs[0].url;

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const code = `(function getUrls(){
          const href = window.location.href;

          const username = '${username}';
          const password = '${password}';

          if(username) {
            document.querySelector('#accountName').value = '${username}'
          }

          if(password) {
            document.querySelector('#password').value = '${password}'
          }

          setTimeout(() => document.querySelector('#loginSubmit').click(), 1000);
  
          return { password, href };
        })()`;

      // http://infoheap.com/chrome-extension-tutorial-access-dom/
      chrome.tabs.executeScript(tabId, { code }, function (result) {

      });

      closePopUp();
    });
  };
};