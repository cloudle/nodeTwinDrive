import {connect} from "amqplib";
import {queueHost, queues} from "../lib/queueConfig";

var args = process.argv.slice(2);
if (args.length == 0) {
	console.log("Usage: rpc_client.js num");
	process.exit(1);
}

var queueConnect = connect(queueHost);

queueConnect.then(connection => {
	var channelConnect = connection.createChannel();

	channelConnect.then(channel => {
		var queueConnect = channel.assertQueue('', {exclusive: true});

		queueConnect.then((q) => {
			console.log("Queue asserted!");
			var corr = generateUuid();
			var num = parseInt(args[0]);

			console.log(' [x] Requesting fib(%d)', num);

			channel.consume(q.queue, function(msg) {
				if (msg.properties.correlationId == corr) {
					console.log(' [.] Got %s', msg.content.toString());
					setTimeout(function() { connection.close(); process.exit(0) }, 500);
				}
			}, {noAck: true});

			channel.sendToQueue(queues.rpc,	new Buffer(num.toString()),	{ correlationId: corr, replyTo: q.queue });
		});

		return channelConnect;
	});
}).then(null, console.warn);

function generateUuid() {
	return Math.random().toString() +
		Math.random().toString() +
		Math.random().toString();
}