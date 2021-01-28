import Vue from 'vue'
import Vuex from 'vuex'
import getCurRate from '@/api/getCurRate';

Vue.use(Vuex)
interface IState {
	bitcoinValue: number
	ethereumValue: number
}
export default new Vuex.Store<IState>({
	state: {
		bitcoinValue: 0,
		ethereumValue: 0,
	},
	mutations: {
		changeBitcoinValue(state, newValue) {
			state.bitcoinValue = newValue
		},
		changeEthereumValue(state, newValue) {
			state.ethereumValue = newValue
		},
	},
	actions: {
		async changeBitcoinValue(context) {
			const rate = await getCurRate("bitcoin")
			context.commit("changeBitcoinValue", rate.bitcoin.usd)
		},
		async changeEthereumValue(context) {
			const rate = await getCurRate("ethereum")
			context.commit("changeEthereumValue", rate.ethereum.usd)
		},
	},
	modules: {},
})
