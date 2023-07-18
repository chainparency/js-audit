const chalk = require('chalk')
var fs = require('fs');

async function download(id) {
    console.log(chalk.yellow(`Downloading trace ${id}...`))
    let url = `https://api.gotrace.world/v1/public/trace/${id}`
    console.log(chalk.green.bold('The public trace ' + id + ' is being downloaded'))
    try {
        res = await fetch(url)
    } catch (error) {
        console.log(chalk.red.bold(`The public trace ${url} cannot be downloaded: ` + error))
    }
    let parsedData = await res.json()
    fs.writeFileSync(`public_trace_${id}.json`, JSON.stringify(parsedData), function (err) {
        if (err) throw err;
        chalk.red.bold('The public trace cannot be saved: ' + err);
    }
    );
    if (parsedData.trace != null && parsedData.trace.supply_graph != null && parsedData.trace.supply_graph.shipments[id] != null) {
        filteredArray = parsedData.trace.supply_graph.shipments[id].events.filter(function (element) {
            return element.multihash !== undefined;
        });
        console.log(chalk.green.bold('The public trace ' + id + ' have ' + filteredArray.length + ' events'))
        for (const element of filteredArray) {
            let url = `https://api.gotrace.world/v1/public/eventFile/${element.multihash}`
            try {
                response = await fetch(url)
            } catch (error) {
                console.log(chalk.red.bold(`The event file ${url} cannot be downloaded: ` + error))
            }
            let data = await response.text()
            fs.writeFileSync(`checkpoint_${element.multihash}.json`, data, function (err) {
                if (err) {
                    chalk.red.bold(`The public trace for ${element.multihash} cannot be saved: ` + err);
                }
            }
            );
        }
    }
}

module.exports = download