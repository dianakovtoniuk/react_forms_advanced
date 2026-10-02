import { createContext, useEffect, useState, type ReactNode } from 'react';

import type { OpinionData, NewOpinionData } from '../types';

interface OpinionsContextValue {
  opinions: OpinionData[] | null;
  addOpinion: (opinion: NewOpinionData) => Promise<void>;
  upvoteOpinion: (id: number) => Promise<void>;
  downvoteOpinion: (id: number) => Promise<void>;
}

export const OpinionsContext = createContext<OpinionsContextValue>({
  opinions: null,
  addOpinion: async () => {},
  upvoteOpinion: async () => {},
  downvoteOpinion: async () => {},
});

export function OpinionsContextProvider({ children }: { children: ReactNode }) {
  const [opinions, setOpinions] = useState<OpinionData[] | null>(null);

  useEffect(() => {
    async function loadOpinions() {
      const response = await fetch('http://localhost:3000/opinions');
      const opinions: OpinionData[] = await response.json();
      setOpinions(opinions);
    }

    loadOpinions();
  }, []);

  async function addOpinion(enteredOpinionData: NewOpinionData) {
    const response = await fetch('http://localhost:3000/opinions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enteredOpinionData),
    });

    if (!response.ok) {
      return;
    }

    const savedOpinion: OpinionData = await response.json();
    setOpinions((prevOpinions) => [savedOpinion, ...(prevOpinions ?? [])]);
  }

  async function upvoteOpinion(id: number) {
    const response = await fetch(
      'http://localhost:3000/opinions/' + id + '/upvote',
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      return;
    }

    setOpinions((prevOpinions) => {
      return (
        prevOpinions &&
        prevOpinions.map((opinion) => {
          if (opinion.id === id) {
            return { ...opinion, votes: opinion.votes + 1 };
          }
          return opinion;
        })
      );
    });
  }

  async function downvoteOpinion(id: number) {
    const response = await fetch(
      'http://localhost:3000/opinions/' + id + '/downvote',
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      return;
    }

    setOpinions((prevOpinions) => {
      return (
        prevOpinions &&
        prevOpinions.map((opinion) => {
          if (opinion.id === id) {
            return { ...opinion, votes: opinion.votes - 1 };
          }
          return opinion;
        })
      );
    });
  }

  const contextValue: OpinionsContextValue = {
    opinions: opinions,
    addOpinion,
    upvoteOpinion,
    downvoteOpinion,
  };

  return <OpinionsContext value={contextValue}>{children}</OpinionsContext>;
}