import styled from 'styled-components';
export const AccountInformationWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1fr);
  grid-gap: 20px;
  span {
    color: ${({ theme }) => theme.colors.blue};
  }
`;
export const SetName = styled.text`
  cursor: pointer;
`;
