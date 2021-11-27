#!/usr/bin/python3

import frida
import time
import sys

def on_message(message, data):
    print(message)

js = """

// Maximum payload size
var size = 2000;

// Argument for the fuzzed function
var arg = Memory.alloc(size);
var fuzzData = [0x41];

var lolAddr = null;
var lolHandle = null;

// Find the vulnerable function in the target process
// and get a handle to it
Module.enumerateSymbolsSync("yolo").forEach(function(symbol){
        switch (symbol.name) {
            case "lol":
                lolAddr = symbol.address;
                // use the function prototype to create a handle
                lolHandle = new NativeFunction(ptr(lolAddr), "void", ["pointer"]);
                console.log("[i] lol() is at " + lolAddr);
        }
    });

if (lolAddr == null) {
    console.log("Error finding symbol");
}

// Fuzz the function in-process
Interceptor.attach(ptr(lolAddr), {
    // Begin fuzzing as soon as the application calls the function itself
    onEnter: function(args) {
        console.log("[i] Original argument: " + args[0].readCString());

        console.log("[*] Fuzzing now");
        while(fuzzData.length < size) {
            fuzzData.push(0x41);
            Memory.writeByteArray(arg, fuzzData);
            try {
                lolHandle(arg);
            }
            catch(e) {
                console.log("[!] Crash found for size " + fuzzData.length);
                break;
            }
        }
    },
});
"""

# Spawn the target process
pid = frida.spawn(["./code", "hello"])
session = frida.attach(pid)

# Inject dem scriptz
script = session.create_script(js)
script.on('message', on_message)
script.load()

# Continue execution of the target
frida.resume(pid)

sys.stdin.read()
