function Box() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Box">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Box">
          <circle cx="8" cy="8" fill="var(--fill-0, white)" fillOpacity="0.32" id="Container" r="7.5" stroke="var(--stroke-0, #BFBFBF)" />
        </g>
      </svg>
    </div>
  );
}

function BoxLabel() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Box+Label">
      <Box />
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[16px] max-w-[372px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[16px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Label
      </p>
    </div>
  );
}

export default function ClbRadioButtonAtualizado() {
  return (
    <button className="content-stretch cursor-pointer flex flex-col items-start relative size-full" data-name="CLB-Radio Button [ATUALIZADO]">
      <div className="content-stretch flex flex-col gap-[8px] items-start max-w-[400px] relative shrink-0" data-name="_Radio-button-base">
        <BoxLabel />
      </div>
    </button>
  );
}