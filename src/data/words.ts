import { Word } from "@/types/game";

export const words: Word[] = [
  // Animals - Level 1 (Easy)
  {
    id: "animal-1",
    word: "cat",
    category: "animals",
    difficulty: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cat",
    hint: "A small furry pet that meows",
  },
  {
    id: "animal-2",
    word: "dog",
    category: "animals",
    difficulty: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dog",
    hint: "A pet that barks",
  },
  {
    id: "animal-3",
    word: "cow",
    category: "animals",
    difficulty: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cow",
    hint: "Gives us milk",
  },

  // Animals - Level 2 (Medium)
  {
    id: "animal-4",
    word: "tiger",
    category: "animals",
    difficulty: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiger",
    hint: "A big cat with stripes",
  },
  {
    id: "animal-5",
    word: "zebra",
    category: "animals",
    difficulty: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zebra",
    hint: "Has black and white stripes",
  },

  // Animals - Level 3 (Hard)
  {
    id: "animal-6",
    word: "elephant",
    category: "animals",
    difficulty: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=elephant",
    hint: "The largest land animal with a trunk",
  },
  {
    id: "animal-7",
    word: "giraffe",
    category: "animals",
    difficulty: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=giraffe",
    hint: "Has a very long neck",
  },

  // Cars - Level 1 (Easy)
  {
    id: "car-1",
    word: "car",
    category: "cars",
    difficulty: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=car",
    hint: "A vehicle with four wheels",
  },
  {
    id: "car-2",
    word: "bus",
    category: "cars",
    difficulty: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bus",
    hint: "A large vehicle that carries many people",
  },

  // Cars - Level 2 (Medium)
  {
    id: "car-3",
    word: "truck",
    category: "cars",
    difficulty: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1523676060187-f55189a71f5e?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=truck",
    hint: "A large vehicle used to carry goods",
  },
  {
    id: "car-4",
    word: "jeep",
    category: "cars",
    difficulty: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jeep",
    hint: "An off-road vehicle",
  },

  // Cars - Level 3 (Hard)
  {
    id: "car-5",
    word: "ambulance",
    category: "cars",
    difficulty: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1566024146175-4c7c8a8a5c87?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ambulance",
    hint: "A vehicle that takes sick people to the hospital",
  },
  {
    id: "car-6",
    word: "motorcycle",
    category: "cars",
    difficulty: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    audioUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=motorcycle",
    hint: "A two-wheeled vehicle",
  },
];

export const getWordsByCategory = (category: "animals" | "cars") => {
  return words.filter((word) => word.category === category);
};

export const getWordsByDifficulty = (difficulty: 1 | 2 | 3) => {
  return words.filter((word) => word.difficulty === difficulty);
};

export const getWordById = (id: string) => {
  return words.find((word) => word.id === id);
};
