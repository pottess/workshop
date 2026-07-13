function InputLabel() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[4px] isolate items-end leading-[16px] relative shrink-0 whitespace-nowrap" data-name="Input-Label">
      <p className="font-['IBM_Plex_Sans:Medium',sans-serif] font-medium overflow-hidden relative shrink-0 text-[#0e0e0e] text-[16px] text-ellipsis z-[3]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Input Text
      </p>
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#292929] text-[14px] text-ellipsis z-[2]" style={{ fontVariationSettings: '"wdth" 100' }}>
        (required)
      </p>
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-[rgba(255,255,255,0.32)] h-[48px] max-h-[48px] relative rounded-[2px] shrink-0 w-full" data-name="Input-Field">
      <div aria-hidden className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center max-h-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-center max-h-[inherit] px-[16px] relative size-full">
          <p className="[word-break:break-word] flex-[1_0_0] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[16px] min-w-px overflow-hidden relative text-[#666] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
            Placeholder
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ClbInputTextReact() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="CLB-Input Text [REACT]">
      <InputLabel />
      <InputField />
    </div>
  );
}