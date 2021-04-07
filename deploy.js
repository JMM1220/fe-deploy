const config = require('./_config')
const inquirer = require("inquirer")
const ora = require("ora")
const shell = require("shelljs")
const chalk = require('chalk')
const { NodeSSH } = require('node-ssh')
const SSH = new NodeSSH()
const path = require('path')
const compressing = require("compressing")
const fs = require('fs')
const { sendDingMessage } = require('./robot.js')

const log = console.log
let CONFIG = {}
// 主程序(可单独执行)
// 1. 打包本地文件
// 2. 文件压缩
// 3. 连接服务器
// 4. 文件上传服务器
// 5. 清除本地压缩文件

const defaultLog = text => log(chalk.white(`${text}`))
const errorLog = text => log(chalk.red(`${text}`))
const successLog = text => log(chalk.yellow(`${text}`))
/**
 * 打包本地文件
 */
const compileFile = async () => {
  const spinner = ora(defaultLog(`[1/5] 🏄 开始打包...`))
  spinner.start()
  shell.cd(path.resolve(__dirname, "./"))
  const res = await shell.exec('npm run build:dev-tower', { silent: true })
  spinner.stop()
  if (res.code !== 0) {
    errorLog('打包失败')
    process.exit() //退出流程
  }
}

/**
* 文件压缩
*/
const zipDist = async () => {
  defaultLog('[2/5] 💫 项目开始压缩...')
  try {
    const distDir = path.resolve(__dirname, `./${CONFIG.publicPath}`)
    const distZipPath = path.resolve(
      __dirname,
      `./${CONFIG.publicPath}.zip`
    )
    await compressing.zip.compressDir(distDir, distZipPath)
  } catch (error) {
    errorLog(error)
    errorLog("压缩失败, 退出程序!")
    process.exit() //退出流程
  }
}

const connectSSH = async () => {
  const loading = ora(defaultLog("[3/5] 💘 正在连接服务器...")).start()
  try {
    await SSH.connect({
      host: CONFIG.host,
      username: CONFIG.username,
      password: CONFIG.password
    })
  } catch (error) {
    errorLog(error)
    errorLog("SSH连接失败!")
    process.exit() //退出流程
  } finally {
    loading.clear()
  }
}

const runCommand = async (command) => {
  await SSH.exec(command, [], { cwd: CONFIG.path })
}

//备份、清空线上目标目录里的旧文件
const clearOldFile = async () => {
  const date = new Date().getDate()
  const mouth = new Date().getMonth()
  await runCommand(`mkdir -p ${CONFIG.publicPath}`)
  await runCommand(
    `cp -r ${CONFIG.publicPath} ${CONFIG.publicPath}_${mouth + 1}${date}`
  )
  await runCommand(`rm -rf ${CONFIG.publicPath}`)
}
const uploadZipBySSH = async () => {
  //连接ssh
  await connectSSH()
  await clearOldFile()
  const loading = ora(defaultLog("[4/5] 💒 准备上传文件...")).start()
  try {
    const distZipPath = path.resolve(__dirname, `./${CONFIG.publicPath}.zip`)
    await SSH.putFiles([
      { local: distZipPath, remote: CONFIG.path + `${CONFIG.publicPath}.zip` }
    ]) //local 本地 ; remote 服务器 ;
    defaultLog("[5/5] 🍬 开始解压文件...")
    await runCommand(`unzip -o ${CONFIG.path}${CONFIG.publicPath}.zip`) //解压
    await runCommand(`rm -rf ${CONFIG.path}${CONFIG.publicPath}.zip`)
    await runCommand(`scp -r ${CONFIG.path}${CONFIG.publicPath}/* ${CONFIG.path}`) // 将distLocal下的文件复制到/home/h5/webroot/facedoor/ 同级目录下
    SSH.dispose() //断开连接
  } catch (error) {
    errorLog(error)
    errorLog("上传失败!")
    process.exit() //退出流程
  }
  loading.clear()
}
/**
 * 清除本地压缩文件
 */
const clearZipDist = async () => {
  const distZipPath = path.resolve(__dirname, `./${CONFIG.publicPath}.zip`)
  fs.unlink(distZipPath, () => {})
}

/**
 *
 * @returns
 */

/**
 *
 * @returns 服务器发布密码
 */
async function inputPwd() {
  const data = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      message: "服务器密码",
    },
  ]);
  return data.password;
}

const checkConfig = (conf) => {
  const checkArr = Object.entries(conf)
  checkArr.map((it) => {
    const key = it[0]
    if (key === "path" && conf[key] === "/") {
      //上传zip前会清空目标目录内所有文件
      errorLog("PATH 不能是服务器根目录!")
      process.exit() //退出流程
    }
    if (!conf[key]) {
      errorLog(`配置项 ${key} 不能为空`)
      process.exit() //退出流程
    }
  })
}

const runUploadTask = async () => {
  //打包
  await compileFile()
  //压缩
  await zipDist()

  //连接服务器上传文件
  await uploadZipBySSH()

  await clearZipDist()

  successLog("部署成功!")
  await sendDingMessage(CONFIG)
  process.exit()
}

/**
 * 校验发布环境
 */
// async function initInquirer () {
//   const data = await inquirer.prompt([
//     {
//       type: "list",
//       message: "请选择发布环境",
//       name: "env",
//       choices: config.map(sever => ({
//         name: sever.env,
//         value: sever.env
//       }))
//     },
//     {
//       type: "input",
//       message: "请输入提交内容",
//       name: "content",
//       default: '无'
//     }
//   ])

//   CONFIG = config.find((server) => data.env === server.env)
//   CONFIG.content = data.content
//   if (CONFIG) {
//     if (!CONFIG.password) {
//       CONFIG.password = await inputPwd()
//     }
//     checkConfig(CONFIG)
//     runUploadTask()
//   } else {
//     errorLog("未找到该环境")
//   }
// }
// initInquirer()
module.exports = () => {
    runUploadTask()
}
