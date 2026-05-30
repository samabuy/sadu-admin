import { requireAdmin } from '@/lib/auth';
import { ProductEditForm } from '../[id]/ProductEditForm';

export default async function NewProductPage() {
  await requireAdmin();
  return <ProductEditForm product={null} />;
}
