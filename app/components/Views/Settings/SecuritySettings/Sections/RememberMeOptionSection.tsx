import React, { useState, useEffect, useCallback } from 'react';
import { SecurityOptionToggle } from '../components';
import { strings } from '../../../../../../locales/i18n';
import { checkIfRememberMeEnabled } from '../../../Login/checkIfUsingRememberMe';
import { useSelector, useDispatch } from 'react-redux';
import { setAllowLoginWithRememberMe } from '../../../../../actions/security';
import { useNavigation } from '@react-navigation/native';
import { createTurnOffRememberMeModalNavDetails } from '../../../..//UI/TurnOffRememberMeModal/TurnOffRememberMeModal';

const RememberMeOptionSection = () => {
  const { navigate } = useNavigation();
  const allowLoginWithRememberMe = useSelector(
    (state: any) => state.security.allowLoginWithRememberMe,
  );
  const [isUsingRememberMe, setIsUsingRememberMe] = useState<boolean>(false);
  useEffect(() => {
    const checkIfAlreadyUsingRememberMe = async () => {
      const isUsingRememberMeResult = await checkIfRememberMeEnabled();
      setIsUsingRememberMe(isUsingRememberMeResult);
    };
    checkIfAlreadyUsingRememberMe();
  }, []);

  const dispatch = useDispatch();

  const toggleRememberMe = useCallback(
    (value: boolean) => {
      dispatch(setAllowLoginWithRememberMe(value));
    },
    [dispatch],
  );

  const onValueChanged = useCallback(
    (enabled: boolean) => {
      isUsingRememberMe
        ? navigate(...createTurnOffRememberMeModalNavDetails())
        : toggleRememberMe(enabled);
    },
    [isUsingRememberMe, navigate, toggleRememberMe],
  );

  return (
    <SecurityOptionToggle
      title={strings(`remember_me.enable_remember_me`)}
      description={strings(`remember_me.enable_remember_me_description`)}
      value={allowLoginWithRememberMe}
      onOptionUpdated={(value) => onValueChanged(value)}
    />
  );
};

export default React.memo(RememberMeOptionSection);
