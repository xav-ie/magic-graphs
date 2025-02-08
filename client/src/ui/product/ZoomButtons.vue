<script setup lang="ts">
	import GToolbarButton from '@ui/graph/toolbar/GToolbarButton.vue';
	import GToolbarBase from '@ui/graph/toolbar/GToolbarBase.vue';
	import ToolbarButtonGroup from '@ui/core/toolbar/ToolbarButtonGroup.vue';
</script>

<template>
	<GToolbarBase>
		<ToolbarButtonGroup>
			<GToolbarButton icon="add"></GToolbarButton>
			<p class="text-sm">100%</p>
			<!-- text above not colored -->
			<GToolbarButton icon="remove"></GToolbarButton>
		</ToolbarButtonGroup>
	</GToolbarBase>
</template>
