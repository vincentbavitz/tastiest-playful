import { titleCase } from '../utils/text';
import LocationSVG from '../assets/svgs/location.svg';

interface Props {
  city: string;
}

export function CityIndictor(props: Props) {
  return (
    <div className="inline-flex items-center">
      <div className="icon">
        <LocationSVG className="w-5 mr-2" />
      </div>
      <div className="flex content-center h-4 px-1 bg-primary font-bold rounded">
        <p className="self-center text-white text-xs">
          {titleCase(props.city)}
        </p>
      </div>
    </div>
  );
}
