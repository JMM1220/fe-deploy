#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const packageJson = require('../package.json')
const inquirer = require("inquirer")
const ora = require("ora")
const fs = require('fs')
const { checkDeployExists } = require('../lib/init')
const deployPath = path.join(process.cwd(), './deploy')
const deployConfigPath = `${deployPath}/deploy.config.js`
const { checkConfigIsValid } = require('../utils/index')


const version = packageJson.version
program
  .version(version, '-v, --version')
  .command('init')
  .action(() => {
    checkDeployExists()
  })
  if (fs.existsSync(deployConfigPath)) {
      deploy()
  }

// 如果配置文件存在，则进入部署流程
function deploy() {
    // 校验配置是否有效
    if (deployConfigPath) {
        const configVaild = checkConfigIsValid(deployConfigPath)
        if(!configVaild) {
            process.exit(1)
        }
    }
    configVaild.forEach(config => {
        const { command, name, env } = config
        program
          .command(`${command}`)
          .description(`${name}项目${env}环境部署`)
          .action(() => {
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: `确定将${name}部署到${env}环境吗？`,
                    name: 'sure'
                }
            ]).then(answer => {
                const { sure } = answer
                if (!sure) {
                    process.exit(1)
                }
                const runUploadTask = require('../deploy')
                runUploadTask()
            })
          })
    })
}

// 解析命令行参数
program.parse(process.argv)