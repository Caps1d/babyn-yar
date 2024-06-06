<script>
  import { PageHeader, Container, ContentCard } from '$components'

  const links = [
    {
      href: '/content/events',
      text: 'Події'
    },
    {
      href: '/content/library',
      text: 'Бібліотека'
    },
    {
      href: '/content/holocaust-documents',
      text: 'Документи Голокосту'
    },
    {
      href: '/content/victim-testimonies',
      text: 'Свідчення очевидців трагедії'
    }
  ]
</script>

<PageHeader>
  <svelte:fragment slot="heading">Контент</svelte:fragment>
</PageHeader>

<Container title="Контент">
  <ul class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
    {#each links as { href, text }}
      <ContentCard {href}>
        <svelte:fragment slot="title">{text}</svelte:fragment>
      </ContentCard>
    {/each}
  </ul>
</Container>
