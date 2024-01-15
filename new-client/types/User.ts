export default interface User {
  _id: string;
  isAdmin?: boolean;

  id: string;
  name?: string | null;
  email: string;
  emailVerified: Date | null;
  image?: string | null;
}
