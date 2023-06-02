import React, { useState } from 'react';
import styles from './ScheduleDetail.module.scss';

function DestinationList({
  destinations,
  onChecked
}: {
  destinations: string[][];
  onChecked: any;
}) {
  const [checkedDayIndex, setCheckedDayIndex] = useState(-1);

  return (
    <div className={styles.destinationsWrapper}>
      <div className={styles.destinationsTitle}>목적지 리스트</div>
      <label>
        <input
          type='checkbox'
          checked={checkedDayIndex === -1}
          onChange={() => {
            setCheckedDayIndex(-1);
            onChecked(destinations.flat());
          }}
        />
        전체 목적지 보기
      </label>
      <div className={styles.destinationsList}>
        {destinations.map((destOfDay, index) => {
          return (
            <ol
              key={index}
              className={styles.destinationsDay}
              id={'day' + (index + 1).toString()}
            >
              <label>
                <input
                  type='checkbox'
                  checked={checkedDayIndex === index}
                  onChange={() => {
                    if (checkedDayIndex === index) {
                      setCheckedDayIndex(-1);
                      onChecked(destinations.flat());
                    } else {
                      setCheckedDayIndex(index);
                      onChecked(destOfDay);
                    }
                  }}
                />{' '}
                Day {index + 1}
              </label>
              {destOfDay.map((dest, index) => (
                <li key={index}>{dest}</li>
              ))}
            </ol>
          );
        })}
      </div>
    </div>
  );
}

export default DestinationList;
