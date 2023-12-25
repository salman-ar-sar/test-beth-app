import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { InitialTweetList, TweetCreationForm } from "../components/tweets";
import { ctx } from "../context";

export const index = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get("/", ({ htmlStream, session }) => {
    return htmlStream(() => (
      <BaseHtml>
        <div class="flex flex-col items-center py-3">
          {session ? (
            <>
              <div class="my-4 flex items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-800" safe>
                  Hi! {session.user.handle}
                </h1>
                <button
                  hx-post="/api/auth/signout"
                  class="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                  Sign Out
                </button>
              </div>
              <TweetCreationForm />
            </>
          ) : (
            <a
              href="/login"
              hx-boost="false"
              class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Sign In
            </a>
          )}
          <InitialTweetList />
        </div>
      </BaseHtml>
    ));
  });
