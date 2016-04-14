"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RpcClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _amqplib = require("amqplib");

var _queueConfig = require("../lib/queueConfig");

var _random = require("../lib/random");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RpcClient = exports.RpcClient = function () {
	function RpcClient() {
		var _this = this;

		var host = arguments.length <= 0 || arguments[0] === undefined ? _queueConfig.queueHost : arguments[0];

		_classCallCheck(this, RpcClient);

		this.requestQueues = [];

		(0, _amqplib.connect)(host).then(function (connection) {
			_this.connection = connection;
			connection.createChannel().then(function (channel) {
				_this.channel = channel;
				channel.assertQueue('', { exclusive: true }).then(function (queueInstance) {
					_this.exclusiveQueue = queueInstance;
					_this.channel.consume(queueInstance.queue, _this.rpcResponseHandler.bind(_this), { noAck: true });
					if (_this.ready) _this.ready();
				});
			});
		});
	}

	_createClass(RpcClient, [{
		key: "rpcResponseHandler",
		value: function rpcResponseHandler(message) {
			var requestIndex = this.requestQueues.findIndex(function (x) {
				return x.correlationId == message.properties.correlationId;
			});
			if (requestIndex >= 0) {
				this.requestQueues[requestIndex].callback(message);
				this.requestQueues.splice(requestIndex, 1);
				console.log(this.requestQueues);
			}
		}
	}, {
		key: "request",
		value: function request(params, callback) {
			var correlationId = (0, _random.uniqueId)();
			this.channel.sendToQueue(_queueConfig.queues.rpc, new Buffer(params.toString()), {
				correlationId: correlationId, replyTo: this.exclusiveQueue.queue
			});

			this.requestQueues.push({ correlationId: correlationId, callback: callback });
		}
	}, {
		key: "close",
		value: function close() {
			this.connection.close();
		}
	}]);

	return RpcClient;
}();