import formidable from "formidable"
import { unlink, createReadStream, readFile, writeFile } from "fs"

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '50000mb',
    }
}
export default async function (req, res) {
    return new Promise(async (resolve, _) => {
        try {
            const form = formidable({ keepExtensions: true })
            form.parse(req, async (err, fields, {files}) => {
                const formData = new FormData()
                try {
                    for (let key in files) {
                        //const fileReadStream = createReadStream(files[key].filepath)
                        readFile(files[key].filepath, (err, data) => {
                            console.log(files[key].filepath)
                            writeFile(`./public/uploads/${files[key].originalFilename}`, data,()=>{})
                            formData.append('file', new Blob([data], { type: 'appicaiton/octet-stream' }), files[key].originalFilename)
                            console.log(formData)
                        })
                    }
                    resolve()
                } catch (error) {
                    res.status(error.status || 500).json(error.data || {})
                    resolve()
                } finally {
                    for (let key in files) {
                        const filePath = files[key].path || files[key].filepath
                        if (filePath) {
                            unlink(filePath, (err) => {
                                if (err) throw err
                                // If no error, the file has been deleted successfully
                            })
                        }
                    }
                }
            })
        } catch (error) {
            res.status(401).json({})
            resolve()
        }
    })
}