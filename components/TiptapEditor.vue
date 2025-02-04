<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: 'Input your text' },
  tools: { type: Array<string>, required: true },
  text: { type: String, required: true },
  lang: { type: String, required: true }
})
defineEmits(['save'])

const editor = useEditor({
  content: props.text,
  extensions: [TiptapStarterKit]
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <div>
    <div class="text-h5">{{ props.title }}</div>
    <div v-if="editor">
      <v-btn
        v-if="props.tools.includes('bold')"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        density="compact"
        size="small"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <span class="font-weight-bold">{{ $t('tipTap.boldSymbol') }}</span>
        <v-tooltip activator="parent" location="top">{{ $t('tipTap.bold') }}</v-tooltip>
      </v-btn>
      <v-btn
        v-if="props.tools.includes('italic')"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        density="compact"
        size="small"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <span class="font-italic font-weight-bold">{{ $t('tipTap.italicSymbol') }}</span>
        <v-tooltip activator="parent" location="top">{{ $t('tipTap.italic') }}</v-tooltip>
      </v-btn>
      <v-btn
        v-if="props.tools.includes('undo')"
        :disabled="!editor.can().chain().focus().undo().run()"
        density="compact"
        size="small"
        @click="editor.chain().focus().undo().run()"
      >
        <v-icon icon="mdi-undo" />
        <v-tooltip activator="parent" location="top">{{ $t('tipTap.undo') }}</v-tooltip>
      </v-btn>
      <v-btn
        v-if="props.tools.includes('redo')"
        :disabled="!editor.can().chain().focus().redo().run()"
        density="compact"
        size="small"
        @click="editor.chain().focus().redo().run()"
      >
        <v-icon icon="mdi-redo" />
        <v-tooltip activator="parent" location="top">{{ $t('tipTap.redo') }}</v-tooltip>
      </v-btn>
    </div>
    <TiptapEditorContent class="border-sm" :editor="editor" />
    <div>
      <v-btn @click="$emit('save', editor?.getJSON(), props.lang)">{{ $t('tipTap.save') }}</v-btn>
    </div>
  </div>
</template>
