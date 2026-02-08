<script lang="ts">
    import { spring } from 'svelte/motion';

    let coords = spring({ x: 50, y: 50 }, {
        stiffness: 0.05,
        damping: 0.25
    });

    function handleMouseMove(event: MouseEvent) {
        const nx = (event.clientX / window.innerWidth) * 2 - 1;
        const ny = (event.clientY / window.innerHeight) * 2 - 1;
        coords.set({ x: 50 + nx * 8, y: 50 + ny * 8 });
    }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="fixed inset-0 -z-10 overflow-hidden bg-[#e8e8e8]">
    <!-- Doodle pattern layer -->
    <div class="doodle-pattern absolute inset-0 opacity-[0.08]"></div>
    
    <!-- Subtle gradient for depth -->
    <div 
        class="gradient-overlay absolute -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] opacity-15 mix-blend-multiply pointer-events-none"
        style="top: {$coords.y}%; left: {$coords.x}%;"
    ></div>
    
    <!-- Fine noise texture -->
    <div class="noise absolute inset-0 opacity-[0.04] pointer-events-none"></div>
</div>

<style>
    @keyframes float {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-20px); }
    }

    .gradient-overlay {
        background: radial-gradient(circle, rgba(120,120,120,0) 0%, rgba(100,100,100,0.25) 35%, rgba(80,80,80,0.45) 100%);
        animation: float 30s ease-in-out infinite;
        filter: blur(60px);
    }
    
    .doodle-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E .icon %7B fill: none; stroke: %23000; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; %7D %3C/style%3E%3C/defs%3E%3Cg opacity='0.4'%3E%3C!-- Coffee cup --%3E%3Cpath class='icon' d='M15,25 Q15,20 20,20 L35,20 Q40,20 40,25 L40,40 Q40,50 30,50 L25,50 Q15,50 15,40 Z'/%3E%3Cpath class='icon' d='M40,28 L45,28 Q50,28 50,33 Q50,38 45,38 L40,38'/%3E%3Cpath class='icon' d='M20,15 Q25,10 30,15' stroke-dasharray='2,2'/%3E%3C!-- Star --%3E%3Cpath class='icon' d='M165,30 L167,36 L173,36 L168,40 L170,46 L165,42 L160,46 L162,40 L157,36 L163,36 Z'/%3E%3C!-- Heart --%3E%3Cpath class='icon' d='M100,85 Q95,75 85,75 Q75,75 75,85 Q75,95 85,100 L100,110 L115,100 Q125,95 125,85 Q125,75 115,75 Q105,75 100,85 Z'/%3E%3C!-- Checkmark --%3E%3Cpath class='icon' d='M58,165 L63,172 L75,155' stroke-width='2'/%3E%3C!-- Shopping bag --%3E%3Cpath class='icon' d='M130,150 L135,175 L160,175 L165,150 M140,150 Q140,142 147.5,142 Q155,142 155,150'/%3E%3C!-- Note/memo --%3E%3Cpath class='icon' d='M15,135 L40,135 L40,170 L15,170 Z'/%3E%3Cline class='icon' x1='20' y1='145' x2='35' y2='145'/%3E%3Cline class='icon' x1='20' y1='152' x2='35' y2='152'/%3E%3Cline class='icon' x1='20' y1='159' x2='30' y2='159'/%3E%3C!-- Dollar sign --%3E%3Cpath class='icon' d='M185,155 Q175,155 175,162 Q175,169 185,169 Q195,169 195,176 Q195,183 185,183 M180,155 L180,150 M180,183 L180,188'/%3E%3C!-- Arrow --%3E%3Cpath class='icon' d='M125,30 L135,30 M135,30 L130,25 M135,30 L130,35'/%3E%3C!-- Dots pattern --%3E%3Ccircle class='icon' cx='95' cy='25' r='1.5' fill='%23000'/%3E%3Ccircle class='icon' cx='105' cy='30' r='1.5' fill='%23000'/%3E%3Ccircle class='icon' cx='95' cy='35' r='1.5' fill='%23000'/%3E%3C!-- Plus signs --%3E%3Cpath class='icon' d='M50,85 L50,95 M45,90 L55,90' stroke-width='1'/%3E%3Cpath class='icon' d='M180,95 L180,105 M175,100 L185,100' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
        background-size: 200px 200px;
        background-repeat: repeat;
    }
    
    .noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
</style>
