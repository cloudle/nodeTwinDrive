import {connect} from "amqplib";
import {queueHost, queues} from "../lib/queueConfig";
import {uniqueId} from "../lib/random";

export class RpcClient {
	constructor (host = queueHost) {
		this.requestQueues = [];

		connect(host).then(connection => {
			this.connection = connection;
			connection.createChannel().then(channel => {
				this.channel = channel;
				channel.assertQueue('', {exclusive: true}).then(queueInstance => {
					this.exclusiveQueue = queueInstance;
					this.channel.consume(queueInstance.queue, this.rpcResponseHandler.bind(this), {noAck: true});
					if (this.ready) this.ready();
				});
			});
		})
	}

	rpcResponseHandler (message) {
		var requestIndex = this.requestQueues.findIndex(x => x.correlationId == message.properties.correlationId);
		if (requestIndex >= 0) {
			this.requestQueues[requestIndex].callback(message);
			this.requestQueues.splice(requestIndex, 1);
			console.log(this.requestQueues);
		}
	}

	request (params, callback) {
		var correlationId = uniqueId();
		this.channel.sendToQueue(queues.rpc, new Buffer(params.toString()), {
			correlationId, replyTo: this.exclusiveQueue.queue
		});

		this.requestQueues.push({correlationId, callback});
	}

	close () {
		this.connection.close();
	}
}