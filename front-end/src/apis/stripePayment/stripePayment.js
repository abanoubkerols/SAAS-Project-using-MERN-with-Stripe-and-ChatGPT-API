import axios from "axios"

export const freeSub = async (prompt  ) => {
    const resGO = await axios.post('http://localhost:5000/api/v1/stripe/freeplan', {},{
        withCredentials: true
    })

    return resGO.data
}


export const createStripePaymentIntentApi = async (payment  ) => {
    const resGO = await axios.post('localhost:5000/api/v1/stripe/checkout', {
        amount : +payment.amount,
        subscriptionPlan:payment.plan
    },{
        withCredentials: true
    })

    return resGO.data
}



export const payment = async (payment  ) => {
    const resGO = await axios.post(`localhost:3000/api/v1/stripe/verifypayment/${payment}`, {
     
    },{
        withCredentials: true
    })

    return resGO.data
}
