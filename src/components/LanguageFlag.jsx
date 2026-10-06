export function LanguageFlag({ language }) {
  return <svg className="language__flag" viewBox="0 0 60 40" aria-hidden="true" focusable="false">
    {language === "ENG" && <>
      <path fill="#012169" d="M0 0h60v40H0z" />
      <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60" />
      <path stroke="#c8102e" strokeWidth="8" d="M30 0v40M0 20h60" />
    </>}
    {language === "PTBR" && <>
      <path fill="#009b3a" d="M0 0h60v40H0z" />
      <path fill="#ffdf00" d="m30 4 25 16-25 16L5 20z" />
      <circle fill="#002776" cx="30" cy="20" r="10" />
      <path fill="#fff" d="M20 18a28 28 0 0 1 20 5l-.7 2A27 27 0 0 0 20 20z" />
      <g fill="#fff"><circle cx="27" cy="24" r=".6" /><circle cx="32" cy="27" r=".6" /><circle cx="34" cy="23" r=".6" /><circle cx="33" cy="16" r=".6" /></g>
    </>}
    {language === "ES" && <>
      <path fill="#aa151b" d="M0 0h60v40H0z" />
      <path fill="#f1bf00" d="M0 10h60v20H0z" />
      <path fill="#aa151b" d="M16 17h8v8q-4 5-8 0z" />
      <path fill="#fff" d="M20 17h4v4h-4zm-4 4h4v4h-4z" />
      <path fill="#aa151b" d="m16 14 2 1 2-2 2 2 2-1v3h-8z" />
      <path stroke="#fff" strokeWidth="1.5" d="M13 18v9m14-9v9" />
    </>}
  </svg>;
}
