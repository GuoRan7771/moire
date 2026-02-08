<script lang="ts">
  import {format} from 'date-fns';
  import {config} from '../../../moire.config';
  import {createMemoList} from '$lib/memo.svelte';
  import type {PageData} from '../../routes/$types';
  import {marked} from 'marked';

  let {data}: {data: PageData} = $props();
  const memoList = createMemoList(() => data, config);

  function handleMouseMove(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--x', `${x}px`);
    target.style.setProperty('--y', `${y}px`);
  }
</script>

<div class="min-h-screen py-8 max-w-3xl mx-auto {config.theme} font-sans">
  <header class="mx-auto mb-8 md:mb-16 px-4">
    <h1 class="mb-3 text-5xl font-bold tracking-tight text-slate-900/90">{config.title}</h1>
    <p class="max-w-2xl text-xl font-medium text-slate-500/80">{config.description}</p>
    
    {#if memoList.selectedTag}
      <div class="mt-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Filtering by:</span>
        <button
          onclick={() => memoList.selectTag(null)}
          class="flex items-center gap-2 rounded-full bg-slate-500/10 px-4 py-1.5 text-sm font-semibold italic text-slate-600 border border-slate-200/50 hover:bg-slate-500/20 transition-all group"
        >
          #{memoList.selectedTag}
          <span class="text-slate-600 group-hover:text-slate-800 transition-colors">✕</span>
        </button>
      </div>
    {/if}
  </header>

  <div class="mx-auto grid grid-cols-1 gap-6 px-4 2xl:grid-cols-2" data-selected-tag={memoList.selectedTag}>
    {#each memoList.visibleMemos as memo}
      <div
        class="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/40 bg-white/40 p-3 md:p-7 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        onmousemove={handleMouseMove}
        style="--x: 50%; --y: 50%;"
      >
        <div
          class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style="background: radial-gradient(800px circle at var(--x) var(--y), rgba(129, 110, 216, 0.06), transparent 50%);"
        ></div>
        <div class="relative z-10 flex h-full flex-col">
          <div
            class="mb-6 line-clamp-[12] text-[0.95rem] leading-relaxed tracking-wide
                   [&_h1]:text-[1.25rem] [&_h1]:font-black [&_h1]:mb-2 [&_h1]:mt-5 [&_h1]:text-slate-800
                   [&_h2]:text-[1.15rem]  [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-slate-800
                   [&_h3]:text-[1.05rem] [&_h3]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-slate-800
                   [&_h4]:text-[0.95rem] [&_h4]:font-bold [&_h4]:mb-1 [&_h4]:mt-2 [&_h4]:text-slate-800
                   [&_h5]:text-[0.85rem] [&_h5]:font-bold [&_h5]:italic [&_h5]:mb-1 [&_h5]:text-slate-800
                   [&_p]:my-2 [&_p]:text-slate-700
                   [&_a]:text-slate-400 [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_a]:hover:bg-slate-50
                   [&_strong]:text-slate-900
                   [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs
                   [&_th]:border-b-2 [&_th]:border-slate-200 [&_th]:border-dashed [&_th]:text-center [&_th]:py-1 [&_th]:font-semibold [&_th]:text-slate-700
                   [&_td]:py-1 [&_td]:px-1 [&_td]:border-b [&_td]:border-slate-100 [&_td]:border-dashed [&_td]:text-slate-600 [&_td]:text-center
                   [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[0.9rem] [&_blockquote]:bg-slate-50
                   [&_.tag-link]:rounded-full [&_.tag-link]:px-2 [&_.tag-link]:py-0.5 [&_.tag-link]:text-[10px] [&_.tag-link]:font-medium [&_.tag-link]:tracking-wide [&_.tag-link]:transition-all [&_.tag-link]:bg-slate-50 [&_.tag-link]:text-slate-400 [&_.tag-link]:border [&_.tag-link]:border-slate-100 [&_.tag-link:hover]:bg-slate-100 [&_.tag-link:hover]:text-slate-600 [&_.tag-link]:no-underline [&_.tag-link]:mx-0.5"
             onclick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('tag-link')) {
                    e.stopPropagation(); 
                    const tag = target.dataset.tag;
                    if (tag) memoList.selectTag(tag);
                }
             }}
          >
            {@html marked.parse(memo.content)}
          </div>

          <div
            class="mt-auto flex items-center justify-between pt-4 text-xs font-semibold tracking-wide text-slate-400/80 uppercase"
          >
            <span>{format(new Date(memo.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if memoList.visibleMemos.length < memoList.filteredMemos.length}
    <div class="mt-16 flex justify-center pb-16">
      <button
        onclick={memoList.loadMore}
        class="rounded-full bg-white/50 px-8 py-3 text-sm font-semibold text-slate-600 backdrop-blur-md transition-all hover:bg-white/80 hover:text-slate-900 hover:shadow-lg"
      >
        Load More
      </button>
    </div>
  {/if}
</div>

<style>
  :global(body.bento) {
    background-color: #f0f2f5;
    background-image: radial-gradient(at 0% 0%, rgba(200, 220, 255, 0.3) 0px, transparent 40%),
      radial-gradient(at 100% 0%, rgba(230, 200, 255, 0.3) 0px, transparent 40%),
      radial-gradient(at 100% 100%, rgba(200, 255, 240, 0.3) 0px, transparent 40%),
      radial-gradient(at 0% 100%, rgba(255, 230, 200, 0.3) 0px, transparent 40%);
    background-attachment: fixed;
  }

  [data-selected-tag] :global(.tag-link) {
      transition: all 0.2s ease;
  }

  /* When a tag is selected, dim other tags and highlight the active one */
  [data-selected-tag]:not([data-selected-tag="null"]) :global(.tag-link) {
      opacity: 0.5;
  }

  /* Use a trick with attribute selector to match the active tag */
  /* We need several of these if we want to support any tag name, but for a data-attribute matched exactly: */
  [data-selected-tag="Academic"] :global(.tag-link[data-tag="Academic"]),
  [data-selected-tag="Bento"] :global(.tag-link[data-tag="Bento"]),
  [data-selected-tag="Cyberpunk"] :global(.tag-link[data-tag="Cyberpunk"]),
  [data-selected-tag="Pixel"] :global(.tag-link[data-tag="Pixel"]),
  [data-selected-tag="Receipt"] :global(.tag-link[data-tag="Receipt"]),
  /* Generic selector that works for any tag if the attribute matches exactly */
  [data-selected-tag]:not([data-selected-tag="null"]) :global(.tag-link.active) {
      opacity: 1 !important;
      background-color: rgb(79, 70, 229, 0.1) !important;
      color: rgb(79, 70, 229) !important;
      border-color: rgb(79, 70, 229, 0.2) !important;
      font-weight: 700 !important;
  }
</style>
