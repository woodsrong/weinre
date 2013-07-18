var cluster		= require('cluster'),
	isWindows	= /\\/.test(__dirname),
	i;

//阻止进程因异常而退出
process.on('uncaughtException',function(e){
	console.log(e.stack);
});

startServer();

/**
 * 通过cluster启动master && worker
 */
function startServer(){
	if(cluster.isMaster && !isWindows){//如果是主进程则根据当前CPU数来启动子进程
		console.log('start master....');
        cluster.fork();
		//子进程被杀死的时候做下处理，原地复活
		cluster.on('exit', function(worker){
			worker.destroy();
			cluster.fork();
		});
		process.title = 'node weinre/master';
	}else{//子进程直接引入proxy文件,当然也可以直接在这里写逻辑运行，注意此处else作用域属于子进程作用域，非本程序作用域
        console.log('start worker....');
        process.title = 'node weinre/worker';
		require('./weinre');
	}
}