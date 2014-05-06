var ws = new WebSocket("ws://echo.websocket.org");

ws.onopen = function() {
    alert("Opened!");
    //msg = {source:"me", msg:"Hello"};
    //ws.send(JSON.stringify(msg));
};

ws.onmessage = function (evt) {
    alert("Message: " + evt.data);
};

ws.onclose = function() {
    alert("Closed!");
};

ws.onerror = function(err) {
    alert("Error: " + err);
};