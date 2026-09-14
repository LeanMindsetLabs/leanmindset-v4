import { useEffect, useState } from "react";
import {
  getLabMembership,
  subscribeLabMembership,
  syncLabCalendar,
} from "../services/labMembershipService";

export function useLabMembership() {
  const [membership, setMembership] = useState(getLabMembership);

  useEffect(() => {
    syncLabCalendar();
    setMembership({ ...getLabMembership() });
    const unsubscribe = subscribeLabMembership(() => {
      setMembership({ ...getLabMembership() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return { membership };
}
