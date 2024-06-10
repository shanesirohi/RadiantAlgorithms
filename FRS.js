// User data structure example
const users = [
    {
        id: 1,
        name: "Alice",
        school: "XYZ College",
        musicPreferences: {
            genres: ["Rock", "Jazz"],
            artists: ["Artist A", "Artist B"]
        },
        friends: [2, 3] // IDs of friends
    },
    {
        id: 2,
        name: "Bob",
        school: "XYZ College",
        musicPreferences: {
            genres: ["Rock", "Pop"],
            artists: ["Artist A", "Artist C"]
        },
        friends: [1, 4]
    },
    {
        id: 3,
        name: "Charlie",
        school: "ABC University",
        musicPreferences: {
            genres: ["Jazz", "Classical"],
            artists: ["Artist D", "Artist E"]
        },
        friends: [1]
    },
    {
        id: 4,
        name: "David",
        school: "XYZ College",
        musicPreferences: {
            genres: ["Rock", "Jazz"],
            artists: ["Artist A", "Artist B"]
        },
        friends: [2]
    },
    {
        id: 5,
        name: "Eve",
        school: "XYZ College",
        musicPreferences: {
            genres: ["Pop", "Hip Hop"],
            artists: ["Artist F", "Artist G"]
        },
        friends: []
    }
    // Add more users as needed
];

// Function to calculate weighted similarity score between two users
function calculateSimilarity(userA, userB) {
    let score = 0;
    
    // Weights
    const weights = {
        school: 0.4,
        friends: 0.3,
        artists: 0.2,
        genres: 0.1
    };

    // School similarity
    if (userA.school === userB.school) {
        score += weights.school;
    }

    // Common friends similarity
    const commonFriends = userA.friends.filter(friendId => userB.friends.includes(friendId));
    const friendSimilarity = commonFriends.length / Math.max(userA.friends.length, userB.friends.length);
    score += friendSimilarity * weights.friends;

    // Artist similarity
    const commonArtists = userA.musicPreferences.artists.filter(artist => userB.musicPreferences.artists.includes(artist));
    const artistSimilarity = commonArtists.length / Math.max(userA.musicPreferences.artists.length, userB.musicPreferences.artists.length);
    score += artistSimilarity * weights.artists;

    // Genre similarity
    const commonGenres = userA.musicPreferences.genres.filter(genre => userB.musicPreferences.genres.includes(genre));
    const genreSimilarity = commonGenres.length / Math.max(userA.musicPreferences.genres.length, userB.musicPreferences.genres.length);
    score += genreSimilarity * weights.genres;

    return {
        score,
        commonFriends,
        commonGenres,
        commonArtists
    };
}

// Function to generate recommendations for a given user
function generateRecommendations(userId, numRecommendations = 3) {
    const user = users.find(u => u.id === userId);
    if (!user) return []; // User not found

    // Calculate similarity with other users
    const potentialMatches = users
        .filter(u => u.id !== userId) // Exclude self
        .map(u => ({
            user: u,
            similarity: calculateSimilarity(user, u)
        }))
        .filter(recommendation => recommendation.similarity.score > 0) // Filter out zero similarity
        .sort((a, b) => b.similarity.score - a.similarity.score); // Sort by similarity score

    // Select top recommendations based on similarity score
    const recommendations = potentialMatches
        .slice(0, numRecommendations)
        .map(recommendation => ({
            user: recommendation.user,
            matchScore: recommendation.similarity.score,
            commonFriends: recommendation.similarity.commonFriends,
            commonGenres: recommendation.similarity.commonGenres,
            commonArtists: recommendation.similarity.commonArtists
        }));

    return recommendations;
}

// Example usage
const userId = 1; // ID of the user for whom we are generating recommendations
const recommendations = generateRecommendations(userId);

console.log(`Recommendations for user ${userId}:`);
recommendations.forEach(rec => {
    console.log(`User: ${rec.user.name} from ${rec.user.school}`);
    console.log(`Match Score: ${(rec.matchScore * 100).toFixed(2)}%`);
    console.log(`Common Friends: ${rec.commonFriends.join(", ")}`);
    console.log(`Common Genres: ${rec.commonGenres.join(", ")}`);
    console.log(`Common Artists: ${rec.commonArtists.join(", ")}`);
    console.log("-------------------------------------------------");
});
