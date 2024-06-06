<div
  class="fixed z-10 mt-14 h-20 w-full border-b bg-white shadow-sm md:mt-0 md:w-[calc(100%-80px)] lg:w-[calc(100%-280px)]"
>
  <div class="flex h-full items-center justify-between px-3 md:px-6 lg:px-10">
    <h1 class="text-2xl font-semibold">
      <slot name="heading" />
    </h1>
    <slot name="right-items" />
  </div>
</div>
