import { IncomingForm } from "formidable"
import { readFile, unlink, writeFile } from "fs/promises"

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '50000mb',
    }
}

const formidableParse = async (req) =>
    new Promise((resolve, reject) =>
        new IncomingForm().parse(req, (err, fields, files) => err ? reject(err) : resolve([fields, files]))
    )

async function readAndWriteFile({ originalFilename, filepath }, newPath) {
    try {
        const path = `${newPath}/${originalFilename}`
        const data = await readFile(filepath)
        await writeFile(path, data)
        const formData = new FormData()
        formData.append('file', new Blob([data], { type: 'appicaiton/octet-stream' }), originalFilename)
        console.log(formData)
        return 'ok'
    } catch (error) {
        console.log(error.message)
        return 'error'
    }
}

export default async function (req, res) {
    const [_, { files }] = await formidableParse(req)
    console.log(files)
    const passwords = files.map(async file => readAndWriteFile(file, './public/uploads'))
    const results = await Promise.allSettled(passwords)
    const values = results.map(({ value }) => value)
    if (values.length === 0) {
        return res.status(200).json({ error: { code: 200, message: 'Intentalo de nuevo' } })
    }
    if (results.every(({ status }) => status === 'fulfilled')) {
        return res.status(200).json(values[0])
    } else {
        return res.status(408).json({ error: { code: 408, message: 'Tardó demasiado la respuesta' } })
    }
}