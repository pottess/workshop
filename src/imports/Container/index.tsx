import imgImageCora from "./ed252fcb7695058c90569a462639d4a2d13c0645.png";

function ImageCora() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Image (Cora)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCora} />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip pl-[0.719px] pr-[1.211px] relative rounded-[4px] size-full" data-name="Container">
      <ImageCora />
    </div>
  );
}