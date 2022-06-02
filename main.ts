import StdinDebugClass from './lib/stdinDebug'
function calling(arg0:string, arg1:string) {
  console.log("arg0: ", arg0, " arg1: ", arg1)
}
StdinDebugClass.instance.registFunc("call", calling)


setInterval(() => {
// internal是为了不让进程直接挂掉，模拟进程进行
}, 10000)
