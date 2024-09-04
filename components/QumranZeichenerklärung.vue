<script setup>
const { t } = useI18n()
const items = [
  { example: '[א]', explanation: t('qumranZeichenerklärung.row1') },
  { example: '[--]', explanation: t('qumranZeichenerklärung.row2') },
  { example: '{א}', explanation: t('qumranZeichenerklärung.row3') },
  { example: '⟨א⟩', explanation: t('qumranZeichenerklärung.row4') },
  { example: '⟦ה⟧', explanation: t('qumranZeichenerklärung.row5') },
  { example: '«א»', explanation: t('qumranZeichenerklärung.row6') },
  { example: '+«א»+', explanation: t('qumranZeichenerklärung.row7') },
  { example: '○', explanation: t('qumranZeichenerklärung.row8') },
  { example: 'א֯', explanation: t('qumranZeichenerklärung.row9') },
  { example: 'א', explanation: t('qumranZeichenerklärung.row10') },
  { example: '⊢אב⊣', explanation: t('qumranZeichenerklärung.row11') },
  {
    example: 'א/ב',
    explanation: t('qumranZeichenerklärung.row12')
  },
  { example: '!א', explanation: t('qumranZeichenerklärung.row13') },
  { example: '___', explanation: t('qumranZeichenerklärung.row14') },
  { example: 'א/ח', explanation: t('qumranZeichenerklärung.row15') },
  { example: '(אם)', explanation: t('qumranZeichenerklärung.row16') },
  { example: '/ /', explanation: t('qumranZeichenerklärung.row17') },
  { example: '[a]', explanation: t('qumranZeichenerklärung.row18') },
  { example: '›', explanation: t('qumranZeichenerklärung.row19') },
  { example: '‹', explanation: t('qumranZeichenerklärung.row20') },
  { example: '=', explanation: t('qumranZeichenerklärung.row21') },
  { example: '≠', explanation: t('qumranZeichenerklärung.row22') },
  { example: '↓', explanation: t('qumranZeichenerklärung.row23') },
  { example: '→', explanation: t('qumranZeichenerklärung.row24') },
  {
    example: '*',
    explanation: t('qumranZeichenerklärung.row25')
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
              <td>{{ item.example }}</td>
              <td>{{ item.explanation }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
