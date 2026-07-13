import svgPaths from "./svg-bkd027awmb";

function Heading() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pt-[4px] relative" data-name="Heading">
      <p className="font-['IBM_Plex_Sans:Medium',sans-serif] font-medium leading-[20px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[20px] text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Title
      </p>
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[#666] text-[14px] text-ellipsis w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
        Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi aliquam in.
      </p>
    </div>
  );
}

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

function Content2() {
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
    <div className="content-start flex flex-wrap gap-0 h-[48px] items-start max-h-[48px] relative shrink-0" data-name="Container">
      <div className="content-stretch flex flex-col h-[48px] items-start max-h-[48px] min-h-[48px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="_Tab Base">
        <Content />
        <div className="bg-[#ffc629] h-[4px] relative shrink-0 w-full" data-name="Border-bottom" />
      </div>
      <div className="content-stretch flex flex-col h-[48px] items-start max-h-[48px] min-h-[48px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="_Tab Base">
        <Content1 />
        <div className="bg-[rgba(255,255,255,0)] h-[4px] relative shrink-0 w-full" data-name="Border-bottom" />
      </div>
      <div className="content-stretch flex flex-col h-[48px] items-start max-h-[48px] min-h-[48px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name="_Tab Base">
        <Content2 />
        <div className="bg-[rgba(255,255,255,0)] h-[4px] relative shrink-0 w-full" data-name="Border-bottom" />
      </div>
    </div>
  );
}

function ScrollBar() {
  return (
    <div className="flex-[1_0_0] max-w-[8px] min-h-px min-w-[8px] relative w-[8px]" data-name="Scroll Bar">
      <div className="absolute bg-[#d9d9d9] inset-0 rounded-[500px]" data-name="Background" />
      <div className="absolute bg-[#666] inset-[0_0_80%_0] rounded-[500px]" data-name="Bar" />
    </div>
  );
}

function Content3() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative w-full" data-name="Content">
      <div className="overflow-x-clip overflow-y-auto rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[24px] relative size-full">
          <div className="flex-[1_0_0] h-full min-w-px relative rounded-[4px]" data-name="_Content">
            <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center justify-center py-[240px] relative size-full">
                <p className="[word-break:break-word] font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#bfbfbf] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
                  Swap this spot with your content
                </p>
              </div>
            </div>
            <div aria-hidden className="absolute border-2 border-[#d9d9d9] border-dashed inset-0 pointer-events-none rounded-[4px]" />
          </div>
          <div className="absolute bottom-[24px] content-stretch flex flex-col items-start justify-center max-w-[8px] min-w-[8px] overflow-clip right-[2px] rounded-[500px] top-[24px] w-[8px]" data-name="CLB - Scroll">
            <ScrollBar />
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch cursor-pointer flex gap-[8px] h-[40px] items-center justify-end relative shrink-0 w-full" data-name="Actions">
      <button className="content-stretch flex items-start max-h-[40px] min-h-[40px] relative shrink-0" data-name="CLB-Button [ATUALIZADO]">
        <div className="content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] relative rounded-[2px] shrink-0" data-name="_Button-Base">
          <p className="[word-break:break-word] font-['IBM_Plex_Sans:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[24px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
            Label
          </p>
        </div>
      </button>
      <button className="content-stretch flex items-start max-h-[40px] min-h-[40px] relative shrink-0" data-name="CLB-Button [ATUALIZADO]">
        <div className="content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] relative rounded-[2px] shrink-0" data-name="_Button-Base">
          <div aria-hidden className="absolute border border-[#0e0e0e] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <p className="[word-break:break-word] font-['IBM_Plex_Sans:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[24px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
            Label
          </p>
        </div>
      </button>
      <button className="content-stretch flex items-start max-h-[40px] min-h-[40px] relative shrink-0" data-name="CLB-Button [ATUALIZADO]">
        <div className="bg-[#fd9d1e] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] relative rounded-[2px] shrink-0" data-name="_Button-Base">
          <p className="[word-break:break-word] font-['IBM_Plex_Sans:Medium',sans-serif] font-medium leading-[24px] overflow-hidden relative shrink-0 text-[#0e0e0e] text-[24px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
            Label
          </p>
        </div>
      </button>
    </div>
  );
}

export default function ClbDrawerAtualizado() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="CLB-Drawer [ATUALIZADO]">
      <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start max-w-[352px] min-h-[480px] min-w-[352px] relative w-[352px]" data-name="_Drawer-Base">
        <div className="bg-white h-[100px] relative shrink-0 w-full" data-name="_Heading">
          <div className="content-stretch flex gap-[48px] items-start pl-[24px] pr-[16px] py-[16px] relative size-full">
            <Heading />
            <button className="content-stretch cursor-pointer flex items-start max-h-[32px] max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0 size-[32px]" data-name="CLB-Button Icon [ATUALIZADO]">
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col gap-[6px] items-center justify-center relative rounded-[2px] shrink-0 size-[32px]" data-name="_Button Icon-Base">
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[40px]" data-name="CLB-Icon [ATUALIZADO]">
                  <div className="relative shrink-0 size-[20px]" data-name="Icons/Close">
                    <div className="absolute inset-[25.74%_22.79%_22.79%_25.74%]" data-name="Vector">
                      <div className="absolute inset-[3.25%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.62447 9.62447">
                          <path d={svgPaths.p17530280} fill="var(--fill-0, #0E0E0E)" id="Vector" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="CLB-Tab [ATUALIZADO]">
          <div aria-hidden className="absolute border-[#f2f2f2] border-b border-solid inset-0 pointer-events-none" />
          <Container />
        </div>
        <Content3 />
        <div className="h-[72px] relative shrink-0 w-full" data-name="_Footer">
          <div aria-hidden className="absolute border-[#f2f2f2] border-solid border-t inset-0 pointer-events-none" />
          <div className="flex flex-col items-end justify-center size-full">
            <div className="content-stretch flex flex-col items-end justify-center px-[24px] py-[16px] relative size-full">
              <Actions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}