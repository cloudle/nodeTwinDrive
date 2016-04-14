import {connect} from "amqplib";
import {queueHost, queues} from "../lib/queueConfig";

var queueConnect = connect(queueHost);

queueConnect.then(connection => {
	var channelConnect = connection.createChannel();
	console.log("Connection to RabbitMQ has successfully established..");
	channelConnect.then(channel => {
		channel.assertQueue(queues.test);

		channel.consume(queues.test, message => {
			console.log(message.content.toString());
			channel.ack(message);
		});

		return channelConnect;
	});
}).then(null, console.warn);