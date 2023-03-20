#! /usr/bin/env node
const { program } = require('commander')
const verify = require('./commands/verify')
const download = require('./commands/download')
const chalk = require('chalk')


program
  .command('verify <task>')
  .description('Verify a dowloaded public trace')
  .action(function (task) {
    return verify(task)
      .then(function () {
        console.log(chalk.green.bold('Successfully verified a public trace'))
        process.exit(0)
      })
      .catch(function (error) {
        console.log(chalk.red.bold('Verification failed:', error))
      })
  })

program
  .command('download <id>')
  .description('Download a public trace')
  .action(function (id) {
    return download(id)
      .then(function () {
        console.log(
          chalk.green.bold('The public trace ' + id + ' have been downloaded')
        )
        process.exit(0)
      })
      .catch(function (error) {
        console.log(
          chalk.red.bold('Failed to download ' + id + ' error: ' + error)
        )
      })
  })

program.parse()