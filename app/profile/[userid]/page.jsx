"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";

const Profile = () => {
  const router = useRouter();
  const params = useParams();
  const { userid } = params;

  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameHistoryChecked, setGameHistoryChecked] = useState(false);
  const [gameHistoryPage, setGameHistoryPage] = useState(1);
  const [opponentsCache, setOpponentsCache] = useState({}); // 🧠 cache opponent data

  const FRONTEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Fetch logged-in user
  useEffect(() => {
    fetch(`${FRONTEND_URL}/userdata`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("❌ Failed to fetch userdata", err));
  }, []);

  // Fetch viewed profile
  useEffect(() => {
    if (!userid) return;
    fetch(`${FRONTEND_URL}/api/user/${userid}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((err) => console.error("❌ Failed to fetch user profile", err));
  }, [userid]);

  // Fetch game history
  useEffect(() => {
    if (!userid) return;
    fetch(`${FRONTEND_URL}/api/gamehistory/${userid}`)
      .then((res) => res.json())
      .then(async (data) => {
        setGameHistory(data);
        setGameHistoryChecked(true);

        // 🧩 Collect unique opponent IDs
        const opponentIds = new Set();
        data.forEach((game) => {
          if (game.player1 !== userid) opponentIds.add(game.player1);
          if (game.player2 !== userid) opponentIds.add(game.player2);
        });

        // 🧠 Fetch opponent data once for each unique ID
        const newCache = {};
        await Promise.all(
          Array.from(opponentIds).map(async (oid) => {
            try {
              const res = await fetch(`${FRONTEND_URL}/api/user/${oid}`);
              if (res.ok) {
                const user = await res.json();
                newCache[oid] = user;
              }
            } catch (err) {
              console.error("❌ Failed to fetch opponent:", err);
            }
          })
        );
        setOpponentsCache(newCache);
      })
      .catch((err) => console.error("❌ Failed to fetch game history", err));
  }, [userid]);

  // Helper: determine win/loss + opponent info
  const getGameOutcome = (game) => {
    if (!userid) return { result: "unknown", opponent: null, eloChange: "—" };

    const isPlayer1 = game.player1 === userid;
    const isPlayer2 = game.player2 === userid;
    const opponentId = isPlayer1 ? game.player2 : game.player1;

    // determine result
    let result = "unknown";
    if (game.winner) result = game.winner === userid ? "win" : "loss";

    // elo change
    let eloChange = "—";
    if (isPlayer1)
      eloChange = (game.p1_ending_elo ?? 0) - (game.p1_starting_elo ?? 0);
    else if (isPlayer2)
      eloChange = (game.p2_ending_elo ?? 0) - (game.p2_starting_elo ?? 0);

    // get opponent info
    const opponent = opponentsCache[opponentId] || null;

    return { result, opponent, eloChange };
  };

  const gamesPerPage = 5;
  const startIndex = (gameHistoryPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = gameHistory.slice(startIndex, endIndex);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      <Sidebar userData={userData} />
      <main style={{ marginLeft: "calc(13vw + 16px)", padding: "4%" }}>
        {/* --- Profile Info --- */}
        <div className="convex-minesweeper-no-hover" style={{ padding: "2vw" }}>
          {profileData ? (
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={profileData?.profile_picture || "/My-Account.png"}
                  style={{
                    width: "5%",
                    borderRadius: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.75vw",
                    letterSpacing: "0.5px",
                    marginLeft: "2%",
                  }}
                >
                  {profileData.username}
                </div>
              </div>
              <div>First Name: {profileData.first_name || "N/A"}</div>
              <div>Last Name: {profileData.last_name || "N/A"}</div>
              <div>Games Played: {profileData.games_played}</div>
              <div>Games Won: {profileData.games_won}</div>
              <div>ELO: {profileData.elo}</div>
              <div>
                Average Points Per Second:{" "}
                {profileData.avg_points_per_second || "N/A"}
              </div>
              <div>
                Account Created:{" "}
                {new Date(profileData.created_at).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        {/* --- Game History --- */}
        <div
          className="convex-minesweeper-no-hover"
          style={{ padding: "2vw", marginTop: "2vh" }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.75vw",
              letterSpacing: "0.5px",
              marginBottom: "1vh",
            }}
          >
            Game History
          </div>

          {!gameHistoryChecked ? (
            <div>...getting game history</div>
          ) : gameHistory.length > 0 ? (
            <>
              {currentGames.map((game, index) => {
                const { result, opponent, eloChange } = getGameOutcome(game);
                const outcomeColor =
                  result === "win"
                    ? "#a1f0a1"
                    : result === "loss"
                    ? "#f5a3a3"
                    : "#ddd";

                return (
                  <div
                    key={index}
                    className="concave-minesweeper-no-hover"
                    style={{
                      marginTop: "1vh",
                      padding: "1vh 1.5vw",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: outcomeColor,
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {result === "win"
                        ? "🏆 Win"
                        : result === "loss"
                        ? "💀 Loss"
                        : "❓ Unknown"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {opponent?.profile_picture && (
                        <img
                          src={opponent.profile_picture}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            marginRight: "8px",
                          }}
                        />
                      )}
                      <div>Opponent: {opponent?.username || "Unknown"}</div>
                    </div>
                    <div>
                      ELO Change: {eloChange > 0 ? `+${eloChange}` : eloChange}
                    </div>
                    <div>Date: {formatDate(game.created_at)}</div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2vh",
                  gap: "0.5vw",
                }}
              >
                {Array.from({
                  length: Math.ceil(gameHistory.length / gamesPerPage),
                }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    onClick={() => setGameHistoryPage(pageIndex + 1)}
                    className="concave-minesweeper-no-hover"
                    style={{
                      padding: "0.5vw 1vw",
                      cursor: "pointer",
                      backgroundColor:
                        gameHistoryPage === pageIndex + 1
                          ? "lightblue"
                          : "transparent",
                      border: "1px solid gray",
                      borderRadius: "6px",
                      fontWeight:
                        gameHistoryPage === pageIndex + 1 ? "bold" : "normal",
                    }}
                  >
                    {pageIndex + 1}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>No games found.</div>
          )}
        </div>
      </main>
    </>
  );
};

export default Profile;
