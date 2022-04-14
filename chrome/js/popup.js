import { SyncStorage } from './utils/sync-storage';
import { sampleSetting } from './utils/sample-setting';

function setPassword(password) {
  const passwordField = document.getElementById('password');
  passwordField.value = password;
}

function closePopUp() {
  window.close();
}

window.onload = function () {
  storage = new SyncStorage(chrome || browser);
  storage
    .get(['settings'])
    .then(data => {
      console.log('data===>', data);

      this.settings = !data || !data.settings ? sampleSetting : data.settings;
    })
    .catch(e => {
      console.log(e);
    });

  document.getElementById('env').onchange = function (e) {
    const selectedEnv = e.target.value;
    let targetUrl = '';

    switch (selectedEnv) {
      case 'testDev/.com':
        targetUrl = 'https://buy.test1.adesa.com/';
        setPassword('Bengals@22q1');
        break;
      case 'qa/.com':
        targetUrl = 'https://buy.test2.adesa.com/';
        setPassword('Bears@22q1');
        break;
      case 'uat/.com':
        targetUrl = 'https://buy.uat1.adesa.com/';
        setPassword('Argonauts@22q1');
        break;
      case 'prepProd/.com':
        targetUrl = 'https://buy.test3.adesa.com/';
        setPassword('Colts@22q1');
        break;
      case 'testDev/.ca':
        targetUrl = 'https://buy.test1.adesa.ca/';
        setPassword('Bengals@22q1');
        break;
      case 'qa/.ca':
        targetUrl = 'https://buy.test2.adesa.ca/';
        setPassword('Bears@22q1');
        break;
      case 'uat .ca':
        targetUrl = 'https://buy.uat1.adesa.ca/';
        setPassword('Argonauts@22q1');
        break;
      case 'prepProd/.ca':
        targetUrl = 'https://buy.test3.adesa.ca/';
        setPassword('Colts@22q1');
        break;

      default:
        break;
    }

    document.getElementById('url').value = targetUrl;
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