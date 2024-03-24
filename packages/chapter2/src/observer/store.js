import { 발행기관, 구독 } from "./pubsub";

export class Store {
  constructor({ state, mutations, actions }) {
    this.state = 발행기관(state);
    this.mutations = mutations;
    this.actions = actions;
  }

  commit(action, payload) {
    if (!typeof this.mutations[action]) {
      console.error(`Action '${action}' is not defined in mutations.`);
    }
    try {
      this.mutations[action](this.state, payload);
    } catch (error) {
      console.error(`Error executing action '${action}': ${error}`);
    }
  }
}
