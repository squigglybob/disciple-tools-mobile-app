import { useCallback } from "react";

import useAPI from "hooks/use-api";
import useMyUser from "hooks/use-my-user";
import useRequest from "hooks/use-request";

import { searchObjList } from "utils";

const useNotifications = ({ search, filter, exclude, offset, limit } = {}) => {
  const { updatePost } = useAPI();
  const { data: userData } = useMyUser();
  const uid = userData?.ID;

  const markViewed = useCallback(
    ({ id } = {}) => {
      // if !id, then mark all as viewed
      // NOTE: *not* passing `mutate` bc we want responsive updates, but pull refresh will mutate
      if (!id && uid) {
        updatePost({
          urlPath: `/dt/v1/notifications/mark_all_viewed/${uid}`,
        });
        return;
      }
      if (id)
        updatePost({
          urlPath: `/dt/v1/notifications/mark_viewed/${id}`,
        });
    },
    [uid]
  );

  const markUnread = useCallback(({ id } = {}) => {
    // NOTE: *not* passing `mutate` bc we want responsive updates, but pull refresh will mutate
    if (id)
      updatePost({
        urlPath: `/dt/v1/notifications/mark_unread/${id}`,
      });
  }, []);

  // TODO: constant
  if (!limit) limit = 1000;

  const url = "dt/v1/notifications/get_notifications";
  const request = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      all: true,
      page: 0,
      limit,
      mentions: false,
    },
  };
  const {
    data: notifications,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useRequest(request);
  if (error || isLoading || !notifications)
    return {
      data: null,
      error,
      isLoading,
      isValidating,
      mutate,
    };

  let filtered = notifications.filter((item) => !exclude?.includes(item?.id));
  // NOTE: filter by key/value per "useFilters" query value
  if (filter?.query?.key && filter?.query?.value)
    filtered = filtered.filter(
      (item) => item?.[filter.query.key] === filter.query.value
    );
  //if (search && isConnected == false) filtered = searchObjList(filtered, search);
  if (search) filtered = searchObjList(filtered, search);
  const filteredRead = filtered?.filter((item) => item?.is_new === "0");
  const filteredNew = filtered?.filter((item) => item?.is_new === "1");
  // place new items at the top of list
  filtered = [...filteredNew, ...filteredRead];

  // NOTE: do not memoize or it will cause not render badge properly
  const hasNotifications = filteredNew?.length > 0;

  return {
    data: filtered,
    error,
    isLoading,
    isValidating,
    mutate,
    hasNotifications,
    markViewed,
    markUnread,
  };
};
export default useNotifications;
