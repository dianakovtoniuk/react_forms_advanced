import { use, useActionState, useOptimistic } from 'react';

import { OpinionsContext } from '../store/opinions-context';
import type { OpinionData } from '../types';

interface OpinionProps {
  opinion: OpinionData;
}

export function Opinion({
  opinion: { id, title, body, userName, votes },
}: OpinionProps) {
  const { upvoteOpinion, downvoteOpinion } = use(OpinionsContext);

  const [optimisticVotes, setVotesOptimistically] = useOptimistic(
    votes,
    (prevVotes: number, mode: 'up' | 'down') =>
      mode === 'up' ? prevVotes + 1 : prevVotes - 1
  );

  async function upvoteAction() {
    setVotesOptimistically('up');
    await upvoteOpinion(id);
  }

  async function downvoteAction() {
    setVotesOptimistically('down');
    await downvoteOpinion(id);
  }

  const [, upvoteFormAction, upvotePending] = useActionState(
    upvoteAction,
    undefined
  );
  const [, downvoteFormAction, downvotePending] = useActionState(
    downvoteAction,
    undefined
  );

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        <button
          formAction={upvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        <span>{optimisticVotes}</span>

        <button
          formAction={downvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}