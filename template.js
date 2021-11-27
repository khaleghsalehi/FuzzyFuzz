console.log("init js")
var newFileName="/etc/passwd";


const f=Module.getExportByName(null, 'open')
Interceptor.attach(f, {
    onEnter(args) {   
          var filename = Memory.readCString(ptr(args[0]));
          if (filename.includes('demo.conf'))   {
              console.log("filename "+filename)
          }
          //  var dummyFileName=getRandomString(10);
          //  console.log(dummyFileName);
           args[0].writeUtf8String(newFileName);             
        },
        onLeave(retval) {           
        }
  });


function getRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
  

