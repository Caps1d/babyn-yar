<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor, type JSONContent } from '@tiptap/core'
  import { extensions } from '$lib/editor-extensions'
  import {
    BoldIcon,
    PilcrowIcon,
    ListIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListOrderedIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    ImageIcon,
    VideoIcon,
    LinkIcon,
    UnlinkIcon,
    CornerDownLeftIcon
  } from 'lucide-svelte'
  import { AssetDialog, LinkDialog } from '$components'

  export let content: JSONContent

  let element: HTMLDivElement
  let editor: Editor
  let assetsDialog: AssetDialog
  let linkDialog: LinkDialog

  function selectAsset(e: CustomEvent<{ url: string; type: string }>) {
    const { url, type } = e.detail
    assetsDialog.close()
    if (type === 'image') {
      editor.commands.setImage({ src: url })
    } else {
      editor.commands.setVideo(url)
    }
  }

  type LinkProps = Parameters<typeof editor.commands.setLink>[0]

  function addLink(
    e: CustomEvent<{ type: 'email' | 'internal' | 'external'; value: string }>
  ) {
    linkDialog.close()
    const { value, type } = e.detail
    if (!value) return

    const linkProps: LinkProps = { href: '' }

    if (type === 'email') {
      linkProps.href = 'mailto:' + value
    } else if (type === 'external') {
      linkProps.href = value
      linkProps.target = '_blank'
    } else {
      linkProps.href = value
      linkProps.target = null
    }

    editor.chain().focus().setLink(linkProps).run()
  }

  onMount(() => {
    editor = new Editor({
      editorProps: {
        attributes: {
          class:
            'border p-4 rounded-br rounded-bl min-h-[300px] bg-white outline-none'
        }
      },
      element: element,
      extensions,
      content,
      onTransaction: () => {
        editor = editor
      },
      onUpdate: () => {
        content = editor.getJSON()
      }
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

<div>
  {#if editor}
    <div
      class="min-w-full overflow-x-auto rounded-tl rounded-tr border border-b-0 bg-white"
    >
      <div class="flex items-center gap-1 p-2">
        <button
          type="button"
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
          class:active={editor.isActive('heading', { level: 1 })}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <Heading1Icon size={16} />
        </button>
        <button
          type="button"
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()}
          class:active={editor.isActive('heading', { level: 2 })}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <Heading2Icon size={16} />
        </button>
        <button
          type="button"
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()}
          class:active={editor.isActive('heading', { level: 3 })}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <Heading3Icon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setParagraph().run()}
          class:active={editor.isActive('paragraph')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <PilcrowIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => linkDialog.open()}
          class:active={editor.isActive('link')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <LinkIcon size={16} />
        </button>
        {#if editor.isActive('link')}
          <button
            type="button"
            on:click={() => editor.chain().focus().unsetLink().run()}
            class="rounded p-1.5 hover:bg-gray-100"
          >
            <UnlinkIcon size={16} />
          </button>
        {/if}
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          class:active={editor.isActive('bulletList')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <ListIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          class:active={editor.isActive('orderedList')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <ListOrderedIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleBold().run()}
          class:active={editor.isActive('bold')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <BoldIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleItalic().run()}
          class:active={editor.isActive('italic')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <ItalicIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleUnderline().run()}
          class:active={editor.isActive('underline')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleStrike().run()}
          class:active={editor.isActive('strike')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <StrikethroughIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('left').run()}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <AlignLeftIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('center').run()}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <AlignCenterIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('right').run()}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <AlignRightIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setHardBreak().run()}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <CornerDownLeftIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <button
          type="button"
          on:click={() => assetsDialog.open('image')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => assetsDialog.open('video')}
          class="rounded p-1.5 hover:bg-gray-100"
        >
          <VideoIcon size={16} />
        </button>
      </div>
    </div>
  {/if}
  <div bind:this={element} />
</div>

<AssetDialog bind:this={assetsDialog} on:select={selectAsset} />

<LinkDialog bind:this={linkDialog} on:done={addLink} />

<style lang="postcss">
  .active {
    @apply bg-gray-100;
  }
</style>
