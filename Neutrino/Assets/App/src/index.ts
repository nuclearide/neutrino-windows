import { expect } from "chai";
import {Neutrino} from "./neutrino";

require('mocha');

mocha.setup('bdd');

describe("Neutrino", () => {
    describe("App", () => {
        // it('should quit', () => {
        //     Neutrino.App.quit();
        // })
    })
    describe("FileSystem", () => {
        it('should read a folder', (done) => {
            Neutrino.FileSystem.readdir(__dirname, (arg) => {
                done();
                // expect(arg instanceof Array).to.equal(true);
                // done();
            });
        })
    })
});

mocha.checkLeaks();
mocha.run();
