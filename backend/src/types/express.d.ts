declare global {
  namespace Express {
    interface Request {
      employee?: {
        id: string;
        role: string;
      };
    }
  }
}
export {};
