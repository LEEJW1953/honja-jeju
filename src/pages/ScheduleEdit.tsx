import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/ScheduleEdit/ScheduleEdit.module.scss';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import {
  ScheduleEditImageComponent,
  ScheduleEditDateComponent,
  ScheduleEditInfoComponent,
  DestinationListComponent
} from '../components/ScheduleEdit';

type Schedule = {
  createdBy: string;
  title: string;
  summary: string;
  duration: string;
  startDate: string;
  endDate: string;
  image: string;
  createdAt: string;
};

const schedule: Schedule = {
  createdBy: '제주123',
  title: '혼자 떠나는 우도 여행',
  summary: '혼자 떠나는 우도 여행 일정입니다.',
  duration: '3',
  startDate: '2023.06.01.',
  endDate: '2023.06.03.',
  image:
    'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80',
  createdAt: '2023.04.01.'
};

const destinations = [
  ['제주국제공항', '협재포구', '북촌 돌하르방공원'],
  ['두문포항', '우도', '지미봉'],
  ['월정리 해수욕장', '김녕항', '세화해변', '제주국제공항'],
  ['제주국제공항', '제주국제공항', '제주국제공항']
];

function ScheduleDetail() {
  const [isPublic, setIsPublic] = useState(false);
  const [checkedDestinations, setCheckedDestinations] = useState(
    destinations.flat()
  );

  const onDestinationsChecked = (destinations: string[]) => {
    setCheckedDestinations(destinations);
  };

  return (
    <div className={styles.container}>
      <ScheduleEditImageComponent image={schedule.image} />
      <ScheduleEditDateComponent
        duration={schedule.duration}
        startDate={schedule.startDate}
        endDate={schedule.endDate}
      />
      <ScheduleEditInfoComponent
        title={schedule.title}
        writer={schedule.createdBy}
        date={schedule.createdAt}
        description={schedule.summary}
      />
      <div className={styles['public-status']}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onClick={() => setIsPublic((prev) => !prev)}
              />
            }
            label='공개 여부'
          />
        </FormGroup>
        <div>{isPublic ? '공개' : '비공개'}</div>
      </div>
      <DestinationListComponent
        destinations={destinations}
        onChecked={onDestinationsChecked}
      />
      <div className={styles.map}>
        {checkedDestinations.map((dest, index) => (
          <div key={index}>{dest}</div>
        ))}
      </div>
      <div className={styles['confirm-button-wrapper']}>
        <button>수정완료</button>
      </div>
    </div>
  );
}

export default ScheduleDetail;
