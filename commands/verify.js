const axios = require('axios');
const chalk = require('chalk')
const fs = require('fs');
const crypto = require('crypto')
const bs58 = require('bs58')
const Web3 = require('web3');


const SHA256Prefix = '1220'
const inputs = [
    {
        "indexed": false,
        "name": "multihash",
        "type": "string"
    }
]


async function verify(id) {
    console.log(chalk.yellow(`Verifying a trace ${id}...`))
    let path = `${id}.json`
    if (!fs.existsSync(path)) {
        throw new Error('File is not found: ' + path + ' try to download it again')
    }
    let data = fs.readFileSync(path)
    parsedData = JSON.parse(data);
    if (parsedData.trace != null && parsedData.trace.supply_graph != null && parsedData.trace.supply_graph.shipments[id] != null) {
        filteredArray = parsedData.trace.supply_graph.shipments[id].events.filter(function (element) {
            return element.multihash !== undefined;
        });
        console.log(chalk.green.bold('The public trace ' + id + ' have ' + filteredArray.length + ' events'))
        for (const element of filteredArray) {
            let url = `https://api.gotrace.world/v1/public/eventFile/${element.multihash}`
            try {
                response = await axios.get(url, { responseType: 'arraybuffer' })
            } catch (error) {
                console.log(chalk.red.bold(`The event file ${url} cannot be downloaded: ` + error))
            }
            fs.writeFileSync(`${element.multihash}.json`, response.data, function (err) {
                if (err) {
                    chalk.red.bold(`The public trace for ${element.multihash} cannot be saved: ` + err);
                }
            }
            );
            const buff = fs.readFileSync(`${element.multihash}.json`);
            multihash = SHA256Prefix + crypto.createHash('sha256').update(buff).digest('hex')
            const bs58String = bs58.encode(Buffer.from(multihash, "hex"))
            let web3 = new Web3("https://rpc.gochain.io");
            receipt = await web3.eth.getTransactionReceipt(element.tx_hash);
            let result = web3.eth.abi.decodeLog(inputs, receipt.logs[0].data, receipt.logs[0].topics)
            if (result.multihash == bs58String) {
                console.log(chalk.green(`The public trace checkpoint ${element.multihash} is verified, hashes are the same, calculated hash: ${bs58String}, hash from the blockchain: ${result.multihash}, tx_id: ${element.tx_hash}`))
            } else {
                console.log(chalk.red.bold('The public trace checkpoint ' + element.multihash + ' is not verified, hashes are different'))
            }
        }
    } else {
        console.log(chalk.red.bold('The trace ' + id + ' is not verified'))
        throw new Error('Trace data is wrong, try to download it again')
    }

}

module.exports = verify