import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import Card from "components/Card/Card";
import ExpandableCard from "components/Card/ExpandableCard";
import Placeholder from "components/Placeholder";
import { DeclineIcon, AcceptIcon } from "components/Icon";

import useAPI from "hooks/use-api";
import useFilters from "hooks/use-filters";
import useI18N from "hooks/use-i18n";
import useList from "hooks/use-list";
import useStyles from "hooks/use-styles";

import { TabScreenConstants, TypeConstants, ScreenConstants } from "constants";

import { findFilterById } from "utils";

import { localStyles } from "./PendingContactsCard.styles";

const PendingContactsCard = ({ refreshing, onRefresh }) => {
  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, numberFormat } = useI18N();

  const { updatePost } = useAPI();

  const { data: contactFilters, mutate: mutateContactFilters } = useFilters({
    type: TypeConstants.CONTACT,
  });
  const filter = findFilterById("my_assigned", contactFilters);
  const title = filter ? filter?.name : "";
  const {
    data: contacts,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useList({ filter, type: TypeConstants.CONTACT });

  const [_contacts, setContacts] = useState(contacts);

  useEffect(() => {
    if (mutate) mutate();
  }, [refreshing]);

  // https://dtdemo.disciple.tools/wp-json/dt-posts/v2/contacts/96/accept
  // { "accept" true|false }
  const handleAccept = ({ contact, accept }) => {
    setContacts(_contacts?.filter((_contact) => _contact.ID !== contact.ID));
    updatePost({
      urlPathPostfix: "/accept",
      fields: { accept },
      id: contact?.ID,
      type: contact?.post_type,
      mutate: onRefresh,
    });
  };

  const renderContactAccept = (contact, idx) => (
    <View
      key={idx}
      style={[globalStyles.columnContainer, styles.container(idx)]}
    >
      <Pressable
        onPress={() => {
          navigation.jumpTo(TabScreenConstants.CONTACTS, {
            screen: ScreenConstants.DETAILS,
            id: contact?.ID,
            name: contact?.title,
            type: TypeConstants.CONTACT,
          });
        }}
      >
        <Text style={styles.title}>{contact?.title}</Text>
      </Pressable>
      <View style={[globalStyles.rowContainer, styles.buttonRowContainer]}>
        <Pressable
          onPress={() => handleAccept({ contact, accept: true })}
          style={[styles.buttonContainer, styles.buttonAccept]}
        >
          <Text style={styles.buttonText}>{i18n.t("global.accept")}</Text>
        </Pressable>
        <Pressable
          onPress={() => handleAccept({ contact, accept: false })}
          style={[styles.buttonContainer, styles.buttonDecline]}
        >
          <Text style={styles.buttonText}>{i18n.t("global.decline")}</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderExpandedCard = () => (
    <ScrollView>
      {_contacts?.map((contact, idx) => renderContactAccept(contact, idx))}
    </ScrollView>
  );

  const renderPartialCard = () => (
    <>
      <View>
        {_contacts
          ?.slice(0, 1)
          ?.map((contact, idx) => renderContactAccept(contact, idx))}
      </View>
      {_contacts?.length > 1 && (
        <View style={styles.etcetera}>
          <Text>...</Text>
        </View>
      )}
    </>
  );

  if (!filter) return null;
  if (_contacts?.length > 1)
    return (
      <ExpandableCard
        border
        center
        title={title}
        count={numberFormat(_contacts?.length)}
        renderPartialCard={renderPartialCard}
        renderExpandedCard={renderExpandedCard}
      />
    );
  if (_contacts?.length > 0)
    return (
      <Card border center title={title} body={<>{renderPartialCard()}</>} />
    );
  return (
    <Card
      border
      center
      title={title}
      body={<Placeholder type={TypeConstants.CONTACT} />}
    />
  );
};
export default PendingContactsCard;
