export function ArticleFeatureVideoWidget() {
  return (
    <div className="w-full">
      <div
        style={{
          // Padding bottom of 56.25% corresponds to 16/9 aspect ratio
          paddingBottom: '56.25%',
        }}
        className="relative h-0 w-full rounded-lg overflow-hidden bg-gray-300"
      >
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex justify-center items-center rounded-full bg-primary h-20 w-20">
            <div
              style={{
                clipPath: 'polygon(100% 50%, 0 0, 0 100%)',
              }}
              className="bg-white ml-2 w-8 h-10"
            ></div>
          </div>
        </div>
      </div>

      <div className="w-64 italic mt-4 pl-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta labore
        eius iure aliquid asperiores cum, quibusdam sapiente!
      </div>
    </div>
  );
}