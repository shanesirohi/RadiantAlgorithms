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

// Function to calculate similarity score between two users
function calculateSimilarity(userA, userB) {
    if (userA.school !== userB.school) return 0; // Different schools, no match

    // Calculate artist similarity
    const commonArtists = userA.musicPreferences.artists.filter(artist => userB.musicPreferences.artists.includes(artist));
    const artistSimilarity = commonArtists.length / Math.max(userA.musicPreferences.artists.length, userB.musicPreferences.artists.length);

    // Calculate genre similarity
    const commonGenres = userA.musicPreferences.genres.filter(genre => userB.musicPreferences.genres.includes(genre));
    const genreSimilarity = commonGenres.length / Math.max(userA.musicPreferences.genres.length, userB.musicPreferences.genres.length);

    // Combine artist and genre similarity (simple average for this example)
    const overallSimilarity = (artistSimilarity + genreSimilarity) / 2;

    return overallSimilarity;
}

// Function to generate the best match for a given user
function findBestMatch(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return null; // User not found

    // Find potential matches from the same school
    const potentialMatches = users
        .filter(u => u.id !== userId && u.school === user.school) // Exclude self and different schools
        .map(u => ({
            user: u,
            similarity: calculateSimilarity(user, u)
        }))
        .filter(match => match.similarity > 0); // Filter out zero similarity

    if (potentialMatches.length === 0) {
        return null; // No matches found
    }

    // Find the best match with the highest similarity score
    const bestMatch = potentialMatches.reduce((best, current) => (current.similarity > best.similarity ? current : best));

    return {
        user: bestMatch.user,
        matchScore: bestMatch.similarity,
        commonGenres: user.musicPreferences.genres.filter(genre => bestMatch.user.musicPreferences.genres.includes(genre)),
        commonArtists: user.musicPreferences.artists.filter(artist => bestMatch.user.musicPreferences.artists.includes(artist))
    };
}

// Example usage
const userId = 1; 
const bestMatch = findBestMatch(userId);

if (bestMatch) {
    console.log(`Best match for user ${userId}:`);
    console.log(`User: ${bestMatch.user.name} from ${bestMatch.user.school}`);
    console.log(`Match Score: ${(bestMatch.matchScore * 100).toFixed(2)}%`);
    console.log(`Common Genres: ${bestMatch.commonGenres.join(", ")}`);
    console.log(`Common Artists: ${bestMatch.commonArtists.join(", ")}`);
} else {
    console.log(`No match found for user ${userId}`);
}
