#!/usr/bin/env node
const fs = require('fs')
function checkConfigIsValid(deployConfigPath) {
    const data = require(deployConfigPath)
    if (fs.existsSync(deployConfigPath)) {
        const config = []
        Object.keys(data).forEach(key => {
            if (data[key] instanceof Object) {
                data[key].command = key
                data[key].name = data.name
                config.push(data[key])
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