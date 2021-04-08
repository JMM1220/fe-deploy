#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const download = require('download-git-repo');
const child_process = require('child_process')
const ora = require('ora');
const deployPath = path.join(process.cwd(), './fe-deploy-template')
const deployConfigPath = `${deployPath}/deploy.config.js`
const templateUrl = 'https://github.com/JMM1220/fe-deploy-template.git/'

// 检查配置文件目录是否存在
const checkDeployExists = () => {
    console.log(333, fs.existsSync(deployPath), fs.existsSync(deployConfigPath))
    if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
        console.log(`deploy目录下的deploy.config.js文件已存在，请勿重复下载`)
        // process.exit(1)
        return
    }
    downloadDeployConfig()
}

// 下载配置文件
const downloadDeployConfig = () => {
    const spinner = ora('开始生成模板')
    spinner.start()
    child_process.exec('git clone https://github.com/JMM1220/fe-deploy-template.git', function (err, stdout, stderr) {
        if (err) {
            spinner.fail()
            console.log('配置模板下载失败')
            return
        }
        spinner.stop();
        console.log('模板下载成功，模板位置：fe-deploy-template/deploy.config.js');
        console.log('请配置fe-deploy-template目录下的deploy.config.js配置文件');
        console.log('注意：请删除不必要的环境配置（如只需线上环境，请删除dev测试环境配置）');
        process.exit(0);
    })
    // download(templateUrl, 'deploy', {clone: true}, err => {
    //     if (err) {
    //         console.log(err, 777)
    //         process.exit(1)
    //     }
    //     spinner.stop();
    //     console.log('模板下载成功，模板位置：deploy/deploy.config.js');
    //     console.log('请配置deploy目录下的deploy.config.js配置文件');
    //     console.log('注意：请删除不必要的环境配置（如只需线上环境，请删除dev测试环境配置）');
    //     process.exit(0);
    // })
} 
module.exports = {
    checkDeployExists
}