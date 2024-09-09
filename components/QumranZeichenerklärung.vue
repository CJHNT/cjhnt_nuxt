<script setup>
const items = [
  { example: '[א]', explanation: 'qumranZeichenerklärung.row1' },
  { example: '[--]', explanation: 'qumranZeichenerklärung.row2' },
  { example: '{א}', explanation: 'qumranZeichenerklärung.row3' },
  { example: '⟨א⟩', explanation: 'qumranZeichenerklärung.row4' },
  { example: '⟦ה⟧', explanation: 'qumranZeichenerklärung.row5' },
  { example: '«א»', explanation: 'qumranZeichenerklärung.row6' },
  { example: '+«א»+', explanation: 'qumranZeichenerklärung.row7' },
  { example: '○', explanation: 'qumranZeichenerklärung.row8' },
  { example: 'א֯', explanation: 'qumranZeichenerklärung.row9' },
  { example: 'א', explanation: 'qumranZeichenerklärung.row10' },
  { example: '⊢אב⊣', explanation: 'qumranZeichenerklärung.row11' },
  {
    example: 'א/ב',
    explanation: 'qumranZeichenerklärung.row12'
  },
  { example: '!א', explanation: 'qumranZeichenerklärung.row13' },
  { example: '___', explanation: 'qumranZeichenerklärung.row14' },
  { example: 'א/ח', explanation: 'qumranZeichenerklärung.row15' },
  { example: '(אם)', explanation: 'qumranZeichenerklärung.row16' },
  { example: '/ /', explanation: 'qumranZeichenerklärung.row17' },
  { example: '[a]', explanation: 'qumranZeichenerklärung.row18' },
  { example: '›', explanation: 'qumranZeichenerklärung.row19' },
  { example: '‹', explanation: 'qumranZeichenerklärung.row20' },
  { example: '=', explanation: 'qumranZeichenerklärung.row21' },
  { example: '≠', explanation: 'qumranZeichenerklärung.row22' },
  { example: '↓', explanation: 'qumranZeichenerklärung.row23' },
  { example: '→', explanation: 'qumranZeichenerklärung.row24' },
  {
    example: '*',
    explanation: 'qumranZeichenerklärung.row25'
  }
]
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t('qumranZeichenerklärung.title') }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table density="compact" height="50vh">
          <tbody>
            <tr v-for="item in items" :key="item.name">
              <td>{{ $t(item.example) }}</td>
              <td>{{ $t(item.explanation) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
