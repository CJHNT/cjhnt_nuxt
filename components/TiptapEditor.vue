<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Input your text' },
  tools: { type: Array<string>, required: true },
  text: { type: String, required: true }
})

const editor = useEditor({
  content: props.text,
  extensions: [TiptapStarterKit]
})

async function saveFile() {
  if (editor.value) {
    await useFetch('/api/admin/writeFile', {
      method: 'post',
      body: {
        text: editor.value.getHTML()
      }
    })
  }
}

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <div>
    <div class="text-h5">{{ props.title }}</div>
    <div v-if="editor">
      <v-btn
        v-if="props.tools.includes('paragraph')"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        density="compact"
        size="small"
        @click="editor.chain().focus().setParagraph().run()"
      >
        ¶
        <v-tooltip activator="parent" location="top">Insert paragraph</v-tooltip>
      </v-btn>
      <v-btn
        v-if="props.tools.includes('undo')"
        :disabled="!editor.can().chain().focus().undo().run()"
        density="compact"
        size="small"
        @click="editor.chain().focus().undo().run()"
      >
        <v-icon icon="mdi-undo" />
        <v-tooltip activator="parent" location="top">Undo</v-tooltip>
      </v-btn>
      <v-btn
        v-if="props.tools.includes('redo')"
        :disabled="!editor.can().chain().focus().redo().run()"
        density="compact"
        size="small"
        @click="editor.chain().focus().redo().run()"
      >
        <v-icon icon="mdi-redo" />
        <v-tooltip activator="parent" location="top">Redo</v-tooltip>
      </v-btn>
    </div>
    <TiptapEditorContent class="border-sm" :editor="editor" />
    <div>
      <v-btn @click="saveFile">Save</v-btn>
    </div>
  </div>
</template>
