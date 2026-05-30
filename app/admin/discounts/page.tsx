import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { DiscountsClient } from './DiscountsClient';

export default async function DiscountsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: codes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  return <DiscountsClient codes={codes ?? []} />;
}
