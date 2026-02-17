<script lang="ts">
  import { slide } from 'svelte/transition';
  import { format } from 'date-fns';
  import type { PageData } from '../../routes/$types';
  import { createMemoList } from '$lib/memo.svelte';
  import Background from './Background.svelte';

  let { data, config }: { data: PageData; config: any } = $props();
  const memoList = createMemoList(() => data, config);

  $effect(() => {
    if (memoList.selectedTag) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
</script>

<div class="min-h-screen w-screen relative isolate {config.theme}">
  <div class="fixed inset-0 -z-10">
    <Background />
  </div>

  <div
    class="w-[96vw] md:w-[94vw] lg:w-[92vw] min-h-[96vh] mx-auto my-[2vh]
           bg-[var(--card-bg)]
           px-6 sm:px-10 md:px-12 lg:px-20
           pt-8 pb-10
           relative
           shadow-[0_0_10px_rgba(0,0,0,0.1)]
           drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)]
           rounded-md
           text-[var(--text-color)]"
  >
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
      <aside class="md:col-span-3 md:border-r border-[var(--text-color)]/10 md:pr-8 md:text-right">
        <header class="sticky top-10 md:h-[calc(100vh-2rem)]">
          <h1 class="text-4xl font-black italic mb-4 text-[var(--accent-color)] tracking-tight">
            {config.title}
          </h1>

          <div class="text-sm text-[var(--text-color)]/60 italic mb-8">
            <p>{config.description}</p>
            <p class="mt-4">— {config.author}</p>
          </div>

          {#if memoList.selectedTag}
            <div class="mb-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-color)]/40 mb-2">
                Filtered View
              </p>
              <button
                class="bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-3 py-1 rounded-full text-sm italic hover:bg-[var(--accent-color)]/20 transition-colors"
                onclick={() => memoList.selectTag(null)}
              >
                #{memoList.selectedTag} ✕
              </button>
            </div>
          {/if}

          <div class="hidden md:block">
            <p
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-color)]/40 mb-4 pb-2 border-b border-[var(--text-color)]/5 inline-block ml-auto"
            >
              Index
            </p>

            <ul class="text-sm space-y-3">
              {#each memoList.allTags as tag}
                <li class="list-none">
                  <button
                    class="hover:text-[var(--accent-color)] hover:underline decoration-[var(--accent-color)]/30 underline-offset-4 transition-colors {memoList.selectedTag === tag
                      ? 'text-[var(--accent-color)] font-bold'
                      : 'text-[var(--text-color)]/60'}"
                    onclick={() => memoList.selectTag(tag)}
                  >
                    #{tag}
                  </button>
                </li>
              {/each}
            </ul>
          </div>

          <p class="hidden md:block absolute bottom-6 text-xs opacity-60">
            © {new Date().getFullYear()} {config.author}, powered by
            <a href="https://moire.blog/" target="_blank" class="inline hover:underline">
              MOIRE.BLOG
            </a>
          </p>
        </header>
      </aside>

      <main class="md:col-span-9 space-y-16 max-w-2xl">
        {#each Object.entries(memoList.groupedMemos) as [dateKey, memos] (dateKey)}
          <section in:slide>
            <div class="flex items-baseline gap-4 mb-10 border-b border-[var(--text-color)] pb-3">
              <h2 class="text-3xl font-black italic tracking-tight">
                {format(new Date(dateKey + 'T00:00:00'), 'MMMM dd, yyyy')}
              </h2>
              <span class="text-sm text-[var(--text-color)]/40 italic font-medium">
                {format(new Date(dateKey + 'T00:00:00'), 'EEEE')}
              </span>
            </div>

            <div class="space-y-14">
              {#each memos as memo (memo.slug)}
                <article in:slide class="group relative" id={memo.slug}>
                  <div
                    class="absolute -left-20 top-2 hidden xl:block text-xs font-bold tracking-widest text-[var(--text-color)]/30 w-12 text-right uppercase"
                  >
                    {format(memo.date, 'HH:mm')}
                  </div>

                  <div class="xl:hidden text-sm font-bold tracking-widest text-[var(--text-color)]/30 mb-3 uppercase">
                    {format(memo.date, 'HH:mm')}
                  </div>

                  <div
                    class="max-w-none text-[var(--text-color)]/90
                      [&_h1]:text-[1.35rem] [&_h1]:font-bold [&_h1]:mb-5 [&_h1]:mt-7
                      [&_h2]:text-[1.25rem] [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-6
                      [&_h3]:text-[1.1rem] [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-5
                      [&_h4]:text-[1rem] [&_h4]:font-bold [&_h4]:mb-3 [&_h4]:mt-4
                      [&_h5]:text-[0.9rem] [&_h5]:font-bold [&_h5]:mb-2 [&_h5]:mt-3
                      [&_a]:text-[var(--accent-color)] [&_a]:border-b [&_a]:border-[var(--accent-color)]/30 [&_a]:hover:bg-[var(--accent-color)]/5 [&_a]:transition-all
                      [&_p]:my-4
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                      [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent-color)] [&_blockquote]:bg-[var(--accent-color)]/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:my-4 [&_blockquote]:rounded-r-sm
                      [&_img]:rounded-sm [&_img]:border-[6px] [&_img]:border-white [&_img]:rotate-1 group-hover:[&_img]:rotate-0 [&_img]:transition-all [&_img]:duration-700
                      [&_code]:bg-[var(--text-color)]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:font-mono
                      [&_pre]:bg-[var(--text-color)]/5 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border-l-4 [&_pre]:border-[var(--text-color)]/20
                      [&_.tag-link]:text-xs [&_.tag-link]:mx-1 [&_.tag-link]:uppercase [&_.tag-link]:tracking-wider [&_.tag-link]:text-[var(--text-color)]/30 [&_.tag-link:hover]:text-[var(--accent-color)] [&_.tag-link]:transition-colors"
                    onclick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.classList.contains('tag-link')) {
                        const tag = target.dataset.tag;
                        if (tag) memoList.selectTag(tag);
                      }
                    }}
                  >
                    {@html memo.content}
                  </div>
                </article>
              {/each}
            </div>
          </section>
        {/each}

        {#if memoList.visibleCount < memoList.filteredMemos.length}
          <div class="pt-12 text-center border-t border-[#333]/10">
            <button
              class="text-lg italic text-[#666] hover:text-[#d33682] transition-colors"
              onclick={memoList.loadMore}
            >
              ❧ Continue Reading...
            </button>
          </div>
        {/if}

        <footer class="mt-20 text-center text-sm text-[#999] italic pb-4">
          <p>— End of Manuscript —</p>
        </footer>
      </main>
    </div>
  </div>
</div>

<style>
  :global(body) {
    font-variant-ligatures: common-ligatures;
  }
</style>
