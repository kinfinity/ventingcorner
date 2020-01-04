  import config from '../utils/config'
import winstonLogger from '../utils/winstonLogger'
const { google } = require('googleapis')


const CLIENT_ID = config.googleClientID
const CLIENT_SECRET = config.googleClientSecret
const REDIRECT_URL = config.googleClientRedirect

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
// Generate an OAuth URL and redirect there
const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/gmail.readonly'
})

// Return Google User
const googleAuth = () => {  

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err)
        const labels = res.data.labels
        if (labels.length) {
            console.log('Labels:')
            labels.forEach((label) => {
                console.log(`- ${label.name}`)
            })
        } else {  
            console.log('No labels found')
        }
    })

}

const getAccessToken = (code) => {

    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                winstonLogger.error('Error authenticating')
                winstonLogger.error(err)
            } else {
                winstonLogger.info('Tokens: ')
                winstonLogger.info(tokens)
                oAuth2Client.setCredentials(tokens)
            }
        })
    }

}

// Pack
const _3rdPartyAuth = {
    googleAuth,
    getAccessToken
}

export default _3rdPartyAuth