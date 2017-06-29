// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// 2nd renderer adds -- start
import { ipcRenderer, remote } from 'electron';
import path from 'path';
// 2nd renderer adds -- end
import styles from './Home.css';

const SecondRendererBtn = () => (
  <button onClick={throwSecondRenderer}>Open 2nd Renderer by IPC</button>
);

const throwSecondRenderer = () => {
  const windowID = remote.BrowserWindow.getFocusedWindow().id;
  let appPath;

  process.env.NODE_ENV === 'development' ?
    appPath = path.join(remote.app.getAppPath().replace('/node_modules/electron/dist/resources/default_app.asar', '/app')) :
    appPath = remote.app.getAppPath();

  const rndPath = path.join(appPath, './secondRenderer.html');
  const win = new remote.BrowserWindow({ width: 400, height: 400 });
  win.loadURL(`file://${rndPath}`);

  win.webContents.on('did-finish-load', () => {
    const input = 100;
    win.webContents.send('compute-factorial', input, windowID);
  });
};

// Create IPC response listener
ipcRenderer.on('factorial-computed', (event, input, output) => {
  const message = `The factorial of ${input} is ${output}`;
  console.log('-- MESSAGE --', message);
});

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link><br /><br />
          <SecondRendererBtn />
          <h4>
            Check console log for IPC return message
          </h4>
        </div>
      </div>
    );
  }
}
