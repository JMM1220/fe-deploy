#!/usr/bin/env node
const fs = require('fs')
function checkConfigIsValid(deployConfigPath) {
    if (fs.existsSync(deployConfigPath)) {
        const config = []
        Object.keys(deployConfigPath).forEach(key => {
            if (deployConfigPath[key] instanceof Object) {
                deployConfigPath[key].command = key
                deployConfigPath[key].name = deployConfigPath[name]
                config.push(deployConfigPath[key])
            }
        })
        return config
    } else {
        console.log('缺少配置文件，请运行 deploy init 下载配置文件')
        return false
    }
}

module.exports = {
    checkConfigIsValid
}