
// Maximum payload size
var size = 1000_000;

// Argument for the fuzzed function
var arg = Memory.alloc(size);
var fuzzData = [0x41];

var lolAddr = null;
var lolHandle = null;

// Find the vulnerable function in the target process
// and get a handle to it
Module.enumerateSymbolsSync("code").forEach(function(symbol){
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

        for (let index = 0; index < size; index++) {           
            fuzzData.push(0x41);
            console.log("data lenght -> " + index);
            Memory.writeByteArray(arg, fuzzData);
            try {
                lolHandle(arg);
            }
            catch(e) {
                console.log("[!] Crashed in size of ->  " + fuzzData.length);
                break;
            }
            
        }
        
    },
});
