const { BrowserWindow } = require('electron');
const electron = require('electron');

const dialog = electron.dialog;
const ipc_renderer = electron.ipcRenderer;

const close_ref = document.getElementById('close-icon')
const minimise_ref = document.getElementById('minimise-icon');
const maximise_ref = document.getElementById('maximise-icon');

const fs = require('fs')

close_ref.addEventListener('click',()=>{
    ipc_renderer.send('close-icon-clicked');
})


minimise_ref.addEventListener('click',()=>{
    ipc_renderer.send('minimise-icon-clicked');
});

maximise_ref.addEventListener('click',()=>{
    ipc_renderer.send('maximise-icon-clicked');
});

const fileRef = document.getElementById('file');
const copiesRef = document.getElementById('number');

fileRef.addEventListener('change',(e)=>{
    fs.readFile(e.target.files[0].path,{encoding:'utf-8'},(err,data)=>{
        createTextArea(data);
    })
});

copiesRef.addEventListener('change',(e)=>{
    copies = e.target.value;
});

const btnDiv = document.getElementById('btndiv');
const btnRef = document.createElement('button')
btnDiv.appendChild(btnRef);
btnRef.setAttribute('id','btn');
btnRef.setAttribute('class','btn');
btnRef.innerText = 'make copies';

let copies = 0;
let fileText = '';
let path = '';

const folderRef = document.getElementById('folder-btn');
folderRef.addEventListener('click',async (e)=>{

    ipc_renderer.send('folder-ref');
    
});

ipc_renderer.on('path',(e,arr)=>{
    spanText(arr.filePaths[0]);
    path = arr.filePaths[0];
})



function createTextArea(data){
    const txtAreaRef = document.createElement('textarea');
    txtAreaRef.setAttribute('id','text-area');
    txtAreaRef.setAttribute('class','text-area');
    const bottomRef = document.getElementById('bottom');
    bottomRef.appendChild(txtAreaRef);
    txtAreaRef.textContent = data;
    fileText = data;
}




function spanText(str){
    const destRef = document.getElementById('destination');
    if (document.getElementById('folder-data')) {
        document.getElementById('folder-data').remove();
    }

    const spanRef = document.createElement('span');
    spanRef.setAttribute('id', 'folder-data');
    spanRef.innerText =str;
    spanRef.style.marginLeft = '8px';
    destRef.appendChild(spanRef);
}

let extension = 'txt'
const extRef = document.getElementById('ext');
extRef.addEventListener('change',(e)=>{
    extension = e.target.value;
});


const makeCopiesRef = document.getElementById('btn');
makeCopiesRef.addEventListener('click',()=>{
    create_copies(copies,extension,path,fileText);
});

function create_copies(copies,extension,path,fileText){
    if(copies>0 && path.length>0){

        for(let i=0;i<copies;i++){
            fs.writeFile(
            path+`\\`+'file'+(i+1).toString()+'.'+extension,
            fileText,
            {
                encoding:'utf-8',
                flag:'w'
            },
            (err)=>{
            });
        }
    }
}