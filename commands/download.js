const axios = require('axios');
const chalk = require('chalk')
var fs = require('fs');

async function download(id) {
    console.log(chalk.yellow(`Downloading trace ${id}...`))
    let url = `https://api.gotrace.world/v1/public/trace/${id}`
    console.log(chalk.green.bold('The public trace ' + id + ' is being downloaded'))
    try {
        response = await axios.get(url)
    } catch (error) {
        console.log(chalk.red.bold(`The public trace ${url} cannot be downloaded: ` + error))
    }    
    fs.writeFileSync(`${id}.json`, JSON.stringify(response.data), function (err) {
        if (err) throw err;
        chalk.red.bold('The public trace cannot be saved: ' + err);
    }
    );
}

module.exports = download