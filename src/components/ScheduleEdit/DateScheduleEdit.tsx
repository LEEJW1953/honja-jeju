import React, { useEffect, useState } from 'react';
import styles from './DateScheduleEdit.module.scss';
import { FaCalendarAlt } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import ko from 'date-fns/locale/ko';

function DateScheduleEdit({
  dateInfo,
  handleDateInfo
}: {
  dateInfo: {
    startDate: Date;
    endDate: Date;
    duration: string;
  };
  handleDateInfo: any;
}) {
  type selectionType = {
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    key?: string | undefined;
  };

  const dateNow: selectionType = {
    startDate: dateInfo.startDate,
    endDate: dateInfo.endDate,
    key: 'selection'
  };

  const [selectedDate, setSelectedDate] = useState([dateNow]);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    const { startDate, endDate } = selectedDate[0];

    if (startDate && endDate) {
      const diffDay =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

      handleDateInfo({ startDate, endDate, duration: diffDay });
    }
  }, [selectedDate]);

  return (
    <>
      <div className={styles.dateContainer}>
        <span className={styles.duration}>
          {`${dateInfo.startDate.toLocaleDateString(
            'ko-KR'
          )} ~ ${dateInfo.endDate.toLocaleDateString('ko-KR')} (${
            dateInfo.duration
          }일)`}
        </span>
        <Tooltip title='날짜 수정하기' placement='right'>
          <IconButton onClick={handleOpen}>
            <FaCalendarAlt className={styles.durationEdit} />
          </IconButton>
        </Tooltip>
      </div>
      <Modal open={openModal} onClose={handleClose}>
        <Box className={styles.durationEditModal}>
          <p>수정하실 날짜를 선택하세요.</p>
          <DateRange
            className={styles.durationEditModalDate}
            locale={ko}
            editableDateInputs={true}
            onChange={(range) => {
              if (
                range['selection'].startDate === undefined ||
                range['selection'].endDate === undefined ||
                range['selection'].key === undefined
              ) {
                return;
              } else {
                setSelectedDate([range['selection']]);
              }
            }}
            moveRangeOnFirstSelection={false}
            ranges={selectedDate}
            months={2}
            direction='horizontal'
          />
          <button
            className={styles.durationEditModalConfirm}
            onClick={handleClose}
          >
            완료
          </button>
        </Box>
      </Modal>
    </>
  );
}

export default DateScheduleEdit;
