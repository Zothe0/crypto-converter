<template>
	<div class="nav">
		<router-link to="/" class="nav__link">Конвертер</router-link>
		<router-link to="/wallet" class="nav__link">Кошелёк</router-link>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "Home",
})
</script>
<style lang="sass" scoped>
.nav
	z-index: 10
	position: fixed
	width: 100%
	height: 60px
	display: flex
	justify-content: center
	align-items: center
	background-color: #28D778
	color: #fff
	font-size: 28px
	&__link
		margin-right: 40px
		&:hover
			color: #a1fcca
		&:last-child
			margin-right: 0
</style>
