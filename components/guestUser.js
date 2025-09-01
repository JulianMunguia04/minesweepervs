"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

const useGuestUser = () => {
  const [guestUser, setGuestUser] = useState(null);

  useEffect(() => {
    // Check if we already have a guest ID in localStorage
    let guestId = localStorage.getItem("guest_id");
    let elo = localStorage.getItem("guest_elo");

    if (!guestId) {
      guestId = uuidv4(); // generate a new unique ID
      localStorage.setItem("guest_id", guestId);
    }

    if (!elo) {
      elo = 1000; // default starting ELO
      localStorage.setItem("guest_elo", elo);
    }

    setGuestUser({ guestId, elo: parseInt(elo) });
  }, []);

  return guestUser;
};

export default useGuestUser;