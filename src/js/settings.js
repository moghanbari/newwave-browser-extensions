import {SettingsManager} from './utils/settings-manager';

window.onload = async function () {
  const setting = await SettingsManager.load();

  const container = document.getElementById('jsoneditor');
  const options = {
    enableTransform: false,
    enableSort: false,
    search: false,
    mode: 'code',
    modes: ['code', 'tree'],
  };
  const editor = new JSONEditor(container, options);
  editor.set(setting);

  document.getElementById('save').onclick = async () => {
    await SettingsManager.save(editor.get());
    const setting = await SettingsManager.load();
    editor.set(setting);
  };

  document.getElementById('reload').onclick = async () => {
    const setting = await SettingsManager.load();
    editor.set(setting);
  };
};
