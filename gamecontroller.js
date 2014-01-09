//Command enum controls available commands
var EnumGameCommands = {
	Start: 0,
	Singleplayer: 10,
	Multiplayer: 20,
	Exit: 30
};

//Command object
function GameCommand(enumCommand, target) {
	this.Command = enumCommand;
	this.Target = target;
};

var gameCommandQueue = {
	Queue: new Array(),
	Enqueue: function(command) { this.Queue.push(command); },
	Dequeue: function() { return this.Queue.shift(); },
	Peek: function() { return this.Queue[0];	},
	Clear: function() { this.Queue = new Array(); },
	Length: function() { return this.Queue.length; },
	IsEmpty: function() { return (this.Queue.length === 0); }
};

function RegisterCommand(target, command) {
	console.log("Command -> Registering command "+command+" for target "+target);
	gameCommandQueue.Enqueue(new GameCommand(command, target));
	console.log("Command -> "+gameCommandQueue.Length()+" commands in queue.");
}

function FetchNextCommand() {
	if (gameCommandQueue.IsEmpty() === true) {
		console.log("Command -> Fetch command exception!");
		throw "Command queue empty!";
	} else {
		var command = gameCommandQueue.Dequeue();
		console.log("Command -> Retrieving command. "+gameCommandQueue.Length()+" remain in queue.");
		return command;
	}
}