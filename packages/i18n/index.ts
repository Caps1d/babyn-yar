export const languages = {
  en: 'EN',
  uk: 'UA'
}

export const defaultLang = 'uk'

export const ui = {
  en: {
    'site.title': ' National Historical and Memorial Reserve "Babyn Yar"',
    'page.events.title': 'Events',
    'page.events.description': 'Browse all events',
    'nav.title': 'Babyn Yar',
    'nav.visit': 'visit',
    'nav.visit.events': 'events',
    'nav.education': 'education',
    'nav.education.history': 'history',
    'nav.education.map': 'map of Holocaust',
    'nav.education.archive': 'archive',
    'nav.connect': 'connect',
    'nav.connect.find-us': 'find us',
    'nav.support': 'support',
    'nav.support.partnership': 'partnership',
    'footer.main': 'National Historical and Memorial Reserve "Babyn Yar"',
    'footer.address': 'Ukraine, 04119  Kyiv, st. Yuriy  Ilyenka, 44',
    'footer.office': 'Office: 48B Melnykova str, Kyiv, 04119',
    'contact.form.surname': 'Surname',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message text',
    'contact.form.button': 'Send',
    'contact.address':
      'National Historical and Memorial Reserve "Babyn Yar" 44 Yuria Illienka Street, Kyiv, 04119 Ukraine',
    'contact.office': 'Office: 48-b Melnykova Street, Kyiv, 04119',
    'map.legend.active': 'Active Synagogue',
    'map.legend.inactive': 'Inactive Synagogue',
    'map.legend.memorial': 'Memorial',
    'map.legend.execution': 'Place of mass executions'
  },
  uk: {
    'site.title': 'Національний історико-меморіальний заповідник "Бабин Яр"',
    'page.events.title': 'Події',
    'page.events.description': 'Переглянути усі події',
    'nav.title': 'Бабин Яр',
    'nav.visit': 'відвідати',
    'nav.visit.events': 'події',
    'nav.education': 'освіта',
    'nav.education.history': 'історія',
    'nav.education.map': 'мапа Голокосту',
    'nav.education.archive': 'архів',
    'nav.connect': "зв'язок",
    'nav.connect.find-us': 'знайти нас',
    'nav.support': 'підтримати',
    'nav.support.partnership': 'партнерство',
    'footer.main': 'Національний історико-меморіальний заповідник "Бабин Яр"',
    'footer.address': 'Україна, 04119  м. Київ, вул. Юрія  Іллєнка, 44',
    'footer.office': 'Офіс: 04119, м. Київ, вул. Мельникова, 48-б',
    'contact.form.surname': 'Прізвище',
    'contact.form.name': "Ім'я",
    'contact.form.email': 'Email',
    'contact.form.message': 'Текст повідомлення',
    'contact.form.button': 'Надіслати',
    'contact.address':
      'Національний історико-меморіальний заповідник «Бабин Яр» Україна,04119 м. Київ, вул. Юрія Іллєнка, 44',
    'contact.office': 'Офіс: 04119 Київ, вул. Мельникова, 48-б',
    'map.legend.active': 'Діюча Синагога ',
    'map.legend.inactive': 'Недіюча Синагога',
    'map.legend.memorial': 'Меморіал',
    'map.legend.execution': 'Місце масового вбивства'
  }
} as const

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}
