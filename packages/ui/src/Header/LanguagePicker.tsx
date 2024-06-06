import { languages } from 'i18n'

interface LanguagePickerProps {
  lang: keyof typeof languages
}

const sites = {
  uk: 'https://babynyar.gov.ua/',
  en: 'https://babynyar.org.ua/'
} satisfies typeof languages

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label className="relative w-fit text-center text-lg uppercase md:w-32">
      <select
        className="mx-1 flex-1 appearance-none rounded bg-white px-0.5 md:mx-4 md:px-1"
        value={lang}
        onChange={e => {
          window.location.href = sites[e.target.value as keyof typeof languages]
        }}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={name} value={code} className="normal-case">
            {name}&nbsp;&nbsp;
          </option>
        ))}
      </select>
    </label>
  )
}
