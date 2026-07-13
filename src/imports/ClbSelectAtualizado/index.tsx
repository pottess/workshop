import svgPaths from "./svg-s0ip8sme31";

function InputLabel() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[4px] isolate items-center leading-[16px] relative shrink-0 w-full whitespace-nowrap" data-name="Input-Label">
      <p className="font-['IBM_Plex_Sans:Medium',sans-serif] font-medium relative shrink-0 text-[#0e0e0e] text-[16px] z-[3]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Select
      </p>
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] font-normal relative shrink-0 text-[#292929] text-[14px] z-[2]" style={{ fontVariationSettings: '"wdth" 100' }}>
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
          <div className="relative shrink-0 size-[24px]" data-name="Icons/Chevron-down">
            <div className="absolute flex inset-[37.62%_29.17%_33.33%_24.37%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="flex-none h-[100cqh] rotate-180 w-[100cqw]">
                <div className="relative size-full" data-name="Vector">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.15 6.97118">
                    <path d={svgPaths.p2b0b3770} fill="var(--fill-0, #0E0E0E)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClbSelectAtualizado() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="CLB-Select [ATUALIZADO]">
      <InputLabel />
      <InputField />
    </div>
  );
}