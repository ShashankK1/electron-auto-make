//Import Libs
const url = require('url');
const path = require('path');
const electron = require('electron');
const { BrowserWindow, dialog } = require('electron');


const app = electron.app;
const browser_window = electron.BrowserWindow;
const ipc_main = electron.ipcMain;

let copies = 0;
let win;

ipc_main.on('close-icon-clicked',()=>{
    app.quit();
    win = null;
});

ipc_main.on('minimise-icon-clicked',()=>{
    BrowserWindow.getFocusedWindow().minimize();
});

ipc_main.on('maximise-icon-clicked',()=>{
    if(BrowserWindow.getFocusedWindow().isMaximized()){
        BrowserWindow.getFocusedWindow().unmaximize();
    }
    else{

        BrowserWindow.getFocusedWindow().maximize();
    }
});

ipc_main.on('folder-ref',async (e)=>{
    const path = await dialog.showOpenDialog({
        properties:['openDirectory']
    });
    BrowserWindow.getFocusedWindow().webContents.send('path',path);
})


async function create_window(){
    win = new browser_window({
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
        },
        frame:false,
        icon:'./assets/img/icon.png',
        show:false
    });

    await win.loadURL(url.format({
        pathname:path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.once('ready-to-show',()=>{
        win.show();
    })
    

    //win.webContents.openDevTools();

    win.on('close',()=>{
        win = null;
    });
}

app.on('ready',create_window);

//For MAC
app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate',()=>{
    if(win === null){
        create_window();
    }
})
