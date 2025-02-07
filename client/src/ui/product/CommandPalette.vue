<script setup lang="ts">
	import { ref } from 'vue';
	import GButton from '@ui/graph/button/GButton.vue';
	import CIcon from '@ui/core/Icon.vue';
	import GDialog from '@ui/core/GDialog.vue';
	import GWell from '@ui/graph/GWell.vue';
	import { nonNullGraph as graph } from '@graph/global';

	const showDialog = ref(false);

	const { nameToBindingKeys } = graph.value.shortcut;

	const convertKeyStringToKeys = (keyString: string) => {
		const keys = keyString
			.split('+')
			.map((key) => key.trim())
			.filter((key) => key !== '');
		return keys;
	};

	const redirect = (route: string) => {
		window.open(route, '_blank');
	};
</script>

<template>
	<GButton @click="showDialog = !showDialog">
		<CIcon icon="question_mark"></CIcon>
	</GButton>

	<GDialog v-model:visible="showDialog" header="Help">
		<GWell class="mb-6">
			<GButton
				@click="
					redirect('https://github.com/Yonava/magic-graphs/issues/new?template=Blank%20issue')
				"
				class="flex justify-center mb-1"
				secondary
			>
				<CIcon icon="bug_report"></CIcon>
				Find an Issue?
			</GButton>
			<GButton
				@click="redirect('https://github.com/Yonava/magic-graphs')"
				secondary
				class="flex justify-center"
			>
				<CIcon icon="star"></CIcon>
				Like the project? Give it a star!
			</GButton>
		</GWell>
		<h1 class="font-bold text-md">Commands</h1>
		<GWell class="flex-col w-[500px]">
			<div
				v-for="command in Object.keys(nameToBindingKeys)"
				:key="command"
				class="flex justify-between py-1 items-center"
			>
				{{ command }}
				<div class="flex-grow mx-2 border-[1px] border-dashed"></div>
				<div class="flex py-1">
					<GWell
						v-for="keyBinding in convertKeyStringToKeys(nameToBindingKeys[command])"
						:key="keyBinding"
						:class="['border-[1px]', 'rounded-md', 'px-2', 'mx-[1px]', 'text-[10px]']"
					>
						{{ keyBinding }}
					</GWell>
				</div>
			</div>
		</GWell>
	</GDialog>
</template>
