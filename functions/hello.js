exports.handler = async event => {
  try {
    const data = JSON.parse(event.body)

    await sendThankYouEmail(data)

    if (data.receiveUpdates) {
      await saveUser(data)
    }
    // send a thank you email
    // sign person

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Let's become serverless conductors!!!"
      })
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: e.mssage
    }
  }
}
