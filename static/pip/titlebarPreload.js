// eslint-disable-next-line no-console
console.log('titlebar-preloaded~~~~~~~');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer, remote } = require('electron');
const isDarwin = process.platform === 'darwin';

document.addEventListener('DOMContentLoaded', () => {
  const titlebar = document.querySelector('.titlebar');
  const content = document.querySelector('.content');
  let close = null;
  let min = null;
  let full = null;
  let recover = null;
  let max = null;
  if (titlebar) {
    titlebar.addEventListener('dblclick', () => ipcRenderer.send('mouseup', 'max'));
  }
  if (isDarwin) {
    close = document.querySelector('.titlebarClose');
    min = document.querySelector('.titlebarMin');
    full = document.querySelector('.titlebarFull');
    recover = document.querySelector('.titlebarRecover');
    max = document.querySelector('.titlebarMax');
    let mouseenter = false;

    if (content) {
      document.addEventListener('keydown', (e) => {
        const fullScreen = recover.style.display === 'block';
        if (e.keyCode === 18 && mouseenter && !fullScreen) {
          ipcRenderer.send('maximizable', true);
        }
      });
      document.addEventListener('keyup', () => {
        const fullScreen = recover.style.display === 'block';
        if (!fullScreen) {
          ipcRenderer.send('maximizable', false);
        }
      });
      content.addEventListener('mouseenter', (e) => {
        mouseenter = true;
        remote.getCurrentWindow().getBrowserViews()[2].webContents.focus();
        const fullScreen = recover.style.display === 'block';
        close.src = 'assets/titleBarClose-hover-icon.svg';
        if (!fullScreen) {
          if (e.altKey) {
            full.style.display = 'none';
            max.style.display = 'block';
          }
          min.src = 'assets/titleBarExitFull-hover-icon.svg';
          full.src = 'assets/titleBarFull-hover-icon.svg';
        } else {
          recover.src = 'assets/titlebarRecover-hover-icon.svg';
        }
      });
      content.addEventListener('mouseleave', () => {
        mouseenter = false;
        const fullScreen = recover.style.display === 'block';
        close.src = 'assets/titleBarClose-default-icon.svg';
        min.src = 'assets/titleBarExitFull-default-icon.svg';
        if (!fullScreen) {
          full.src = 'assets/titleBarFull-default-icon.svg';
          full.style.display = 'block';
          max.style.display = 'none';
        } else {
          recover.src = 'assets/titlebarRecover-default-icon.svg';
        }
      });
    }
  } else {
    console.log(123);
  }
  if (close) {
    close.addEventListener('mouseup', () => ipcRenderer.send('mouseup', 'close'));
  }
  if (min) {
    min.addEventListener('mouseup', () => ipcRenderer.send('mouseup', 'min'));
  }
  if (full) {
    full.addEventListener('mouseup', () => ipcRenderer.send('mouseup', 'full'));
  }
  if (recover) {
    recover.addEventListener('mouseup', () => ipcRenderer.send('mouseup', 'recover'));
  }
  if (max) {
    max.addEventListener('mouseup', () => ipcRenderer.send('mouseup', 'max'));
  }
});
