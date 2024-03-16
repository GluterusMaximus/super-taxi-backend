import axios from 'axios'
import { DEFAULT_CURRENCY } from '../constants/defaultCurrency.js'

async function convertCurrency(currency, sums) {
  if (!currency || currency === DEFAULT_CURRENCY) {
    return sums
  }

  const config = {
    redirect: 'follow',
    headers: {
      apikey: process.env.EXCHANGE_RATE_APIKEY,
    },
  }
  const {
    data: {
      info: { rate },
    },
  } = await axios.get(
    `${process.env.EXCHANGE_RATE_ENDPOINT}?to=${DEFAULT_CURRENCY}&from=${currency}&amount=1`,
    config,
  )

  return sums.map(s => s * rate)
}

export default convertCurrency
