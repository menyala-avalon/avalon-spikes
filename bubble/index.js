const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

async function main() {
    const bubblePrivateKey = process.env.PRIVATE_KEY
    const bubbleHost = process.env.BUBBLE_HOST
    const bubbleObjApi = `${bubbleHost}/api/1.1/obj`

    const checkInsPath = `${bubbleObjApi}/checkin`

    console.log(checkInsPath)
    try {
        const response = await axios.get(checkInsPath, {
            params: {
                api_token: bubblePrivateKey
            }
        })
        console.log(JSON.stringify(response.data, 0, 2))
    }  catch (e) {
        console.error(e.response.data)
    }
}

main()
