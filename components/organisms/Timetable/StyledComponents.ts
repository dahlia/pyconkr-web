import styled from '@emotion/styled'
import { CORAL } from 'styles/colors'

export const DateNavWrapper = styled.div`
  display: flex;
  justify-content: center;
  color: #088487;
  margin-bottom: 40px;
  font-size: 30px;
  font-weight: 600;
`

export const DateNav = styled.div<{ isActive?: boolean }>`
  margin: 0 10px;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: ${props => props.isActive ? `2px solid ${CORAL}` : ''}
`

export const TimetableContents = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  color: #4a4a4a;
  font-size: 14px;
`

export const TimeTableContentItem = styled.div<{
  isBorderBottom?: boolean;
  isBorderTop?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: ${props => props.isBorderTop ? 'solid 2px #088487;' : ''};
  border-bottom: ${props => props.isBorderBottom ? 'solid 1px #dfe3e6' : ''};
  .time {
    flex: 1;
    text-align: center;
  }

  .content {
    flex: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: ${props => props.isBorderBottom ? '' : 'solid 1px #dfe3e6'};
    height: 60px;
    padding-top: 20px;
    padding-bottom: 20px;

    .room {
      flex: 1;
      text-align: center;
      color: #088487;
    }

    .title {
      flex: 5;
      cursor: pointer;

      &:hover {
        color: #088487;
        font-weight: 600;
      }
    }
  }
`
