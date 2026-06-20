export type Movie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  quality: "4K" | "HD" | "CAM";
  genres: string[];
  language: string;
  category: "movie" | "series" | "anime" | "kdrama";
  poster: string;
  backdrop: string;
  description: string;
  cast: string[];
  duration: string;
  trailerId?: string;
};

const img = (seed: string, w = 600, h = 900) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const makeMovie = (
  id: string,
  title: string,
  year: number,
  rating: number,
  quality: Movie["quality"],
  genres: string[],
  language: string,
  category: Movie["category"],
  description: string,
  cast: string[],
  duration: string,
): Movie => ({
  id,
  title,
  year,
  rating,
  quality,
  genres,
  language,
  category,
  poster: img(`${id}-p`, 600, 900),
  backdrop: img(`${id}-b`, 1920, 1080),
  description,
  cast,
  duration,
  trailerId: "dQw4w9WgXcQ",
});

export const movies: Movie[] = [
  makeMovie("dune-2", "Dune: Part Two", 2024, 8.7, "4K", ["Sci-Fi", "Adventure"], "English", "movie",
    "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"], "2h 46m"),
  makeMovie("oppen", "Oppenheimer", 2023, 8.5, "4K", ["Drama", "History"], "English", "movie",
    "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    ["Cillian Murphy", "Emily Blunt", "Matt Damon"], "3h 0m"),
  makeMovie("john-w", "John Wick: Chapter 4", 2023, 7.8, "4K", ["Action", "Thriller"], "English", "movie",
    "John Wick uncovers a path to defeating The High Table.",
    ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"], "2h 49m"),
  makeMovie("inter", "Interstellar", 2014, 8.7, "HD", ["Sci-Fi", "Drama"], "English", "movie",
    "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], "2h 49m"),
  makeMovie("blade", "Blade Runner 2049", 2017, 8.0, "4K", ["Sci-Fi", "Mystery"], "English", "movie",
    "A young blade runner discovers a long-buried secret that leads him on a quest to find Rick Deckard.",
    ["Ryan Gosling", "Harrison Ford", "Ana de Armas"], "2h 44m"),
  makeMovie("everywhere", "Everything Everywhere All at Once", 2022, 7.8, "HD", ["Action", "Comedy"], "English", "movie",
    "A middle-aged Chinese immigrant is swept up into an insane adventure.",
    ["Michelle Yeoh", "Ke Huy Quan", "Jamie Lee Curtis"], "2h 19m"),

  makeMovie("breaking", "Breaking Bad", 2008, 9.5, "4K", ["Crime", "Drama"], "English", "series",
    "A high school chemistry teacher turned methamphetamine producer partners with a former student.",
    ["Bryan Cranston", "Aaron Paul", "Anna Gunn"], "5 Seasons"),
  makeMovie("the-bear", "The Bear", 2022, 8.6, "4K", ["Comedy", "Drama"], "English", "series",
    "A young chef from the fine dining world returns to Chicago to run his family sandwich shop.",
    ["Jeremy Allen White", "Ebon Moss-Bachrach"], "3 Seasons"),
  makeMovie("succession", "Succession", 2018, 8.9, "4K", ["Drama"], "English", "series",
    "The Roy family controls one of the biggest media conglomerates in the world.",
    ["Brian Cox", "Jeremy Strong", "Sarah Snook"], "4 Seasons"),
  makeMovie("severance", "Severance", 2022, 8.7, "4K", ["Sci-Fi", "Thriller"], "English", "series",
    "Employees undergo a procedure separating their work and personal memories.",
    ["Adam Scott", "Britt Lower", "Patricia Arquette"], "2 Seasons"),

  makeMovie("jjk", "Jujutsu Kaisen", 2020, 8.6, "4K", ["Action", "Supernatural"], "Japanese", "anime",
    "A boy swallows a cursed talisman and becomes cursed himself, joining a school of sorcerers.",
    ["Junya Enoki", "Yuma Uchida"], "2 Seasons"),
  makeMovie("aot", "Attack on Titan", 2013, 9.1, "4K", ["Action", "Drama"], "Japanese", "anime",
    "Humanity fights for survival against giant humanoid Titans.",
    ["Yuki Kaji", "Yui Ishikawa"], "4 Seasons"),
  makeMovie("frieren", "Frieren: Beyond Journey's End", 2023, 9.0, "4K", ["Adventure", "Fantasy"], "Japanese", "anime",
    "An elf mage embarks on a new journey to understand humanity.",
    ["Atsumi Tanezaki", "Kana Ichinose"], "1 Season"),
  makeMovie("demon", "Demon Slayer", 2019, 8.7, "4K", ["Action", "Fantasy"], "Japanese", "anime",
    "A young boy becomes a demon slayer to avenge his family and cure his sister.",
    ["Natsuki Hanae", "Akari Kitō"], "4 Seasons"),

  makeMovie("squid", "Squid Game", 2021, 8.0, "4K", ["Thriller", "Drama"], "Korean", "kdrama",
    "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.",
    ["Lee Jung-jae", "Park Hae-soo"], "2 Seasons"),
  makeMovie("crash", "Crash Landing on You", 2019, 8.7, "HD", ["Romance", "Drama"], "Korean", "kdrama",
    "A South Korean heiress crash-lands in North Korea and meets an army officer.",
    ["Hyun Bin", "Son Ye-jin"], "1 Season"),
  makeMovie("glory", "The Glory", 2022, 8.1, "4K", ["Drama", "Thriller"], "Korean", "kdrama",
    "A woman seeks revenge against bullies who tormented her in high school.",
    ["Song Hye-kyo", "Lee Do-hyun"], "1 Season"),
  makeMovie("moving", "Moving", 2023, 8.6, "4K", ["Action", "Sci-Fi"], "Korean", "kdrama",
    "Children with superpowers and their parents face threats from the past.",
    ["Ryu Seung-ryong", "Han Hyo-joo"], "1 Season"),

  makeMovie("wick-1", "The Batman", 2022, 7.8, "4K", ["Action", "Crime"], "English", "movie",
    "Batman ventures into Gotham City's underworld when a sadistic killer leaves a trail of cryptic clues.",
    ["Robert Pattinson", "Zoë Kravitz"], "2h 56m"),
  makeMovie("gotg", "Guardians of the Galaxy Vol. 3", 2023, 7.9, "4K", ["Action", "Adventure"], "English", "movie",
    "Peter Quill rallies his team to defend the universe and protect one of their own.",
    ["Chris Pratt", "Zoe Saldaña"], "2h 30m"),
];

export const heroSlides = movies.slice(0, 5);

export const getByCategory = (c: Movie["category"]) => movies.filter((m) => m.category === c);
export const getById = (id: string) => movies.find((m) => m.id === id);

export const trending = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
export const topRated = [...movies].filter((m) => m.rating >= 8.5);
export const recentlyAdded = [...movies].slice().reverse().slice(0, 10);
export const latestMovies = getByCategory("movie");

export const allGenres = Array.from(new Set(movies.flatMap((m) => m.genres))).sort();
export const allLanguages = Array.from(new Set(movies.map((m) => m.language))).sort();
export const allYears = Array.from(new Set(movies.map((m) => m.year))).sort((a, b) => b - a);
