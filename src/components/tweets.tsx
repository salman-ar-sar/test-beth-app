import { type Session } from "lucia";
import { db } from "../db";

interface TweetListProps {
  session: Session | null;
}

interface TweetCardProps extends TweetListProps {
  createdAt: Date;
  content: string;
  author: {
    handle: string;
  };
  id: number;
}

export function TweetCard({
  author: { handle },
  createdAt,
  content,
  id,
  session,
}: TweetCardProps) {
  const canDeleteTweet = session?.user.handle === handle;

  return (
    <div
      class="rounded-lg border p-4 shadow-md"
      id={`tweet-${id}`}
      hx-ext="response-targets"
    >
      <h2 class="text-xl font-bold text-white" safe>
        @{handle}
      </h2>
      <p class="text-cyan-100" safe>
        {content}
      </p>
      <div class="flex flex-row justify-between">
        <span class="text-sm text-gray-500">{createdAt.toLocaleString()}</span>
        {canDeleteTweet && (
          <button
            class="i-lucide-x text-lg text-red-500"
            hx-delete={`/api/tweets/${id}`}
            hx-target={`#tweet-${id}`}
            hx-swap="outerHTML"
            hx-target-4xx="next #tweetDeleteError"
            hx-confirm="Are you sure you want to delete this tweet?"
          />
        )}
      </div>
      <div id="tweetDeleteError" />
    </div>
  );
}

export async function InitialTweetList({ session }: TweetListProps) {
  const tweetData = await db.query.tweets.findMany({
    limit: 5,
    orderBy: (tweets, { desc }) => [desc(tweets.createdAt)],
    with: {
      author: {
        columns: {
          handle: true,
        },
      },
    },
  });

  const lastTweetTime = tweetData[tweetData.length - 1]?.createdAt;

  return (
    <>
      <div
        class="my-6 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        id="tweetList"
      >
        {tweetData.map((tweet) => (
          <TweetCard {...tweet} session={session} />
        ))}
        {lastTweetTime && (
          // @ts-expect-error Not typed properly
          <div
            class="hidden"
            hx-get={`/api/tweets?after=${lastTweetTime?.toISOString()}`}
            hx-swap="beforeend"
            hx-target="#tweetList"
            hx-trigger="revealed"
          />
        )}
      </div>
    </>
  );
}

interface AdditionalTweetListProps extends TweetListProps {
  after: Date;
}

export async function AdditionalTweetList({
  after,
  session,
}: AdditionalTweetListProps) {
  const tweetData = await db.query.tweets.findMany({
    where: (tweets, { lt }) => lt(tweets.createdAt, after),
    limit: 5,
    orderBy: (tweets, { desc }) => [desc(tweets.createdAt)],
    with: {
      author: {
        columns: {
          handle: true,
        },
      },
    },
  });

  const lastTweetTime = tweetData[tweetData.length - 1]?.createdAt;

  return (
    <>
      {tweetData.map((tweet) => (
        <TweetCard {...tweet} session={session} />
      ))}
      {lastTweetTime && (
        // @ts-expect-error Not typed properly
        <div
          class="hidden"
          hx-get={`/api/tweets?after=${lastTweetTime.toISOString()}`}
          hx-swap="beforeend"
          hx-target="#tweetList"
          hx-trigger="revealed"
        />
      )}
    </>
  );
}

export function TweetCreationForm() {
  return (
    <div class="rounded-lg border p-4 shadow-md">
      <h2 class="mb-4 text-xl font-bold text-white">Create a new Tweet</h2>
      <form
        class="flex flex-col items-center gap-3"
        hx-post="/api/tweets"
        hx-swap="afterbegin"
        hx-target="#tweetList"
        _="on submit target.reset()"
      >
        <label
          class="block self-start text-sm font-bold text-cyan-100"
          for="content"
        >
          Tweet:
        </label>
        <input
          class="bg-dark w-72 appearance-none rounded border px-3 py-2 leading-tight text-gray-200 shadow"
          name="content"
          required="true"
        />
        <button
          class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="submit"
        >
          Post Tweet
        </button>
      </form>
    </div>
  );
}
