interface MessageInterface extends Document {
  content: string;
  createAt: Date;
}

interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verfiyToken: string;
  verifyTokenExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
  messages?: MessageInterface[];
}

interface ApiResponseInterface {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: MessageInterface[];
}
