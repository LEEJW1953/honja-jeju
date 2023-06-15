import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './ScheduleList.module.scss';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import { ScheduleCardType, ScheduleListType } from '../../types/ScheduleTypes';
import AlertModal from '../common/Alert/AlertModal';
import { FaExclamationCircle } from 'react-icons/fa';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

function RecentScheduleLists() {
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
      <div ref={lastElement} className={styles.lastElement}></div>
    </>
  );
}

export default RecentScheduleLists;
