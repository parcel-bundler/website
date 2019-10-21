const core = require('@actions/core')
const path = require('path')
const { createDeployment } = require('now-client')
const { readdir } = require('fs')

try {
  readdir(`${__dirname}/dist`, (err, locales) => {
    console.log({ locales })
    if (err) throw new Error(err)
    let start = Date.now()
    Promise.all(
      locales.map(async locale => {
        let sitePath = path.join(__dirname, locale)
        console.log({ sitePath })
        console.log(`deploying ... ${locale}`)
        try {
          let deployment = await deploy(sitePath)
          console.log({ [locale]: deployment })
          return deployment
        } catch (e) {
          throw new Error(e)
        }
      })
    )
      .then(deployments => {
        let time = Date.now() - start
        core.setOutput('total-deployment-time')
      })
      .catch(console.error)
  })
} catch ({ message }) {
  core.setFailed(message)
}

async function deploy(sitePath) {
  console.log(`${sitePath}`)
  let deployment
  for await (const event of createDeployment(sitePath, {
    token: process.env.NOW_TOKEN
  })) {
    if (event.type === 'ready') {
      deployment = event.payload
      break
    } else {
      console.log({ event })
    }
  }
  return deployment
}
