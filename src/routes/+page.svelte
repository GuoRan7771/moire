<script lang="ts">
    import type { PageData } from './$types';
    import { config } from '../../moire.config';
    import Theme from '$theme/index.svelte';

    let { data }: { data: PageData } = $props();
</script>

<Theme {data} {config} />
