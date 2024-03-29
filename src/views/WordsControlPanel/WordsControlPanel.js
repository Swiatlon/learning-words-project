import { CenterContainer } from 'components/molecules/CenterContainer/CenterContainer.style';
import deleteIcon from 'assets/images/icons/x-circle.svg';
import editIcon from 'assets/images/icons/edit.svg';
import arrowDown from 'assets/images/icons/arrow-down.svg';
import arrowUp from 'assets/images/icons/arrow-up.svg';
import { useSelector, useDispatch } from 'react-redux';
import { useContext, useState } from 'react';
import { appContext } from 'providers/Providers';
import { deleteSingleData, deleteAllData } from 'configFirebase/firebase';
import { alertForEditingWords, alertForConfirmDeletingData, notificationForNeedingAccount } from 'helpers/sweetAlert';
import Input from 'components/atoms/Input/Input';
import { Table, TableAdditionalOptions, TableItemsContainer, Row } from './WordsControlPanel.style';
import { downloadData, deleteWord } from 'store/wordsSlice';
import { updateWordToTranslate } from 'store/wordToTranslateSlice';
import { getNewWord } from 'helpers/helpersJS';

function WordsControlPanel() {
  //Data
  const ctx = useContext(appContext);
  const user = ctx.currentUser.email;
  const words = useSelector((state) => state.wordsDataSlice.words);
  const [isHidden, setIsHidden] = useState(true);
  //Input
  const initialInputValue = '';
  const [inputValue, setInputValue] = useState(initialInputValue);
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };
  //Filtering
  let filteredData;
  if (isHidden) {
    filteredData = words;
  } else {
    const regExp = new RegExp(`${inputValue}`, 'gi');
    filteredData = words.filter((word) => word.engWord.match(regExp) || word.plWord.match(regExp));
  }
  //Redux ()
  const dispatch = useDispatch();
  function reduxDataDelete() {
    dispatch(
      updateWordToTranslate({
        id: '',
        engWord: '',
        plWord: '',
      })
    );
    dispatch(downloadData([]));
  }
  return (
    <CenterContainer modifiers="none">
      <Table>
        <img
          className="arrow"
          alt="icon"
          src={isHidden ? arrowUp : arrowDown}
          onClick={() => {
            setIsHidden(!isHidden);
          }}
        ></img>
        <TableAdditionalOptions className={isHidden ? 'hidden-content' : 'show-content'}>
          <Input placeholder={'Type words to filter'} value={inputValue} onChange={handleInput}></Input>
          <button
            onClick={() => {
              alertForConfirmDeletingData(deleteAllData, reduxDataDelete, user);
            }}
          >
            <strong>Delete All</strong>
          </button>
        </TableAdditionalOptions>
        <TableItemsContainer>
          <Row className="sticky">
            <div>
              <strong>Lp.</strong>
            </div>
            <div>
              <strong>English Word</strong>
            </div>
            <div>
              <strong>Polish Word</strong>
            </div>
            <div>
              <strong>Actions</strong>
            </div>
          </Row>
          {filteredData.map((word, index) => {
            // index+1 cause the array start from 0 and I want to itterate from 1
            return (
              <Row key={word.id}>
                <div className="indexes">{index + 1}</div>
                <div className="word">
                  <p>{word.engWord}</p>
                </div>
                <div className="word">
                  <p>{word.plWord}</p>
                </div>
                <div className="action">
                  <button
                    name="edit-item-button"
                    className="buttonRectangle"
                    onClick={() => {
                      if (user) {
                        alertForEditingWords(word.engWord, word.plWord, word.id, user);
                      } else {
                        notificationForNeedingAccount();
                      }
                    }}
                  >
                    <img alt="edit-Icon" src={editIcon}></img>
                  </button>
                  <button
                    name="delete-item-button"
                    className="buttonCircle"
                    onClick={() => {
                      if (user) {
                        deleteSingleData(user, word.id);
                      } else {
                        const initialState = {
                          id: '',
                          engWord: '',
                          plWord: '',
                        };
                        const arrayWithoutDeletedElement = filteredData.filter((item) => item.id !== word.id);
                        dispatch(deleteWord(arrayWithoutDeletedElement));
                        arrayWithoutDeletedElement.length
                          ? dispatch(updateWordToTranslate(getNewWord(arrayWithoutDeletedElement)))
                          : dispatch(updateWordToTranslate(initialState));
                      }
                    }}
                  >
                    <img alt="delete-Icon" src={deleteIcon}></img>
                  </button>
                </div>
              </Row>
            );
          })}
        </TableItemsContainer>
      </Table>
    </CenterContainer>
  );
}

export default WordsControlPanel;
