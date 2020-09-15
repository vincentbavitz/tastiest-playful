import Link from 'next/link';
import { Hashtag } from '../objects';

interface Props {
  href: string;
  image: string;
  altTag: string;
  title: string;
  paragraph: string;
  hashtags: Array<Hashtag>; // Max 5
  sameSite?: string;
}

function BlogCard(props: Props): JSX.Element {
  const { href, image, altTag, title, paragraph, hashtags, sameSite } = props;

  // Item to be used
  sameSite;

  return (
    <Link href={href}>
      <div className="rounded-lg overflow-hidden shadow-lg m-8 lg:w-3/12">
        <a>
          <img className="w-full" src={image} alt={altTag} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base">{paragraph}</p>
          </div>
          <div className="px-6 py-4">
            {hashtags &&
              hashtags.map(hashtag => (
                <span
                  key={hashtag.tag}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {hashtag.formatted}
                </span>
              ))}
          </div>
        </a>
      </div>
    </Link>
  );
}

export default BlogCard;
