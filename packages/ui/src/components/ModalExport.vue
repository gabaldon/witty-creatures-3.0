<template>
  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"
      >
        <!-- Heroicon name: outline/exclamation -->
        <svg
          class="h-6 w-6 text-yellow-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Export information
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 mb-2">
            Copy the link to import your creature in another browser:
          </p>
          <p class="import-link text-xs text-gray-400">{{ importLink }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="copyToClipboard"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Copy to clipboard
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Close
    </button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { createImportLink } from '../services/exportInformation'
import { copyTextToClipboard } from '../services/copyToClipboard'
import { useStore } from '../stores/player'

export default defineComponent({
  setup (props, ctx) {
    const instance = getCurrentInstance()

    const importLink = createImportLink()
    const player = useStore()
    return {
      exportInfo () {
        instance.parent.emit('close')
      },
      importLink,
      async copyToClipboard () {
        await copyTextToClipboard(importLink)
        player.notify({ message: 'Copied', icon: 'none' })
      }
    }
  }
})
</script>

<style scoped>
.import-link {
  word-break: break-all;
  word-wrap: anywhere;
}
</style>
