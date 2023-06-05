export type Errors = {
  [key: string]: string;
};

//Register/RegisterForm
export type RegisterFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  birthDate: string;
  gender: 'male' | 'female';
  phoneNumber: string;
};

//Login/LoginForm
export type LoginFormValues = {
  email: string;
  password: string;
};

//MyPage/MyPageButtons
export type MyPageButtonsProps = {
  attemptDeleteAccount: () => void;
};

//MyPage/DeleteAccountForm
export type DeleteFormProps = {
  cancelDeleteAccount: () => void;
};

//UserEdit/UserInfo
export type UserInfoProps = {
  values: UserInfoValues;
  errors: Errors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

//UserEdit/UserInfoValues
export type UserInfoValues = {
  email: string;
  profileImage: string;
  nickname: string;
  newPassword: '';
  passwordConfirm: '';
  birthDate: string;
  gender: string;
  phoneNumber: string;
};

//UserEdit/ProfileImage
export type ProfileImageProps = {
  url: string;
};

//UserEdit/UserConfirmForm
export type UserConfirmFormProps = {
  confirmUser: () => void;
};