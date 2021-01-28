<template>
	<div class="wrapper">
		<div class="container">
			<div class="wallet">
				<div class="wallet__header">Ваш портфель</div>
				<div class="wallet__amount">
					Общая стоимость портфеля: 99999 $
				</div>
				<div class="wallet__crypto">
					<div class="wallet__row">
						Bitcoin (BTC): 10.7778
					</div>
					<div class="wallet__row">
						Ethereum (ETH): 99.15
					</div>
				</div>
				<div class="wallet__diagram">
					<CryptoPie
						v-if="loaded"
						:chartdata="chartData"
						:options="options"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import CryptoPie from "@/components/CryptoPie.vue"

export default Vue.extend({
	name: "Wallet",
	components: { CryptoPie },
	data() {
		return {
			loaded: true,
			chartData: {
				datasets: [
					{
						backgroundColor: ["red", "blue", "yellow"],
						data: [10, 20, 30],
					},
				],
				// These labels appear in the legend and in the tooltips when hovering different arcs
				labels: ["Red", "Yellow", "Blue"],
			},
			options: {
				datasetIndex: {},
				responsive: true,
				maintainAspectRatio: false,
			},
		}
	},
})
</script>
<style lang="sass" scoped>
.container
	min-height: 100vh
	width: 80%
	margin: 0 auto
	border-radius: 10px
	margin-top: 90px
	font-size: 16px
	display: flex
	align-items: center
	justify-content: center
.wallet
	min-height: 710px
	width: 500px
	border-radius: 5px
	background-color: #28D778
	color: #fff
	padding: 15px
	&__header
		font-size: 26px
		margin-bottom: 30px
	&__amount
		font-size: 22px
		margin-bottom: 20px
	&__row
		display: flex
		margin-bottom: 10px
	&__diagram
		position: relative
.input
	justify-self: center
	width: 140px
	color: #fff
	background-color: #333
	border-radius: 5px
.select
	cursor: pointer
	background-color: #333
	color: #fff
	border: none
	width: 200px
	outline: none
	border-radius: 5px
</style>
