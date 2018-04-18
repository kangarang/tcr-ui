import React from 'react'

// import { getLanguageSelection } from 'state/config/selectors'
// import configuredStore from 'state/store'

import Translate from './Translate'

const fallbackLanguage = 'en'
const repository = {}

const languages = [require('./lang/en.json')]

languages.forEach(l => {
  repository[l.code] = l.data
})

export function getTranslators() {
  return [
    'TranslatorName_1',
    'TranslatorName_2',
    'TranslatorName_3',
    'TranslatorName_4',
    'TranslatorName_5',
  ].filter(x => {
    const translated = translate(x)
    if (typeof translated === 'string') {
      return !!translated.trim()
    }
    return !!translated
  })
}

export default function translate(key, textOnly) {
  return textOnly ? translateRaw(key) : <Translate translationKey={key} />
}

export function translateRaw(key) {
  // const lang = getLanguageSelection(configuredStore.getState())
  const lang = 'en'

  return (repository[lang] && repository[lang][key]) || repository[fallbackLanguage][key] || key
}
