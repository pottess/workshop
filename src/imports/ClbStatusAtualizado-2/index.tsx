import svgPaths from "./svg-2s5nass12w";

export default function ClbStatusAtualizado() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="CLB-Status [ATUALIZADO]">
      <div className="bg-[#ffeaea] content-stretch flex gap-[4px] h-[24px] items-center px-[8px] py-[4px] relative rounded-[2px] shrink-0" data-name="_Status-Base">
        <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="_Badge">
          <div className="relative shrink-0 size-[12px]" data-name="Icons/Spam-fill">
            <div className="absolute inset-[8.33%_9.92%_9.06%_7.47%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91304 9.91304">
                <path d={svgPaths.p2a98c600} fill="var(--fill-0, #AE1E1E)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
        <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[16px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          Negative
        </p>
      </div>
    </div>
  );
}