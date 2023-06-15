import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './ScheduleList.module.scss';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import { ScheduleCardType, ScheduleListType } from '../../types/ScheduleTypes';
import { useAuthState } from '../../contexts/AuthContext';
import AlertModal from '../common/Alert/AlertModal';
import images from '../../constants/image';
import { FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Router from '../../constants/Router';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

function RecentScheduleLists() {
  const { authState } = useAuthState();
  const isLoggedIn = authState.isLoggedIn;
  const [recentScheduleList, setRecentScheduleList] =
    useState<ScheduleListType>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [recentPage, setRecentPage] = useState<number>(1);
  const [lastDataOfRecent, setLastDataOfRecent] = useState<boolean>(false);
  const lastElement = useRef<HTMLDivElement>(null);
  const SCHEDULES_PER_PAGE = 6;

  const fetchRecentData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/schedules/public/order/latest-created-date?page=${recentPage}&limit=${SCHEDULES_PER_PAGE}`
      );
      const scheduleData = response.data;
      setRecentScheduleList((prev) => [...prev, ...scheduleData]);
      if (scheduleData.length === 0) {
        setLastDataOfRecent(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setShowAlertModal(true);
      }
    }
  }, [recentPage]);

  useEffect(() => {
    if (!lastDataOfRecent) {
      fetchRecentData();
    }
  }, [fetchRecentData, recentPage, lastDataOfRecent]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (lastElement.current) {
      observer = new IntersectionObserver(
        (entry) => {
          if (entry[0].isIntersecting) {
            nextPage();
          }
        },
        { threshold: 1 }
      );
      observer.observe(lastElement.current);
    }
    return () => observer && observer.disconnect();
  }, [lastElement]);

  const nextPage = useCallback(() => {
    setRecentPage((prev) => prev + 1);
  }, [recentPage]);

  function handleOnConfirm() {
    setShowAlertModal(false);
  }

  return (
    <>
      <div className={styles.imageContainer}>
        <img
          src={images[3]}
          alt='일정 메인 이미지'
          className={styles.scheduleListImage}
        />
        <div className={styles.scheduleListTitle}>
          <h1>여행 일정</h1>
          <h2>마음에 드는 일정을 찾아보세요</h2>
        </div>
      </div>
      <div className={styles.scheduleContainer}>
        <div className={styles.scheduleFilter}>
          <Link
            to={`${Router.SCHEDULE_LIST}/likes`}
            className={styles.sortButton}
          >
            인기순
          </Link>
          <Link
            to={`${Router.SCHEDULE_LIST}/recent`}
            className={`${styles.sortButton} ${styles.selected}`}
          >
            최신순
          </Link>
          {isLoggedIn && (
            <Link
              to={`${Router.SCHEDULE_LIST}/liked`}
              className={styles.sortButton}
            >
              좋아요 한 일정
            </Link>
          )}
        </div>
        {showAlertModal && (
          <AlertModal
            message='여행 일정을 불러올 수 없습니다.'
            onConfirm={handleOnConfirm}
          />
        )}
        <div className={styles.scheduleCardContainer}>
          {recentScheduleList.length ? (
            recentScheduleList.map(
              (schedule: ScheduleCardType, index: number) => (
                <ScheduleCard schedule={schedule} key={index} />
              )
            )
          ) : (
            <div className={styles.noSchedule}>
              <FaExclamationCircle />
              <div>공개된 일정이 없습니다</div>
            </div>
          )}
        </div>
      </div>
      <div ref={lastElement} className={styles.lastElement}></div>
    </>
  );
}

export default RecentScheduleLists;