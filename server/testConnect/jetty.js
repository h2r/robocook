var ws = new WebSocket("ws://127.0.0.1:8080/");

ws.onopen = function() {
    alert("Opened!");
    msg = {source:"me", msg:"Hello"};
    ws.send(JSON.stringify(msg));
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