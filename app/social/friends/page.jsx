"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";

const Friends = () => {
  const router = useRouter();
  const params = useParams();

  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [friends, setFriends] = useState([]);

  const [friendsPage, setFriendsPage] = useState(1);
  const friendsPerPage = 5;

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [query, setQuery] = useState("")
  const [queriedUsers, setQueriedUsers] = useState([])
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = allUsers.filter((user) =>
      user.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filtered);
  }, [search]);

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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // 1️⃣ Get the friend IDs
        const res = await fetch(`${FRONTEND_URL}/api/friends`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch friend IDs");
        const data = await res.json();
        const friendIds = data.friends;

        // 2️⃣ Fetch all friend info in parallel
        const friendsData = await Promise.all(
          friendIds.map(async (id) => {
            try {
              const res = await fetch(`${FRONTEND_URL}/api/user/${id}`);
              if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
              return await res.json();
            } catch (err) {
              console.error(err);
              return null;
            }
          })
        );
        setFriends(friendsData.filter(Boolean));
      } catch (err) {
        console.error("❌ Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [userData]);

  // Pagination logic
  const totalPages = Math.ceil(friends.length / friendsPerPage);
  const startIndex = (friendsPage - 1) * friendsPerPage;
  const endIndex = startIndex + friendsPerPage;
  const currentFriends = friends.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (friendsPage > 1) setFriendsPage(friendsPage - 1);
  };

  const handleNext = () => {
    if (friendsPage < totalPages) setFriendsPage(friendsPage + 1);
  };

  const searchUsers = async (searchText) => {
    const res = await fetch("/api/searchusers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchText }),
    });
    const users = await res.json();
    setQueriedUsers(users)
    console.log("users: ", users)
  };

  const handleSearch = async (text) => {
    console.log("enter")
    setQuery(text);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const newTimeout = setTimeout(() => {
      if (text.trim().length > 0) {
        searchUsers(text);
      } else {
        setQueriedUsers([]);
      }
    }, 500);

    setDebounceTimeout(newTimeout);
  }

  const addFriend = async (friendUsername) => {
    console.log(friendUsername)
    try {
      const res = await fetch("/api/addfriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ friend_username: friendUsername }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        console.log("Friendship created:", data.friendship);
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error adding friend:", err);
    }
  };

  return (
    <>
      <Sidebar userData={userData} />
      <main style={{ marginLeft: "calc(13vw + 16px)", padding: "4%" }}>
        <div className="convex-minesweeper-no-hover" style={{ padding: "2vw" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/Friends.png" style={{ width: "4%" }} />
            <div style={{ fontWeight: "bold", fontSize: "1.75vw" }}>Friends</div>
          </div>

          <div
            className="concave-minesweeper-no-hover"
            style={{ padding: "2vw", marginTop: "1vh" }}
          >
            <div>
              My Friends <span>({friends.length})</span>
              {currentFriends.map((friend) => (
                <div 
                  key={friend.id} 
                  className="convex-minesweeper-no-hover"
                  style={{ padding: "0.5vw", marginTop: "1vh", display:"flex", alignItems:"center"}}
                  onClick={() => window.location.href = `/profile/${friend.id}`}
                >
                  <img 
                    rel="preload"
                    src={friend?.profile_picture? `${friend?.profile_picture}` : "/empty-profile-example.jpg"}
                    style={{
                      height: '5vh',
                      borderRadius: '100%'
                    }}
                  />
                  <div style={{ marginLeft: "1%"}}>{friend.username}</div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={handlePrev}
                disabled={friendsPage === 1}
                style={{
                  padding: "0.5rem 1rem",
                  opacity: friendsPage === 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>

              <span>
                Page {friendsPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={friendsPage === totalPages}
                style={{
                  padding: "0.5rem 1rem",
                  opacity: friendsPage === totalPages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
          <div
            className="concave-minesweeper-no-hover"
            style={{ padding: "2vw", marginTop: "2vh" }}
          >
            <div>Search Friends</div>
            <input 
              className="form-control search-home"
              style={{ width: '100%', height: '4vh', boxShadow:`none`, marginBottom: '0.75rem', }} 
              placeholder='Search' value={query} onChange={(e) => handleSearch(e.target.value)}
            />
            {queriedUsers.length > 0 && (
              <div>
                {queriedUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="convex-minesweeper-no-hover"
                    style={{ padding: "0.5vw", marginTop: "1vh", display:"flex", alignItems:"center", justifyContent:"space-between"}}
                  >
                    <div style={{display:"flex", alignItems:"center"}}>
                      <img 
                        rel="preload"
                        src={user?.profile_picture? `${user?.profile_picture}` : "/empty-profile-example.jpg"}
                        style={{
                          height: '5vh',
                          borderRadius: '100%'
                        }}
                      />
                      <div style={{ marginLeft: "2%"}}>{user.username}</div>
                    </div>
                    {user.status === "pending" && <span>⏳ Pending</span>}
                    {user.status === null && (
                      <button onClick={() => addFriend(user.username)}>Add Friend</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Friends;
