import axios from "axios"

export const chatGptApi = async (prompt  ) => {
    const resGO = await axios.post('http://localhost:5000/api/v1/openai/generate', {
        prompt
    },{
        withCredentials: true
    })

    return resGO.data
}
