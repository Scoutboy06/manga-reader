import Vertical from './Vertical';
import Horizontal from './Horizontal';

export default function MangaCard() {
	throw new Error('Use MangaCard.Vertical or MangaCard.Horizontal');
}

MangaCard.Vertical = Vertical;
MangaCard.Horizontal = Horizontal;
