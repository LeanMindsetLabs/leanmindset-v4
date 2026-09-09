import { useEffect, useState } from "react";
import { getLabMembership, subscribeLabMembership } from "../services/labMembershipService";

export function useLabMembership() {
  const [membership, setMembership] = useState(getLabMembership);

  useEffect(() => {
    const unsubscribe = subscribeLabMembership(() => {
      setMembership({ ...getLabMembership() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return { membership };
}
