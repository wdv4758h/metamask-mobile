import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OutlinedTextField } from 'react-native-material-textfield';
import { createStyles } from './styles';
import ReusableModal, { ReusableModalRef } from '../ReusableModal';
import WarningExistingUserModal from '../WarningExistingUserModal';
import { strings } from '../../../../locales/i18n';
import { useTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import { createNavigationDetails } from '../../..//util/navigation/navUtils';
import useValidatePassword from '../../hooks/useValidatePassword';

const DELETE_KEYWORD = 'delete';

export const createTurnOffRememberMeModalNavDetails = createNavigationDetails(
  Routes.MODAL.ROOT_MODAL_FLOW,
  Routes.MODAL.TURN_OFF_REMEMBER_ME,
);

const TurnOffRememberMeModal = () => {
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);

  const modalRef = useRef<ReusableModalRef>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [passwordText, setPasswordText] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [doesPasswordMatch] = useValidatePassword();

  const showConfirmModal = () => {
    setShowConfirm(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const isValidPassword = async (text: string) => await doesPasswordMatch(text);

  const checkDelete = async (text: string) => {
    setPasswordText(text);
    setDisableButton(!(await isValidPassword(text)));
  };

  const dismissModal = (cb?: () => void): void =>
    modalRef?.current?.dismissModal(cb);

  const triggerClose = (): void => dismissModal();

  const disableRememberMe = async () => {
    triggerClose();
  };

  return (
    <ReusableModal ref={modalRef}>
      {showConfirm ? (
        <WarningExistingUserModal
          warningModalVisible
          cancelText={'Turn off remember me'}
          cancelButtonDisabled={disableButton}
          onCancelPress={disableRememberMe}
          onRequestClose={triggerClose}
          onConfirmPress={triggerClose}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.areYouSure}>
              <Text style={[styles.heading, styles.delete]}>
                Type your password to disable remember me
              </Text>
              <OutlinedTextField
                style={styles.input}
                testID={'TurnOffRememberMeConfirm'}
                autoFocus
                returnKeyType={'done'}
                onChangeText={checkDelete}
                autoCapitalize="none"
                value={passwordText}
                baseColor={colors.border.default}
                tintColor={colors.primary.default}
                placeholderTextColor={colors.text.muted}
                keyboardAppearance={themeAppearance}
              />
            </View>
          </TouchableWithoutFeedback>
        </WarningExistingUserModal>
      ) : (
        <WarningExistingUserModal
          warningModalVisible
          cancelText={strings('login.i_understand')}
          onCancelPress={showConfirmModal}
          onRequestClose={triggerClose}
          onConfirmPress={triggerClose}
        >
          <View style={styles.areYouSure} testID={'TurnOffRememberMe'}>
            <Icon
              style={styles.warningIcon}
              size={46}
              color={colors.error.default}
              name="exclamation-triangle"
            />
            <Text style={[styles.heading, styles.red]}>
              Are you sure you want to turn off remember me?
            </Text>
            <Text style={styles.warningText}>
              <Text>You will need your password to login </Text>
            </Text>
            <Text style={[styles.warningText]}>
              <Text>{strings('login.you_can_only')}</Text>
              <Text style={styles.bold}>
                {strings('login.recovery_phrase')}
              </Text>
              <Text>{strings('login.metamask_does_not')}</Text>
            </Text>
          </View>
        </WarningExistingUserModal>
      )}
    </ReusableModal>
  );
};

export default React.memo(TurnOffRememberMeModal);
