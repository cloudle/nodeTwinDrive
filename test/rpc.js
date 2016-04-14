import {RpcClient} from "../lib/rpcClient";

var Rpc = new RpcClient(),
	args = process.argv.slice(2);

Rpc.ready = () => {
	var num = parseInt(args[0]) || 0;
	Rpc.request(num, message => {
		console.log("Server has responded..", message.content.toString());
		Rpc.close();
	});
};