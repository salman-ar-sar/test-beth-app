/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("../auth/index").Auth;
  interface DatabaseUserAttributes {
    handle: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DatabaseSessionAttributes {}
}
