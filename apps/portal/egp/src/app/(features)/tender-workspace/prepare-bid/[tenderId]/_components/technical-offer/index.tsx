import Protected from '@/app/(features)/protected';
import ItemList from './_components/forms/items';
export default function TechnicalOfferPage() {
  return (
    <Protected>
      <ItemList />
    </Protected>
  );
}
