#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const download = require('download-git-repo');
const ora = require('ora');
const deployPath = path.join(process.cwd(), './deploy')
const deployConfigPath = `${deployPath}/deploy.config.js`
const templateUrl = 'https://github.com/JMM1220/fe-deploy-template.git/'

// 检查配置文件目录是否存在
const checkDeployExists = () => {
    if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
        console.log(`deploy目录下的deploy.config.js文件已存在，请勿重复下载`)
        process.exit(1)
        return
    }
    downloadDeployConfig()
}

// 下载配置文件
const downloadDeployConfig = () => {
    const spinner = ora('开始生成模板')
    spinner.start()
    download(templateUrl, 'deploy', {clone: false}, err => {
        if (err) {
            process.exit(1)
        }
        spinner.stop();
        successLog('模板下载成功，模板位置：deploy/deploy.config.js');
        infoLog('请配置deploy目录下的deploy.config.js配置文件');
        console.log('注意：请删除不必要的环境配置（如只需线上环境，请删除dev测试环境配置）');
        process.exit(0);
    })
} 
module.exports = {
    checkDeployExists
}