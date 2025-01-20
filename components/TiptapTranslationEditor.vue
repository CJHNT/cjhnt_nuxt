<script setup>
const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [TiptapStarterKit]
})

async function saveFile() {
  const { data: fileSaved } = await useFetch('/api/admin/writeFile', {
    method: 'post',
    body: {
      text: editor.value.getHTML()
    }
  })
  console.error(fileSaved.value)
}

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>

<template>
  <div>
    <div v-if="editor">
      <v-btn
        :class="{ 'is-active': editor.isActive('paragraph') }"
        @click="editor.chain().focus().setParagraph().run()"
      >
        paragraph
      </v-btn>
      <v-btn
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        undo
      </v-btn>
      <v-btn
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
      >
        redo
      </v-btn>
    </div>
    <TiptapEditorContent :editor="editor" />
    <div>
      <v-btn @click="saveFile">Save</v-btn>
    </div>
  </div>
</template>
