import {connect} from "amqplib";
import {queueHost, queues} from "../lib/queueConfig";

var queueConnect = connect(queueHost);

queueConnect.then(connection => {
	var channelConnect = connection.createChannel();
	channelConnect.then(channel => {
		channel.assertQueue(queues.rpc, {durable: false});
		channel.prefetch(1); console.log(' [x] Awaiting RPC requests');

		channel.consume(queues.rpc, message => {
			var requestNumber = parseInt(message.content.toString());
			console.log(" [.] fib(%d)", requestNumber);

			var result = fibonacci(requestNumber);

			channel.sendToQueue(message.properties.replyTo,
				new Buffer(result.toString()),
				{correlationId: message.properties.correlationId});

			channel.ack(message);
		});

		return channelConnect;
	});
}).then(null, console.warn);

function fibonacci(n) {
	if (n == 0 || n == 1)
		return n;
	else
		return fibonacci(n - 1) + fibonacci(n - 2);
}