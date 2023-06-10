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
import UsersReview from './UsersReview';

const ALERT_PROPS = {
  message: '로그인이 필요한 기능입니다.',
  showTitle: false
};

const SUCCESS_ALERT_PROPS = {
  successMessage: '리뷰 등록에 성공했습니다.',
  failedMessage: '리뷰 등록에 실패했습니다. 다시 등록해주세요',
  showTitle: false
};

const RESPONSE_STATUS = {
  POST_SUCCESS: 201
};

const REVIEW_STANDARDS = {
  MIN_LENGTH: 5
};

function Review() {
  const [submittedReview, setSubmittedReview] = useState<commentType>({
    comment: null
  });
  const [allReviewList, setAllReviewList] = useState<
    DestinationsReviewType[] | null
  >(null);
  const [isAccessUsersReview, setIsAccessUsersReview] =
    useState<boolean>(false);
  const { authState } = useAuthState();
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState<boolean | null>(
    null
  );
  const { contentid } = useParams();
  const navigate = useNavigate();
  //리뷰 등록 -> 요청 -> 리뷰 목록 상태 리렌더링

  //리뷰 조회 메서드
  const getReviewList = useCallback(async () => {
    const res = await getReviewByDestinationId(Number(contentid));
    const reviewList = res?.data;
    setAllReviewList(() => reviewList);
  }, [contentid]);

  useEffect(() => {
    getReviewList();
  }, [getReviewList]);

  //리뷰 등록 메서드
  const addReview = useCallback(async () => {
    const res = await postReviewByDestinationId(
      Number(contentid),
      submittedReview
    );
    const status = res?.status;
    if (status === RESPONSE_STATUS.POST_SUCCESS) {
      setIsShowSuccessAlert(true);
      await getReviewList();
      return;
    }
    setIsShowSuccessAlert(false);
  }, [contentid, getReviewList, submittedReview]);

  //리뷰 수
  const reviewCount = useMemo(() => {
    return allReviewList?.length;
  }, [allReviewList]);

  const isNullishReviewInput = (input: string) => {
    return input === '' || input.length <= REVIEW_STANDARDS.MIN_LENGTH;
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
      alert(`내용을 ${REVIEW_STANDARDS.MIN_LENGTH}자 이상 입력해주세요.`);
    }

    setSubmittedReview(() => {
      return { comment: userReview };
    });
    e.target.review.value = null;
  };

  useEffect(() => {
    if (submittedReview.comment !== null) {
      addReview();
      return;
    }
  }, [submittedReview.comment, addReview]);

  //사용자 리뷰 목록 조회 시도
  const handleUsersReviewClick = () => {
    if (authState.isLoggedIn) {
      setIsAccessUsersReview(true);
      return;
    }
    setIsShowAlert(true);
    return;
  };

  const handleOnLoginConfirm = () => {
    setIsShowAlert(false);
    navigate('/login');
    return;
  };

  const handleOnReviewConfirm = () => {
    setIsShowSuccessAlert(null);
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
      <section className={styles.reviewContainer}>
        <h3 className={styles.reviewBanner}>{`리뷰(${reviewCount})`}</h3>
        <div className={styles.reviewBoxes}>
          {allReviewList?.map((review, index) => {
            return (
              <div key={index} className={styles.review}>
                <p className={styles.reviewerNickname}>
                  {review.user.nickname}
                </p>
                <p className={styles.reviewComment}>{review.comment}</p>
                <p className={styles.reviewCreatedDate}>{review.created_at}</p>
              </div>
            );
          })}
        </div>
        <form className={styles.reviewInputBar} onSubmit={handleReviewSubmit}>
          <input
            id={styles.reviewInputBar}
            type='text'
            name='review'
            placeholder={
              authState.isLoggedIn
                ? '리뷰를 작성해주세요.'
                : '로그인이 필요합니다.'
            }
          />
          <button id={styles.reviewButton} type='submit'>
            등록
          </button>
        </form>
        <div className={styles.usersReviewListButtonContainer}>
          <button
            id={styles.usersReviewListButton}
            onClick={handleUsersReviewClick}
          >
            내 리뷰 목록
          </button>
        </div>
      </section>
      {isAccessUsersReview && <UsersReview />}
      {isShowAlert && (
        <AlertModal
          message={ALERT_PROPS.message}
          onConfirm={handleOnLoginConfirm}
          showTitle={ALERT_PROPS.showTitle}
        />
      )}
      {isShowSuccessAlert && (
        <AlertModal
          message={SUCCESS_ALERT_PROPS.successMessage}
          onConfirm={handleOnReviewConfirm}
          showTitle={ALERT_PROPS.showTitle}
        />
      )}
      {isShowSuccessAlert === false && (
        <AlertModal
          message={SUCCESS_ALERT_PROPS.failedMessage}
          onConfirm={handleOnReviewConfirm}
          showTitle={ALERT_PROPS.showTitle}
        />
      )}
    </>
  );
}

export default Review;
