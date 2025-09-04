"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useGuestUser = () => {
  const [guestUser, setGuestUser] = useState(null);

  useEffect(() => {
    // Get or create guest ID
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guest_id", guestId);
    }

    // Get or create ELO
    let elo = localStorage.getItem("guest_elo");
    if (!elo) {
      elo = 1000;
      localStorage.setItem("guest_elo", String(elo));
    }

    const parsedElo = parseInt(elo, 10);

    const guestData = {
      id: guestId,
      username: guestId,
      elo: parsedElo
    };

    localStorage.setItem("guest_data", JSON.stringify(guestData));
    setGuestUser(guestData);

  }, []);

  return guestUser;
};

export default useGuestUser;
