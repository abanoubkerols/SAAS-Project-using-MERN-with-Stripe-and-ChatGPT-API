import axios from "axios"

export const registerUser = async (usreData) => {
    const resGO = await axios.post('http://localhost:5000/api/v1/users/register', {
        email: usreData.email,
        password: usreData.password,
        username: usreData.username,
    }, {
        withCredentials: true
    })

    return resGO.data
}


export const loginUser = async (usreData) => {
    const resGO = await axios.post('http://localhost:5000/api/v1/users/login', {
        email: usreData.email,
        password: usreData.password,
     
    }, {
        withCredentials: true
    })

    return resGO.data
}


export const checkAuth = async () => {
    const resGO = await axios.get('http://localhost:5000/api/v1/users/auth/check', {
        withCredentials: true
    })

    return resGO.data
}


export const logout = async () => {
    const resGO = await axios.post('http://localhost:5000/api/v1/users/logout',{}, {
        withCredentials: true
    })

    return resGO.data
}





export const profile = async () => {
    const resGO = await axios.get('http://localhost:5000/api/v1/users/profile', {
        withCredentials: true
    })

    return resGO.data
}
