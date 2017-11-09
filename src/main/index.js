import { app,globalShortcut, BrowserWindow } from 'electron'
let config = require('./config');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function callprinter(event,arg1) {
    let exec = require('child_process').exec;
    exec('python '+config.py_path+' '+arg1,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log('you offer args:',stdout);
            // event.sender.send('reply', stdout)
        } else {
            console.log('you don\'t offer args');
        }
        if(error) {
            event.sender.send('reply', stderr)
            // console.info('stderr : '+stderr);
        }
    });
}




function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 900,
        useContentSize: true,
        width: 1700,
        // frame: false
    });

    mainWindow.loadURL(winURL);
    // mainWindow.setAlwaysOnTop(true);
    globalShortcut.register('ESC', () => {
        mainWindow.close();
    });
    globalShortcut.register('F11', () => {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
    });
    // mainWindow.webContents.print()
    mainWindow.on('closed', () => {
        mainWindow = null
    });
    const ipc = require('electron').ipcMain;

    ipc.on('print_event', function (event, arg) {
        // console.log(arg)
        callprinter(event, arg)
    });

    const {ipcMain} = require('electron');

    ipcMain.on('download', (evt, args) => {
        mainWindow.webContents.downloadURL(args);
    });

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        //获取文件的总大小
        const totalBytes = item.getTotalBytes();
        //设置文件存放位置
        const filePath = config.file_path + item.getFilename();
        item.setSavePath(filePath);
        //监听下载过程，计算并设置进度条进度
        item.on('updated', () => {
            mainWindow.setProgressBar(item.getReceivedBytes() / totalBytes);
        });
        //监听下载结束事件
        item.on('done', (e, state) => {
            //如果窗口还在的话，去掉进度条
            if (!mainWindow.isDestroyed()) {
                mainWindow.setProgressBar(-1);
            }

            //下载被取消或中断了
            if (state === 'interrupted') {
                // electron.dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
                console.log('interrupted')
            }

            //下载完成
            if (state === 'completed') {
                console.log('done');
                // console.log(e)
                // e.sender.send('test',filePath);
                webContents.send('download_reply',filePath)
            }

        });
    });
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
