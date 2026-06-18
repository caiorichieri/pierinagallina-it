import { useEffect, useState } from "react";
import { db } from "./client";

export type PierinaUser = { id: string; email: string | null } | null;

export function usePierinaAuth() {
  const [user, setUser] = useState<PierinaUser>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const apply = async (sessionUser: { id: string; email: string | null } | null) => {
      if (!mounted) return;
      setUser(sessionUser);
      if (sessionUser) {
        const { data, error } = await db.rpc("has_role", {
          _user_id: sessionUser.id,
          _role: "admin",
        });
        if (!mounted) return;
        setIsAdmin(!error && data === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    db.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      apply(u ? { id: u.id, email: u.email ?? null } : null);
    });

    const { data: sub } = db.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      apply(u ? { id: u.id, email: u.email ?? null } : null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
