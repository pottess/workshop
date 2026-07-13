function Content() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] items-center justify-center max-h-[44px] min-h-[44px] px-[24px] relative rounded-tl-[4px] rounded-tr-[4px]" data-name="Content">
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:SemiBold',sans-serif] font-semibold leading-[16px] min-w-[24px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[16px] text-center text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Tab
      </p>
    </div>
  );
}

function Content1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] items-center justify-center max-h-[44px] min-h-[44px] px-[24px] relative rounded-tl-[4px] rounded-tr-[4px]" data-name="Content">
      <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[16px] min-w-[24px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[16px] text-center text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Tab
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-center flex flex-wrap gap-0 h-[48px] items-center max-h-[48px] relative shrink-0" data-name="Container">
      <div className="content-stretch flex flex-col h-[48px] items-start max-h-[48px] min-h-[48px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="_Tab Base">
        <Content />
        <div className="bg-[#fd9d1e] h-[4px] relative shrink-0 w-full" data-name="Border-bottom" />
      </div>
      <div className="content-stretch flex flex-col h-[48px] items-start max-h-[48px] min-h-[48px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="_Tab Base">
        <Content1 />
        <div className="bg-[rgba(255,255,255,0)] h-[4px] relative shrink-0 w-full" data-name="Border-bottom" />
      </div>
    </div>
  );
}

export default function ClbTabAtualizado() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="CLB-Tab [ATUALIZADO]">
      <div aria-hidden className="absolute border-[#f2f2f2] border-b border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}