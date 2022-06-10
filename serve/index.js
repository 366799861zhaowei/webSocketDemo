const Ws = require("ws");

((Ws) => {
    const server = new Ws.Server({ port: 8000 });

    const init = () => {
        bindEvent();
    };

    function bindEvent(){
        server.on("open",handleOpen);
        server.on("close",handleClose);
        server.on("error",handleError);
        server.on("connection",handleConnection);
    }

    function handleOpen(){
        console.log("BE  Websocket open");
    }
    function handleClose(){
        console.log("BE  Websocket Close");
        this.reconnect()
    }
    function handleError(){
        console.log("BE  Websocket Error");
        this.reconnect()
    }
    function handleConnection(ws){
        console.log("BE  Websocket connection");

        ws.on("message",handleMessage)
    }
    function handleMessage(msg){
        console.log(JSON.parse(msg),"message");
        server.clients.forEach((c)=>{
            c.send(msg);
        })
    }
    init()
    
})(Ws);
