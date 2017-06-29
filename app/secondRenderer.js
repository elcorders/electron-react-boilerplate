// @flow
import { remote, ipcRenderer } from 'electron';

ipcRenderer.on('compute-factorial', function (event, number, fromWindowId) {
  const result = factorial(number);
  const fromWindow = remote.BrowserWindow.fromId(fromWindowId);
  fromWindow.webContents.send('factorial-computed', number, result);
  window.close();
});

function factorial(num) {
  if (num === 0) return 1;
  return num * factorial(num - 1);
}
