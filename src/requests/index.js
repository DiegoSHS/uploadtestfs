
const postFileRequest = async (route, FormData) => {
    try {
        const res = await fetch(route, {
            method: 'POST',
            body: FormData
        })
        console.log(res)
        const data = await res.json()
        return data
    } catch (error) {
        return {
            error: { code: 500, message: `Error al realizar petición ${error.message}` }
        }
    }
}

export const sendFile = (file, route) => {
    return postFileRequest(`/api/${route}`, file)
}