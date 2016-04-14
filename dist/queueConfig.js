"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var queueHost = exports.queueHost = "amqp://guest:guest@192.168.0.85"; //"amqp://test:test@192.168.0.60";
var queues = exports.queues = {
	test: "testQueue",
	rpc: "rpcQueue"
};