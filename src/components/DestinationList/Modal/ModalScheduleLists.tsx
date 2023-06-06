import React, { useState } from 'react';
import styles from './ModalScheduleLists.module.scss';
import dummy from '../../ScheduleList/ScheduleListDummy';
import ModalScheduleCard from './ModalScheduleCard';
import { MyScheduleListType } from '../../../types/ScheduleTypes';

export default function ModalScheduleLists() {
  const [scheduleList, setScheduleList] = useState<MyScheduleListType>(dummy);
  const [scheduleSort, setScheduleSort] = useState<string>('likes');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

  function handleSort(e: React.MouseEvent<HTMLButtonElement>) {
    const sortOption = (e.target as HTMLButtonElement).value;
    // console.log(sortOption);
    setScheduleSort(sortOption);
  }

  function handleShowDestinations(day: number) {
    setSelectedCardIdx(day);
  }
  // console.log(selectedCardIdx);

  // function handleCloseDestinations() {
  //   setSelectedCardIdx(null);
  // }
  // console.log(scheduleList);

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleListTitle}>여행 일정</div>
      <div className={styles.scheduleFilter}>
        <button
          className={`${styles.sortButton} ${
            scheduleSort === 'likes' ? styles.selected : ''
          }`}
          onClick={(e) => {
            handleSort(e);
          }}
          value='likes'
        >
          인기순
        </button>
        <button
          className={`${styles.sortButton} ${
            scheduleSort === 'recent' ? styles.selected : ''
          }`}
          onClick={(e) => {
            handleSort(e);
          }}
          value='recent'
        >
          최신순
        </button>
      </div>
      <div className={styles.scheduleCardContainer}>
        {scheduleList.map((schedule, index) => (
          <ModalScheduleCard
            key={schedule.id}
            schedule={schedule}
            index={index}
            isSelected={selectedCardIdx === index}
            onShowDestinations={handleShowDestinations}
            // onCloseDestinations={handleCloseDestinations}
          />
        ))}
        {/* <div className={styles.scheduleAdd}>일정 추가하기</div> */}
      </div>
    </div>
  );
}
