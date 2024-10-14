document.querySelectorAll('.section-d-dropdown-button').forEach((element) =>
  element.addEventListener('click', (event) => {
    const el = event.currentTarget
    const dropdownContent = document.getElementById(el.getAttribute('data-target'))
    const buttonIcon = document.getElementById(el.getAttribute('data-target') + '-chevron')
    dropdownContent.classList.toggle('border-opacity-0')
    if (dropdownContent.style.maxHeight) {
      dropdownContent.style.maxHeight = null
      dropdownContent.style.opacity = 0
    } else {
      dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px'
      dropdownContent.style.opacity = 1
    }
    buttonIcon.classList.toggle('mdi-chevron-down')
    buttonIcon.classList.toggle('mdi-chevron-up')
  })
)
document.querySelectorAll('.belegstelle-erläutert').forEach((element) =>
  element.addEventListener('click', (event) => {
    const el = event.currentTarget
    const targetEl = document.querySelector(el.getAttribute('data-target'))
    const clickTarget = document.querySelector(
      `[data-target=${targetEl.closest('.section-d-dropdown-content').getAttribute('id')}]`
    )
    const dropdownContent = document.getElementById(clickTarget.getAttribute('data-target'))
    targetEl.parentElement.addEventListener('animationend', () =>
      targetEl.parentElement.classList.remove('flash-yellow')
    )
    dropdownContent.addEventListener('transitionend', () =>
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    )
    if (!dropdownContent.style.maxHeight) {
      clickTarget.click()
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    targetEl.parentElement.classList.add('flash-yellow')
  })
)
document.querySelectorAll('.belegstelle-button').forEach((element) =>
  element.addEventListener('click', async (event) => {
    const el = event.currentTarget
    const sourceUrn = el.getAttribute('source-text')
    const sourceRef = el.getAttribute('source-verse')
    const collInfo = await $fetch(`/api/dts/collections`, {
      body: { id: sourceUrn },
      method: 'POST'
    })
    const langTexts = {}
    for (const member of collInfo.member) {
      const xslPath = () => {
        switch (true) {
          case member['@id'].includes('commentary'):
            return 'assets/source/commentary.sef.json'
          case member['@id'].includes('tlg0031'):
          case member['@id'].includes('tlg0527'):
          case member['@id'].includes('1henoch'):
            return 'assets/source/nt_fragment.sef.json'
          case member['@id'].includes('qumran'):
            return 'assets/source/qumran.sef.json'
          default:
            return 'assets/source/epidoc.sef.json'
        }
      }
      const processedResult = await $fetch('/api/dts/document', {
        body: { id: member['@id'], ref: sourceRef, xsl: xslPath() },
        method: 'POST'
      })

      if (!['eng', 'deu'].includes(member['dts:extensions']['dc:language'])) {
        langTexts['Original'] = processedResult
      } else {
        langTexts[member['dts:extensions']['dc:language']] = processedResult
      }
    }
    const dropdownContent = document.querySelector(el.getAttribute('data-target'))
    const tabRow = dropdownContent.querySelector('.tab')
    const langContents = dropdownContent.querySelector('.tabcontent')
    tabRow.innerHTML = ''
    langContents.innerHTML = ''
    for (const [key, value] of Object.entries(langTexts)) {
      const template = document.createElement('template')
      const contentTemplate = document.createElement('template')
      const active = key === 'Original' ? ' active' : ''
      const order = key === 'Original' ? ' order-1' : ' order-2'
      const langKey = key === 'eng' ? 'English' : key === 'deu' ? 'Deutsch' : 'Original'
      template.innerHTML = `<button class="tablinks border-sm flex-grow-1${active}${order}">${langKey}</button>`
      const result = template.content
      result.firstElementChild.addEventListener('click', (event) => {
        // const el = event.currentTarget
        // Get all elements with class="tabcontent" and hide them
        const tabcontent = document.getElementsByClassName('section-b-tabcontent')
        for (let i = 0; i < tabcontent.length; i++) {
          tabcontent[i].classList.add('d-none')
        }

        // Get all elements with class="tablinks" and remove the class "active"
        const tablinks = document.getElementsByClassName('tablinks')
        for (let i = 0; i < tablinks.length; i++) {
          tablinks[i].classList.remove('active')
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(`${sourceUrn}-${key}-section-b`).classList.remove('d-none')
        event.currentTarget.classList.add('active')
      })
      tabRow.append(result)
      const display = key === 'Original' ? '' : ' d-none'
      contentTemplate.innerHTML = `<div class="section-b-tabcontent${display}" id="${sourceUrn}-${key}-section-b">${value}</div>`
      langContents.append(contentTemplate.content)
    }
    const buttonIcon = document.getElementById(el.getAttribute('id') + '-chevron')
    dropdownContent.classList.toggle('border-opacity-0')
    if (dropdownContent.style.maxHeight) {
      dropdownContent.style.maxHeight = null
      dropdownContent.style.opacity = 0
    } else {
      dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px'
      dropdownContent.style.opacity = 1
    }
    buttonIcon.classList.toggle('mdi-chevron-down')
    buttonIcon.classList.toggle('mdi-chevron-up')
  })
)
