declare class webkit {

}

declare function __NEUTRINO_SEND_MESSAGE(json: any);

// window['__NEUTRINO_SEND_MESSAGE'] = navigator.platform == "Win32" ? (external as any).notify : (navigator.platform == "Macintosh" ? (webkit as any).messageHandlers.neutrino.postMessage : () => {throw new Error("Unrecognized Platform")});

interface Message {
    type: string;
    body: {[name: string]: any};
    seq: number;
}



function sendMessage(type: string, args: any[] = [], cb?: (...args) => any) {
    if(cb) {
        _handlers[++seq] = (args) => {
            cb.apply(null, args);
        };
    }
    __NEUTRINO_SEND_MESSAGE(JSON.stringify({
        type,
        arguments: args,
        seq: seq || 0
    }));
}

export namespace Neutrino {
    class Module {
        
    }
    export class App extends Module {
        static quit() {
            sendMessage("NEUTRINO_APP_QUIT");
        }
    }
    export interface MenuItem {
        title: string;
        accelerator?: string;
        submenu?: MenuItem[];
        tag?: number;
        onClick?();
    }
    export class Menu extends Module {
        static buildFromJSON(json: {items: MenuItem[]}) {
            var i = -1;
            _menuHandlers = {};
            let process = (arr: MenuItem[]) => {
                for(var item of arr) {
                    item.tag = ++i;
                    if(item.onClick) {
                        _menuHandlers[item.tag] = item.onClick;
                    }
                    if(item.submenu) {
                        item.submenu = process(item.submenu);
                    }
                }
                return arr;
            }
            sendMessage("NEUTRINO_MENU_BUILD", [{menuItems: process(json.items)}]);
        }
        static handleClick(number) {
            console.log(number);
            _menuHandlers[number] && _menuHandlers[number]();
        }
    }
    export class FileSystem extends Module {
        static readFile(filePath: string, cb: (res) => any) {
            sendMessage("NEUTRINO_FILESYSTEM_READ", [{string: filePath}], cb);
        }
        static readdir(filePath: string, cb: (res) => any) {
            sendMessage("NEUTRINO_FILESYSTEM_READDIR", [{string: filePath}], cb);
        }
        static isDir(filePath: string, cb: (res) => any) {
            sendMessage("NEUTRINO_FILESYSTEM_ISDIR", [{string: filePath}], cb);
        }
        static find(base: string, ext: string, cb: (res) => any) {
            sendMessage("NEUTRINO_FILESYSTEM_FIND", [{string: base}, {string: ext}], cb);
        }
        static exists(filePath: string, cb: (res: boolean) => any) {
            sendMessage("NEUTRINO_FILESYSTEM_EXISTS", [{string: filePath}], cb);
        }
    }
}

let seq = 0;
let _handlers: {[name: string]: (args) => any} = {
    0: Neutrino.Menu.handleClick
}
let _menuHandlers = {}

let map = {
    "APP": Neutrino.App,
    "FILESYSTEM": Neutrino.FileSystem,
    "MENU": Neutrino.Menu
}

window["__NEUTRINO_MESSAGE_HANDLER"] = function(res: {type: string, arguments: {}[], seq: number}) {
    var args = res.arguments.map((val) => {
        val[Object.keys(val)[0]];
        return val[Object.keys(val)[0]];
    })
    _handlers[res.seq] && _handlers[res.seq](args);
    delete _handlers[res.seq];    
}