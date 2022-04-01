<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcomeVue from './components/TheWelcome.vue';
</script>

<template>
	<header>
		<!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
		<div class="logo-box">
			<img class="logo" alt="Electron logo" style="height:140px;" src="./assets/electron.png" >
			<span/>
			<img class="logo" alt="Vite logo" style="height:140px;" src="./assets/vite.svg" >
			<span/>
			<img class="logo" alt="Vue logo" style="height:140px;" src="./assets/vue.png" >
			<span/>
			<img class="logo" alt="TypeScript logo" style="height:140px;" src="./assets/ts.svg" >
		</div>
		<div class="wrapper">
			<HelloWorld msg="You did it!" />

			<nav>
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/about">About</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

<style>
