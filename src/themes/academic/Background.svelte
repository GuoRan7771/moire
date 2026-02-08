<div class="fixed inset-0 -z-10 pointer-events-none bg-[var(--bg-color)]">
    <!-- Fine Paper Grain -->
    <div class="absolute inset-0 opacity-[0.05] grain"></div>
    
    <!-- Subtle Fiber texture -->
    <div class="absolute inset-0 opacity-[0.03] fibers"></div>
</div>

<style>
    .grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainFilter)'/%3E%3C/svg%3E");
    }

    .fibers {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fiberFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fiberFilter)'/%3E%3C/svg%3E");
        mix-blend-mode: multiply;
    }
</style>
