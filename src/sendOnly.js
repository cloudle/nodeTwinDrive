import {connect} from "amqplib";
import {queueHost, queues} from "../lib/queueConfig";

var queueConnect = connect(queueHost);

queueConnect.then(connection => {
	var channelConnect = connection.createChannel();
	channelConnect.then(channel => {
		console.log("Connection established, now pushing to Queue..");

		channel.assertQueue(queues.test);
		setInterval(() => {
			channel.sendToQueue(queues.test, new Buffer("Hello"));
		}, 5000);

		return channelConnect;
	});
}).then(null, console.warn);