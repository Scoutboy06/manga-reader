export default interface Notification {
  title: string;
  body?: string;
  image?: string;
  action: string;
  createdAt: Date;
}
