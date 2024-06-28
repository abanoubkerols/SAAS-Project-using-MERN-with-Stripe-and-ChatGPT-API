const asyncHanler = require('express-async-handler')
const axios = require('axios')
const ContentHistory = require('../models/ContentHistory')
const User = require('../models/User')

const openAiControl = asyncHanler(async (req, res) => {
  const { prompt } = req.body
  try {
    const goResponse = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log(goResponse)
    const content = goResponse?.data?.choices[0].text?.trim()
    res.status(200).json(content)
    console.log(content)

    const newContent = ContentHistory.create({
      user: req.user._id,
      content
    })

    const userFound = await User.findById(req.user.id)
    userFound.history.push(newContent._id)

    userFound.apiRequestCount += 1

    await userFound.save()
  } catch (e) {
    throw new Error(e)
  }
})

module.exports = { openAiControl }
