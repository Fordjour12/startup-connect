// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        id: string;
        email: string;
        role: string;
        name?: string;
      }
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
