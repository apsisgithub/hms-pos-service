type StatusTransitions = {
    [status: string]: string[];
  };
  
  export class StatusGraph {
    constructor(private readonly transitions: StatusTransitions) {}
  
    canTransition(fromStatus: string, toStatus: string): boolean {
      return this.transitions[fromStatus].includes(toStatus);
    }
  }
  