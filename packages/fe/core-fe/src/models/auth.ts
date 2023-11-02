export interface Password {
  oldPassword: string;
  newPassword: string;
}

export interface Login {
  username: string;
  password: string;
}

export class SignUp {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface Verify {
  verificationId: string;
  otp: string;
  isOtp: boolean;
}

export interface Reset extends Verify {
  password: string;
}

export interface ResetByQue extends SecurityQuestions {
  username: string;
}

export interface SecurityQuestions {
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface SetSecurityQuestions extends SecurityQuestions {
  password: string;
}

export interface CheckSecurityQuestions extends SecurityQuestions {
  username: string;
}
