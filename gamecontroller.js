//Command enum controls available commands
var EnumGameCommands = {
	Start: 0,
	Singleplayer: 10,
	Multiplayer: 20,
	Exit: 30,
	Clear: 40,
	Write: 50,
	MatchReset: 60
};

//Command object
function GameCommand(enumCommand, target) {
	this.Command = enumCommand;
	this.Target = target;
}

function ComQueue() {
	this.Queue = new Array();
	this.Enqueue = Enqueue;
	this.Dequeue = Dequeue;
	this.Peek = Peek;
	this.Clear = Clear;
	this.Length = Length;
	this.IsEmpty = IsEmpty;
	
	function Enqueue(command) { this.Queue.push(command); }
	function Dequeue() { return this.Queue.shift(); }
	function Peek() { return this.Queue[0];	}
	function Clear() { this.Queue = new Array(); }
	function Length() { return this.Queue.length; }
	function IsEmpty() { return (this.Queue.length === 0); }
}

var gameCommandQueue = new ComQueue();

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

var serverSimulator = {
	CommandQueue: new ComQueue(),

	SendCommand: function(target, command) {
		console.log("Server -> " + command + " sent to server regarding " + target);
		
	},
	
	Main: function() {
		while (serverSimulator.CommandQueue.IsEmpty() === false)
		{
			console.log(serverSimulator.CommandQueue.Length());
			var cmd = serverSimulator.CommandQueue.Dequeue();
		}
	}
}