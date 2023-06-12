import React, { useState } from 'react';
import { useAuthState } from '../../contexts/AuthContext';
import styles from './InputReviewSchedule.module.scss';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

function InputReviewSchedule({
  onReviewSubmit
}: {
  onReviewSubmit: (input: string) => void;
}) {
  const [reviewTyping, setReviewTyping] = useState<string>('');
  const isLoggedIn: boolean = useAuthState().authState.isLoggedIn as boolean;
  const nickname: string = useAuthState().authState.user?.nickname as string;
  const profileImage: string = useAuthState().authState.user
    ?.profile_image as string;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewTyping(event.target.value);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.reviewInputContainer}>
          {profileImage ? (
            <Avatar sx={{ width: 50, height: 50 }} src={profileImage} />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }}>{nickname[0]}</Avatar>
          )}
          <TextField
            className={styles.reviewsInput}
            onChange={handleChange}
            label='리뷰를 입력하세요.'
            value={reviewTyping}
          />
          <button
            className={styles.reviewsInputButton}
            onClick={() => {
              onReviewSubmit(reviewTyping);
              setReviewTyping('');
            }}
          >
            제출
          </button>
        </div>
      ) : (
        <div className={styles.reviewInputContainer}>
          리뷰를 남기시려면 로그인해주세요.
        </div>
      )}
    </>
  );
}

export default InputReviewSchedule;
