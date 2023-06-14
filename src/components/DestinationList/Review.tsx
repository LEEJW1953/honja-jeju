import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Review.module.scss';
import {
  DestinationsReviewType,
  commentType
} from '../../types/DestinationListTypes';
import { useAuthState } from '../../contexts/AuthContext';
import AlertModal from '../common/Alert/AlertModal';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getReviewByDestinationId,
  postReviewByDestinationId
} from '../../apis/destinationList';
import { Avatar, TextField } from '@mui/material';
import ReviewManagement from './ReviewManagement';

const ALERT_PROPS = {
  message: '로그인이 필요한 기능입니다.',
  showTitle: false
};

const RESPONSE_STATUS = {
  POST_SUCCESS: 201
};

function Review() {
  const [submittedReview, setSubmittedReview] = useState<commentType>({
    comment: null
  });
  const [allReviewList, setAllReviewList] = useState<
    DestinationsReviewType[] | null
  >(null);

  const { authState } = useAuthState();
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [targetComment, setTargetComment] = useState<number | null>(null);
  const { contentid } = useParams();
  const navigate = useNavigate();
  //리뷰 등록 -> 요청 -> 리뷰 목록 상태 리렌더링

  //리뷰 조회 메서드
  const getReviewList = useCallback(async () => {
    const res = await getReviewByDestinationId(Number(contentid));
    const reviewList = res?.data;
    setAllReviewList(() => reviewList);
  }, [contentid, setAllReviewList]);

  useEffect(() => {
    getReviewList();
  }, [getReviewList]);

  // useEffect(() => {
  //   if (!isEditing) {
  //     getReviewList();
  //   }
  // }, [isEditing]);

  //리뷰 등록일자 가공 매서드
  const changeCreatedAtIntoDate = (date: string) => {
    const reviewDate = new Date(date);
    const year = reviewDate.getFullYear();
    const month = reviewDate.getMonth() + 1;
    const day = reviewDate.getDate();
    const hour = reviewDate.getHours().toString().padStart(2, '0');
    const minute = reviewDate.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  //리뷰 등록 메서드
  const addReview = useCallback(
    async (contentid: number) => {
      const res = await postReviewByDestinationId(contentid, submittedReview);
      const status = res?.status;
      if (status === RESPONSE_STATUS.POST_SUCCESS) {
        await getReviewList();
      }
      return;
    },
    [contentid, getReviewList, submittedReview]
  );

  //리뷰 수
  const reviewCount = useMemo(() => {
    return allReviewList?.length;
  }, [allReviewList]);

  const isNullishReviewInput = (input: string) => {
    return input === '';
  };

  //리뷰 등록 시도
  const handleReviewSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authState.isLoggedIn) {
      setIsShowAlert(true);
      return;
    }
    const userReview = e.target.review.value;
    if (isNullishReviewInput(userReview)) {
      alert(`내용을 입력해주세요.`);
      return;
    }

    setSubmittedReview(() => {
      return { comment: userReview };
    });
    e.target.review.value = null;
    return;
  };

  useEffect(() => {
    if (submittedReview.comment !== null) {
      addReview(Number(contentid));
      setSubmittedReview(() => {
        return { comment: null };
      });
    }
  }, [submittedReview.comment, setSubmittedReview, addReview]);

  //유저의 댓글인지 확인하는 매서드
  const isUserReviewer = useCallback(
    (review: DestinationsReviewType) => {
      if (review?.user?.id) {
        return review?.user?.id === authState.user?.id;
      }
    },
    [authState]
  );

  const handleOnLoginConfirm = () => {
    setIsShowAlert(false);
    navigate('/login');
    return;
  };

  /*
   * 리뷰 객체
  id: number;
  commenter_id: string;
  comment: string;
  created_at: string; */

  return (
    <>
      <section className={styles.reviewWrapper}>
        <h3 className={styles.reviewBanner}>{`리뷰(${reviewCount})`}</h3>
        <div className={styles.reviewContainer}>
          {allReviewList?.map((review, index) => {
            return (
              <div key={index} className={styles.reviewBox}>
                <div className={styles.reviewUserInfo}>
                  <Avatar
                    className={styles.reviewerAvatar}
                    src={review.user.profile_image}
                  >
                    {review.user.nickname[0]}
                  </Avatar>
                  <div className={styles.reviewInfo}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerNickname}>
                        {review.user.nickname}
                      </span>
                      {isUserReviewer(review) && (
                        <ReviewManagement
                          isEditing={isEditing}
                          setIsEditing={setIsEditing}
                          getReviewList={getReviewList}
                          targetComment={targetComment}
                          setTargetComment={setTargetComment}
                          commentid={review?.comment_id}
                        />
                      )}
                    </div>

                    <div className={styles.reviewDate}>
                      <span id={styles.reviewCreatedDate}>
                        {changeCreatedAtIntoDate(review.created_at)}
                      </span>
                      {review.created_at !== review.updated_at && (
                        <span className={styles.reviewModifiedDate}>
                          수정됨
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            );
          })}
        </div>
        {!isEditing && (
          <div className={styles.reviewInputContainer}>
            <Avatar
              className={styles.reviewInputAvatar}
              src={authState?.user?.profile_image}
            >
              {authState.user?.nickname[0] ?? 'G'}
            </Avatar>
            <form
              className={styles.reviewInputForm}
              onSubmit={handleReviewSubmit}
            >
              <TextField
                className={styles.reviewInputBar}
                type='text'
                name='review'
                size='small'
                label={
                  authState.isLoggedIn
                    ? '리뷰를 작성해주세요.'
                    : '로그인이 필요합니다.'
                }
                sx={{
                  '& label.Mui-focused': { color: '#ef6d00' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#fe9036',
                      borderWidth: '1px'
                    }
                  }
                }}
              />
              <button className={styles.reviewButton} type='submit'>
                등록
              </button>
            </form>
          </div>
        )}
      </section>
      {isShowAlert && (
        <AlertModal
          message={ALERT_PROPS.message}
          onConfirm={handleOnLoginConfirm}
          showTitle={ALERT_PROPS.showTitle}
        />
      )}
    </>
  );
}

export default Review;
