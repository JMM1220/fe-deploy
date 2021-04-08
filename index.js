#!/usr/bin/env node

const path = require('path')
const { Command } = require('commander')
const packageJson = require('./package.json')
const inquirer = require("inquirer")
const fs = require('fs')
const { checkDeployExists } = require('./lib/init')
const deployPath = path.join(process.cwd(), './fe-deploy-template')
const deployConfigPath = `${deployPath}/deploy.config.js`
const { checkConfigIsValid } = require('./utils/index')


const version = packageJson.version
const program = new Command()
let configVaild
program
  .version(version, '-v, --version')
  .command('init')
  .option('-d, --env <command>', 'Current publishing environment', 'dev')
  .action(async () => {
    await checkDeployExists()
    if (fs.existsSync(deployConfigPath)) {
        // deploy()
    }
  })

// 如果配置文件存在，则进入部署流程
function deploy() {
    // 校验配置是否有效
    if (deployConfigPath) {
        configVaild = checkConfigIsValid(deployConfigPath)
        if(!configVaild.length) {
            process.exit(1)
        }
    }
    program
        .command('start')
        .option('-d, --env <command>', 'Current publishing environment', 'dev')
        // .description(`${name}项目${env}环境部署`)
        .action(() => {
            // inquirer.prompt([
            //     {
            //         type: 'confirm',
            //         message: `确定将${name}部署到${env}环境吗？`,
            //         name: 'sure'
            //     }
            // ]).then(answer => {
            //     const { sure } = answer
            //     if (!sure) {
            //         process.exit(1)
            //     }
            //     const runUploadTask = require('./deploy')
            //     runUploadTask(config)
            // })
        })
    // configVaild.forEach(config => {
    //     const { command, name, env } = config
    //     console.log(command, 'command')
    //     program
    //       .command('start')
    //       .option('-d, --env <command>', 'Current publishing environment', 'dev')
    //       .description(`${name}项目${env}环境部署`)
    //       .action(() => {
    //         inquirer.prompt([
    //             {
    //                 type: 'confirm',
    //                 message: `确定将${name}部署到${env}环境吗？`,
    //                 name: 'sure'
    //             }
    //         ]).then(answer => {
    //             const { sure } = answer
    //             if (!sure) {
    //                 process.exit(1)
    //             }
    //             const runUploadTask = require('./deploy')
    //             runUploadTask(config)
    //         })
    //       })
    // })
}
console.log(program.opts(), 999, program.env, program.outputHelp())
// 解析命令行参数
program.parse(process.argv)