import { MapWithWaypointsPropsType } from './DestinationListTypes';
export interface IScheduleDetail {
  scheduleId: number;
  title: string;
  summary: string;
  userId: string;
  nickname: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  createdAt: Date;
  destinations: MapWithWaypointsPropsType[][];
  image: string;
  status: string;
}

export type ScheduleFetchedType = Pick<
  IScheduleDetail,
  | 'userId'
  | 'title'
  | 'summary'
  | 'nickname'
  | 'startDate'
  | 'endDate'
  | 'duration'
  | 'createdAt'
  | 'destinations'
  | 'image'
>;

export type ScheduleDetailInfoType = Pick<
  IScheduleDetail,
  | 'title'
  | 'summary'
  | 'nickname'
  | 'startDate'
  | 'endDate'
  | 'duration'
  | 'createdAt'
>;

export type IconsScheduleDetailType = {
  likesAmount: number;
  reviewsAmount: number;
};

interface ScheduleReviewType {
  contentId: string;
  commenterId: string;
  nickname: string;
  comment: string;
  createdAt: string;
}

export type ScheduleReviewPropsType = Pick<
  ScheduleReviewType,
  'nickname' | 'comment' | 'createdAt'
>;
