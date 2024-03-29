import React, { useContext } from 'react';
import { Title } from 'components/atoms/Title/Title.style';
import FieldWithInput from 'components/molecules/FieldWithInput/FieldWithInput';
import styled from 'styled-components';
import { Button } from 'components/atoms/Button/Button.style';
import { AddData } from 'configFirebase/firebase';
import { appContext } from 'providers/Providers';
import { useState } from 'react';
import { alertForEmptyInput, alertForAddingWordsToDataBase, notificationForNeedingAccount } from 'helpers/sweetAlert';
import { BasicContainer } from 'components/molecules/BasicContainer/BasicContainer.style';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { downloadData } from 'store/wordsSlice';
import { getLowestId } from 'configFirebase/firebase';

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
`;
const ButtonContainer = styled.div`
  align-self: center;
`;
const TypingMode = () => {
  const data = useSelector((state) => state.wordsDataSlice.words); // used to get the id of new item
  const wordsUsedIds = data.map((item) => item.id);
  const initialState = { engWord: '', plWord: '', id: '' };
  const [words, setWords] = useState(initialState);
  const ctx = useContext(appContext);
  const dispatch = useDispatch();

  return (
    <BasicContainer>
      <Wrapper>
        <Title>Typing Mode</Title>
        <FieldWithInput updateValuesMethod={setWords} name="engWord" words={words} textContent="English Word:"></FieldWithInput>
        <FieldWithInput updateValuesMethod={setWords} name="plWord" words={words} textContent="Polish Word:"></FieldWithInput>
        <ButtonContainer>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (words.engWord.length === 0 || words.plWord.length === 0) {
                alertForEmptyInput();
              } else {
                const userEmail = ctx.currentUser.email;
                const userHasEmail = ctx.currentUser.email ? true : false;
                if (userHasEmail) {
                  //User signed with Email
                  AddData(userEmail, { engWord: words.engWord, plWord: words.plWord }, wordsUsedIds);
                } else {
                  //Anonymous User
                  if (data.length >= 10) {
                    notificationForNeedingAccount();
                  } else {
                    words.id = getLowestId(wordsUsedIds);
                    dispatch(downloadData([...data, words]));
                    alertForAddingWordsToDataBase();
                  }
                }
                setWords(initialState);
              }
            }}
          >
            ADD
          </Button>
        </ButtonContainer>
      </Wrapper>
    </BasicContainer>
  );
};
export default TypingMode;
