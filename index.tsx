import React, { useEffect, useRef } from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import popupStore from "../../stores/popup";
import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { UserStore } from "../../stores/user";
import { observer } from "mobx-react";

interface DetectInactivityProps {
  children: any;
}

const DetectInactivity: React.FC<DetectInactivityProps> = observer(
  ({ children }) => {
    const { t } = useTranslation();
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const navigation = useNavigation();

    const logout = () => {
      UserStore.setIsLoggedIn(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "EnterPinScreen" }]
        })
      );
    };

    useEffect(() => {
      UserStore?.isLoggedIn && resetInactivityTimeout();
    }, [UserStore?.isLoggedIn, UserStore?.inActivityTime]);

    const panResponder = useRef<PanResponderInstance>(
      PanResponder.create({
        onStartShouldSetPanResponderCapture: () => {
          resetInactivityTimeout();
          return false;
        }
      })
    ).current;

    const resetInactivityTimeout = () => {
      if (UserStore?.isLoggedIn) {
        if (timerId.current) {
          clearTimeout(timerId.current);
        }
        timerId.current = setTimeout(() => {
          
          //The code that will run when the time expires should come here
          
        }, (UserStore?.inActivityTime ?? 30) * 1000);
      }
    };

    return UserStore?.isLoggedIn ? (
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {children}
      </View>
    ) : (
      <View style={{ flex: 1 }}>{children}</View>
    );
  }
);

export default DetectInactivity;
