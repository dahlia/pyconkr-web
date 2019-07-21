import i18next from 'i18next'
import * as React from 'react'

import { StoresType } from 'pages/_app'
import { DateNav, DateNavWrapper, TimeTableContentItem, TimetableContents } from './StyledComponents'

type PropsType = {
  stores: StoresType;
  t: i18next.TFunction;
}

const dummyData = [
  {
    startTime: '15:10',
    endTime: '15:25',
    room: '',
    title: 'Keynote',
    level: '초급',
    isBreak: false,
  },
  {
    startTime: '15:25',
    endTime: '15:35',
    room: '',
    title: '쉬는시간',
    level: '초급',
    isBreak: true,
  },
  {
    startTime: '15:35',
    endTime: '16:15',
    room: '101',
    title: 'Title1',
    level: '초급',
    isBreak: false,
  },
  {
    startTime: '15:35',
    endTime: '16:15',
    room: '101',
    title: 'Title1',
    level: '초급',
    isBreak: false,
  },
  {
    startTime: '15:35',
    endTime: '16:15',
    room: '101',
    title: 'Title1',
    level: '초급',
    isBreak: false,
  },
]

class TimeTable extends React.Component<PropsType> {
  render() {
    return (
      <>
        <DateNavWrapper>
          <DateNav isActive>2019. 08. 17</DateNav>
          <DateNav>2019. 08. 18</DateNav>
        </DateNavWrapper>
        <TimetableContents>
          <TimeTableContentItem isBorderTop>
            <div className='time'>15:35 ~ 16:15</div>
            <div className='content'>
              <div className='room'>101</div>
              <div className='title'>
                <div>Test1</div>
                <div>초급</div>
              </div>
            </div>
          </TimeTableContentItem>
          <TimeTableContentItem>
            <div className='time'></div>
            <div className='content'>
              <div className='room'>101</div>
              <div className='title'>
                <div>Test2</div>
                <div>초급</div>
              </div>
            </div>
          </TimeTableContentItem>
          <TimeTableContentItem>
            <div className='time'></div>
            <div className='content'>
              <div className='room'>101</div>
              <div className='title'>
                <div>Test2</div>
                <div>초급</div>
              </div>
            </div>
          </TimeTableContentItem>
          <TimeTableContentItem isBorderBottom>
            <div className='time'></div>
            <div className='content'>
              <div className='room'>101</div>
              <div className='title'>
                <div>Test2</div>
                <div>초급</div>
              </div>
            </div>
          </TimeTableContentItem>
        </TimetableContents>
      </>
    )
  }
}

export default TimeTable
