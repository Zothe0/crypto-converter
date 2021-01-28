interface ICryptoRate {
	ethereum: {
		usd: number
	}
	bitcoin: {
		usd: number
	}
}
export default async function(crypto: string): Promise<ICryptoRate> {
	const response = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
	)
	return response.json()
}
