function toggleDropdown(event) {
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
}

async function openTarget(event) {
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
}

function belegLanguage(event, textId) {
  // Declare all variables
  var i, tabcontent, tablinks

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName('section-b-tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.add('d-none')
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active')
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(textId).classList.remove('d-none')
  event.currentTarget.classList.add('active')
}
