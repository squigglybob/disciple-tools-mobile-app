import React, { useState, useEffect } from "react";

//Components
import { Image, Keyboard, Linking, View } from "react-native";
import { UsernameIcon, EyeIcon, KeyIcon, LinkIcon } from "components/Icon";
import Button from "components/Button";
import Link from "components/Link";
import PluginRequired from "components/PluginRequired";
import { LabeledTextInput } from "components/LabeledTextInput";
import LanguagePicker from "components/Picker/LanguagePicker";
import AppVersion from "components/AppVersion";

//Hooks
import { useAuth } from "hooks/use-auth";
import useI18N from "hooks/use-i18n";
import usePlugins from "hooks/use-plugins";
import useStyles from "hooks/use-styles";
import useToast from "hooks/use-toast";

//Styles
import { localStyles } from "./LoginScreen.styles";

const LoginScreen = () => {
  
  const { styles, globalStyles } = useStyles(localStyles);
  const { user, rememberLoginDetails, signIn } = useAuth();
  const { i18n } = useI18N();
  const { mobileAppPlugin } = usePlugins();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    domainValidation: false,
    userValidation: false,
    passwordValidation: false,
  });

  const [domainInput, setDomainInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, toggleShowPassword] = useState(false)

  useEffect(() => {
    if (rememberLoginDetails && user) {
      setUsernameInput(user.username);
      setDomainInput(user.domain);
    }
  }, []);

  // TODO: add validation
  const onLoginPress = async () => {
    Keyboard.dismiss();
    setLoading(true);

    // TODO ensure that React Native allows empty string checks like this
    if (domainInput.length > 0 && usernameInput.length > 0 && passwordInput.length > 0) {
      const cleanedDomain = domainInput?.trim()?.replace("http://", "")?.replace("https://", "");
      try {
        await signIn(cleanedDomain, usernameInput, passwordInput);
      } catch (error) {
        toast(error.message, true);
      } finally {
        setLoading(false);
      }
    } else {
      setState({
        ...state,
        domainValidation: domainInput.length === 0,
        userValidation: usernameInput.length === 0,
        passwordValidation: passwordInput.length === 0,
      });
      setLoading(false);
    }
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Image
          source={require("assets/dt-icon.png")}
          style={styles.welcomeImage}
        />
      </View>
    );
  };

  const ForgotPasswordLink = () => (
    <Link
      disabled={loading}
      title={i18n.t("global.forgotPassword")}
      onPress={() => {
        if (domainInput?.length > 0) {
          Linking.openURL(`https://${domainInput}/wp-login.php?action=lostpassword`);
        } else {
          toast(i18n.t("loginScreen.domain.errorForgotPass"), true);
        }
      }}
      containerStyle={styles.forgotPasswordLink}
    />
  );


  return (
    <View style={globalStyles.screenContainer}>
      <Header />
      <View style={styles.formContainer}>
        <PluginRequired {...mobileAppPlugin} />
        <LabeledTextInput 
          editing
          value={domainInput}
          i18nKey='global.url'
          onChangeText={text => setDomainInput(text)}
          startIcon={<LinkIcon />}
          textContentType="URL"
          keyboardType="url"
          disabled={loading}
          error={state.domainValidation}
        />
        <LabeledTextInput 
          editing
          value={usernameInput}
          i18nKey='global.username'
          onChangeText={text => setUsernameInput(text)}
          startIcon={<UsernameIcon />}
          textContentType="emailAddress"
          keyboardType="email-address"
          disabled={loading}
          error={state.userValidation}
        />
        <LabeledTextInput 
          editing
          value={passwordInput}
          i18nKey='global.password'
          onChangeText={text => setPasswordInput(text)}
          disabled={loading}
          startIcon={<KeyIcon />}
          endIcon={
            <EyeIcon
              onPress={() => toggleShowPassword(!showPassword)}
              style={styles.showPasswordIcon(showPassword)}
            />
          }
          secureTextEntry={!showPassword}
          error={state.passwordValidation}
        />
        <Button title={i18n.t("global.login")} loading={loading} onPress={onLoginPress} />
        <ForgotPasswordLink />
        <LanguagePicker />
        <AppVersion />
      </View>
    </View>
  );
};

export default LoginScreen;
