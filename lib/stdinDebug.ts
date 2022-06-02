/*
let wantPrintStr = "9999"
StdinDebugClass.instance.registFunc("runtime_set_str", (value1, value2, value3) => {
  wantPrintStr = "2222"
  console.log("=>", wantPrintStr)
})
StdinDebugClass.instance.registObject("printstr", wantPrintStr)

// 快速调用方法(场景: 提前注册好方法，运行时操作)
Usage: _$runtime_set_str:firstArg:secondArg:thirdArg
// 快速获取内存中数据(场景: 可能被修改，此时可以打印出是否还是原来的值)
Usage: _$printstr:
*/

enum EStdInType {
  func = 1,
  obj = 2
}

class StdinDebugClass {
  enableStdinDebug: boolean
  map:Map<string,{type:number,value?:any,func?:Function}>
  constructor() {
    this.enableStdinDebug = process.env.ENABLE_STDIN_DEBUG ? true : false
    if (!this.enableStdinDebug) return
    console.log("您已开启控制台输入debug模式")
    this.map = new Map()
    process.stdin.setEncoding("utf8")
    this.setupStdInAction()
  }
  setupStdInAction() {
    process.stdin.on("data", (chunk:any) => {
      const result = chunk.replace(/[\r\n]/g, '')
      if (!!result) {
        if (!/:/.test(result)) return process.stdout.write("请输入正确格式: `name:target`\r\n")
        const arr = result.split(":") as string[]
        const name = arr[0]
        const target = this.map.get(name)
        if (target) {
          process.stdout.write(`你输入的${name}是: result:${JSON.stringify(target)}\r\n`)
          if (target.type === EStdInType.func) target.func(...arr.slice(1))
          else if (target.type === EStdInType.obj) console.log(arr[1]?arr[1]:"" + target.value)
        } else process.stdout.write("没有找到对应的方法或参数")
      } else process.stdout.write("请输入正确格式: `name:target`\r\n")
    })
  }
  registFunc(name:string, func:any) {
    if (!this.enableStdinDebug) return
    this.map.set(name, {
      type: EStdInType.func,
      func
    })
  }
  registObject(name:string, value:any) {
    if (!this.enableStdinDebug) return
    this.map.set(name, {
      type: EStdInType.obj,
      value
    })
  }
  static self:StdinDebugClass
  static get instance():StdinDebugClass {
    if (!this.self) this.self = new StdinDebugClass
    return this.self
  }
}

export default StdinDebugClass
