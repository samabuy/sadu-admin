import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminOrManager } from '@/lib/auth';
import { CustomersClient } from './CustomersClient';

export default async function CustomersPage() {
  const session = await requireAdminOrManager();
  const supabase = createAdminClient();

  // profiles table: id, email, full_name, phone, role, created_at
  // loyalty table: user_id, points, tier (separate table)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id,email,full_name,phone,role,created_at')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('[customers/page] profiles error:', profilesError.message);
  }

  // Join loyalty data
  const { data: loyaltyRows, error: loyaltyError } = await supabase
    .from('loyalty')
    .select('user_id,points,tier');

  if (loyaltyError) {
    console.error('[customers/page] loyalty error:', loyaltyError.message);
  }

  const loyaltyMap = new Map(loyaltyRows?.map((l) => [l.user_id, l]) ?? []);

  const customers = (profiles ?? []).map((p) => {
    const loy = loyaltyMap.get(p.id);
    return {
      ...p,
      loyalty_points: loy?.points ?? 0,
      loyalty_tier: loy?.tier ?? null,
    };
  });

  return <CustomersClient customers={customers} role={session.role} />;
}
